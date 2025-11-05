package org.maplibre.reactnative.modules

import android.Manifest
import android.location.Location
import androidx.annotation.RequiresPermission
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import org.maplibre.android.location.engine.LocationEngineCallback
import org.maplibre.android.location.engine.LocationEngineResult
import org.maplibre.reactnative.NativeLocationModuleSpec
import org.maplibre.reactnative.events.LocationEvent
import org.maplibre.reactnative.location.LocationManager
import org.maplibre.reactnative.location.LocationManager.OnUserLocationChange

class MLRNLocationModule(reactContext: ReactApplicationContext) :
    NativeLocationModuleSpec(reactContext) {
    companion object {
        const val NAME = "MLRNLocationModule"
    }

    override fun getName() = NAME

    private var isEnabled = false
    private var minDisplacement = 0f
    private var isPaused = false

    private val locationManager: LocationManager = LocationManager.getInstance(reactContext)

    private val lifecycleEventListener: LifecycleEventListener = object : LifecycleEventListener {
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

    private val onUserLocationChangeCallback: OnUserLocationChange = object : OnUserLocationChange {
        override fun onLocationChange(location: Location) {
            val locationEvent = LocationEvent(location)
            emitOnUpdate(locationEvent.payload)
        }
    }

    init {
        reactContext.addLifecycleEventListener(lifecycleEventListener)
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    override fun start(minDisplacement: Double?) {
        if (minDisplacement != null) {
            this.minDisplacement = minDisplacement.toFloat()
        }

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
            object : LocationEngineCallback<LocationEngineResult?> {
                override fun onSuccess(result: LocationEngineResult?) {
                    val location = result?.lastLocation

                    if (location != null) {
                        val locationEvent = LocationEvent(location)
                        promise.resolve(locationEvent.getPayload())
                    } else {
                        promise.resolve(null)
                    }
                }

                override fun onFailure(exception: Exception) {
                    promise.reject(exception)
                }
            }
        )
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
}
