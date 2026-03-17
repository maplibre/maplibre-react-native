package org.maplibre.reactnative.location

import android.Manifest
import android.content.Context
import android.location.Location
import android.os.Looper
import android.util.Log
import androidx.annotation.RequiresPermission
import org.maplibre.android.location.engine.LocationEngine
import org.maplibre.android.location.engine.LocationEngineCallback
import org.maplibre.android.location.engine.LocationEngineRequest
import org.maplibre.android.location.engine.LocationEngineResult
import org.maplibre.android.location.permissions.PermissionsManager
import org.maplibre.reactnative.location.engine.LocationEngineProvider
import java.lang.ref.WeakReference

class LocationManager private constructor(
    private val context: Context,
) : LocationEngineCallback<LocationEngineResult> {
    var engine: LocationEngine? = null
        private set
    private val listeners: MutableList<OnUserLocationChange> = ArrayList<OnUserLocationChange>()

    private var mMinDisplacement = 0f
    private var isActive = false
    private var lastLocation: Location? = null

    private var locationEngineRequest: LocationEngineRequest? = null

    interface OnUserLocationChange {
        fun onLocationChange(location: Location)
    }

    init {
        this.buildEngineRequest()
    }

    private fun buildEngineRequest() {
        this.engine = LocationEngineProvider().getLocationEngine(context)

        locationEngineRequest =
            LocationEngineRequest
                .Builder(DEFAULT_INTERVAL_MILLIS)
                .setFastestInterval(DEFAULT_FASTEST_INTERVAL_MILLIS)
                .setPriority(LocationEngineRequest.PRIORITY_HIGH_ACCURACY)
                .setDisplacement(mMinDisplacement)
                .build()
    }

    fun addLocationListener(listener: OnUserLocationChange?) {
        if (!listeners.contains(listener)) {
            listeners.add(listener!!)
        }
    }

    fun removeLocationListener(listener: OnUserLocationChange?) {
        if (listeners.contains(listener)) {
            listeners.remove(listener)
        }
    }

    fun setMinDisplacement(minDisplacement: Float) {
        mMinDisplacement = minDisplacement
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    fun enable() {
        if (!PermissionsManager.areLocationPermissionsGranted(context)) {
            return
        }

        // Remove existing listeners
        engine!!.removeLocationUpdates(this)

        // Refresh location engine request with new values
        this.buildEngineRequest()

        // Add new listeners
        engine!!.requestLocationUpdates(
            locationEngineRequest!!,
            this,
            Looper.getMainLooper(),
        )

        isActive = true
    }

    fun disable() {
        engine!!.removeLocationUpdates(this)
        isActive = false
    }

    fun dispose() {
        if (this.engine == null) {
            return
        }

        disable()
        engine!!.removeLocationUpdates(this)
    }

    fun isActive(): Boolean = this.engine != null && this.isActive

    val lastKnownLocation: Location?
        get() {
            if (this.engine == null) {
                return null
            }

            return lastLocation
        }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    fun getLastKnownLocation(callback: LocationEngineCallback<LocationEngineResult?>) {
        if (this.engine == null) {
            callback.onFailure(Exception("LocationEngine not initialized"))
        }

        try {
            engine!!.getLastLocation(callback)
        } catch (exception: Exception) {
            Log.w(LOG_TAG, exception)
            callback.onFailure(exception)
        }
    }

    fun onLocationChanged(location: Location) {
        lastLocation = location
        for (listener in listeners) {
            listener.onLocationChange(location)
        }
    }

    override fun onFailure(exception: Exception) {
        // TODO: handle this.
    }

    override fun onSuccess(result: LocationEngineResult?) {
        val location = result?.lastLocation ?: return

        onLocationChanged(location)
    }

    companion object {
        const val DEFAULT_FASTEST_INTERVAL_MILLIS: Long = 1000
        const val DEFAULT_INTERVAL_MILLIS: Long = 1000

        const val LOG_TAG: String = "LocationManager"

        private var instance: WeakReference<LocationManager?>? = null

        @JvmStatic
        fun getInstance(context: Context): LocationManager {
            val appContext = context.applicationContext
            instance?.get()?.let { return it }

            synchronized(LocationManager::class.java) {
                instance?.get()?.let { return it }

                val created = LocationManager(appContext)
                instance = WeakReference(created)

                return created
            }
        }
    }
}
