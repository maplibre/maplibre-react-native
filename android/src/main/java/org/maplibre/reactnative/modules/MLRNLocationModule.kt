package org.maplibre.reactnative.modules

import android.Manifest
import android.location.Location
import androidx.annotation.RequiresPermission
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import org.maplibre.android.location.engine.LocationEngineCallback
import org.maplibre.android.location.engine.LocationEngineResult
import org.maplibre.reactnative.events.EventEmitter
import org.maplibre.reactnative.events.LocationEvent
import org.maplibre.reactnative.location.LocationManager
import org.maplibre.reactnative.location.LocationManager.OnUserLocationChange

@ReactModule(name = MLRNLocationModule.REACT_CLASS)
class MLRNLocationModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private var isEnabled = false
    private var mMinDisplacement = 0f
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

            val emitter = EventEmitter.getModuleEmitter(reactApplicationContext)
            emitter?.emit(LOCATION_UPDATE, locationEvent.getPayload())
        }
    }

    init {
        reactContext.addLifecycleEventListener(lifecycleEventListener)
    }

    override fun getName(): String {
        return REACT_CLASS
    }


    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    @ReactMethod
    fun start(minDisplacement: Float) {
        isEnabled = true
        mMinDisplacement = minDisplacement
        startLocationManager()
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    @ReactMethod
    fun setMinDisplacement(minDisplacement: Float) {
        if (mMinDisplacement == minDisplacement) return
        mMinDisplacement = minDisplacement
        if (isEnabled) {
            // set minimal displacement in the manager
            locationManager.setMinDisplacement(mMinDisplacement)

            // refresh values in location engine request
            locationManager.enable()
        }
    }

    @ReactMethod
    fun stop() {
        stopLocationManager()
    }

    @ReactMethod
    fun pause() {
        pauseLocationManager()
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    @ReactMethod
    fun getLastKnownLocation(promise: Promise) {
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

    @ReactMethod
    fun addListener(eventName: String?) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    private fun startLocationManager() {
        locationManager.addLocationListener(onUserLocationChangeCallback)
        locationManager.setMinDisplacement(mMinDisplacement)
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

    companion object {
        const val REACT_CLASS: String = "MLRNLocationModule"
        const val LOCATION_UPDATE: String = "MapboxUserLocationUpdate"
    }
}
