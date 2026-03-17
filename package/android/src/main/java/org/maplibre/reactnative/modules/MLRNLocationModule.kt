package org.maplibre.reactnative.modules

import android.Manifest
import android.location.Location
import android.os.Build
import androidx.annotation.RequiresPermission
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import org.maplibre.android.location.engine.LocationEngineCallback
import org.maplibre.android.location.engine.LocationEngineResult
import org.maplibre.reactnative.NativeLocationModuleSpec
import org.maplibre.reactnative.location.LocationManager
import org.maplibre.reactnative.location.LocationManager.OnUserLocationChange

class MLRNLocationModule(
    reactContext: ReactApplicationContext,
) : NativeLocationModuleSpec(reactContext) {
    companion object {
        const val NAME = "MLRNLocationModule"
    }

    override fun getName() = NAME

    private var isEnabled = false
    private var minDisplacement = 0f
    private var isPaused = false

    private val locationManager: LocationManager = LocationManager.getInstance(reactContext)

    private val lifecycleEventListener: LifecycleEventListener =
        object : LifecycleEventListener {
            @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
            override fun onHostResume() {
                if (isEnabled) {
                    startLocationManager()
                }
            }

            override fun onHostPause() {
                pauseLocationManager()
            }

            override fun onHostDestroy() {
                stopLocationManager()
            }
        }

    private val onUserLocationChangeCallback: OnUserLocationChange =
        object : OnUserLocationChange {
            override fun onLocationChange(location: Location) {
                emitOnUpdate(locationToGeolocationPosition(location))
            }
        }

    init {
        reactContext.addLifecycleEventListener(lifecycleEventListener)
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    override fun start() {
        isEnabled = true
        startLocationManager()
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    override fun setMinDisplacement(minDisplacement: Double) {
        if (this.minDisplacement == minDisplacement.toFloat()) return

        this.minDisplacement = minDisplacement.toFloat()
        if (isEnabled) {
            locationManager.setMinDisplacement(this.minDisplacement)
            locationManager.enable()
        }
    }

    override fun stop() {
        stopLocationManager()
    }

    fun pause() {
        pauseLocationManager()
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    override fun getCurrentPosition(promise: Promise) {
        locationManager.getLastKnownLocation(
            object :
                LocationEngineCallback<LocationEngineResult?> {
                override fun onSuccess(result: LocationEngineResult?) {
                    val location = result?.lastLocation

                    if (location != null) {
                        promise.resolve(locationToGeolocationPosition(location))
                    } else {
                        promise.resolve(null)
                    }
                }

                override fun onFailure(exception: Exception) {
                    promise.reject(exception)
                }
            },
        )
    }

    override fun requestPermissions(promise: Promise) {
        // On Android, permissions are handled at the JS level using PermissionsAndroid
        promise.resolve(null)
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    private fun startLocationManager() {
        locationManager.addLocationListener(onUserLocationChangeCallback)
        locationManager.setMinDisplacement(minDisplacement)
        locationManager.enable()
        isPaused = false
    }

    private fun pauseLocationManager() {
        if (isPaused) {
            return
        }

        locationManager.disable()
        isPaused = true
    }

    private fun stopLocationManager() {
        if (!isEnabled) {
            return
        }

        locationManager.removeLocationListener(onUserLocationChangeCallback)
        locationManager.dispose()
        isEnabled = false
        isPaused = false
    }

    private fun locationToGeolocationPosition(location: Location): WritableMap {
        val coords: WritableMap = WritableNativeMap()

        coords.putDouble("longitude", location.longitude)
        coords.putDouble("latitude", location.latitude)
        coords.putDouble("accuracy", location.accuracy.toDouble())

        if (location.hasAltitude()) {
            coords.putDouble("altitude", location.altitude)
        } else {
            coords.putNull("altitude")
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && location.hasVerticalAccuracy()) {
            coords.putDouble("altitudeAccuracy", location.verticalAccuracyMeters.toDouble())
        } else {
            coords.putNull("altitudeAccuracy")
        }

        if (location.hasBearing()) {
            coords.putDouble("heading", location.bearing.toDouble())
        } else {
            coords.putNull("heading")
        }

        if (location.hasSpeed()) {
            coords.putDouble("speed", location.speed.toDouble())
        } else {
            coords.putNull("speed")
        }

        val geolocationPosition: WritableMap = WritableNativeMap()
        geolocationPosition.putMap("coords", coords)
        geolocationPosition.putDouble("timestamp", location.time.toDouble())

        return geolocationPosition
    }
}
