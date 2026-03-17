package org.maplibre.reactnative.location.engine

import android.annotation.SuppressLint
import android.app.PendingIntent
import android.content.Context
import android.location.Location
import android.os.Looper
import androidx.annotation.VisibleForTesting
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.OnFailureListener
import com.google.android.gms.tasks.OnSuccessListener
import org.maplibre.android.location.engine.LocationEngineCallback
import org.maplibre.android.location.engine.LocationEngineImpl
import org.maplibre.android.location.engine.LocationEngineRequest
import org.maplibre.android.location.engine.LocationEngineResult

/**
 * Wraps implementation of Fused Location Provider
 */
class GoogleLocationEngineImpl : LocationEngineImpl<LocationCallback?> {
    private val fusedLocationProviderClient: FusedLocationProviderClient

    @VisibleForTesting
    internal constructor(fusedLocationProviderClient: FusedLocationProviderClient) {
        this.fusedLocationProviderClient = fusedLocationProviderClient
    }

    constructor(context: Context) {
        this.fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(context)
    }

    override fun createListener(callback: LocationEngineCallback<LocationEngineResult?>): LocationCallback =
        GoogleLocationEngineCallbackTransport(callback)

    @SuppressLint("MissingPermission")
    @Throws(SecurityException::class)
    override fun getLastLocation(callback: LocationEngineCallback<LocationEngineResult?>) {
        val transport = GoogleLastLocationEngineCallbackTransport(callback)
        fusedLocationProviderClient.lastLocation
            .addOnSuccessListener(transport)
            .addOnFailureListener(transport)
    }

    @SuppressLint("MissingPermission")
    @Throws(SecurityException::class)
    override fun requestLocationUpdates(
        request: LocationEngineRequest,
        listener: LocationCallback,
        looper: Looper?,
    ) {
        fusedLocationProviderClient.requestLocationUpdates(
            toGMSLocationRequest(request),
            listener,
            looper,
        )
    }

    @SuppressLint("MissingPermission")
    @Throws(SecurityException::class)
    override fun requestLocationUpdates(
        request: LocationEngineRequest,
        pendingIntent: PendingIntent,
    ) {
        fusedLocationProviderClient.requestLocationUpdates(
            toGMSLocationRequest(request),
            pendingIntent,
        )
    }

    override fun removeLocationUpdates(listener: LocationCallback?) {
        if (listener != null) {
            fusedLocationProviderClient.removeLocationUpdates(listener)
        }
    }

    override fun removeLocationUpdates(pendingIntent: PendingIntent?) {
        if (pendingIntent != null) {
            fusedLocationProviderClient.removeLocationUpdates(pendingIntent)
        }
    }

    private class GoogleLocationEngineCallbackTransport(
        private val callback: LocationEngineCallback<LocationEngineResult?>,
    ) : LocationCallback() {
        override fun onLocationResult(locationResult: LocationResult) {
            super.onLocationResult(locationResult)
            val locations = locationResult.locations
            if (!locations.isEmpty()) {
                callback.onSuccess(LocationEngineResult.create(locations))
            } else {
                callback.onFailure(Exception("Unavailable location"))
            }
        }
    }

    @VisibleForTesting
    internal class GoogleLastLocationEngineCallbackTransport(
        private val callback: LocationEngineCallback<LocationEngineResult?>,
    ) : OnSuccessListener<Location?>,
        OnFailureListener {
        override fun onSuccess(location: Location?) {
            callback.onSuccess(
                if (location != null) {
                    LocationEngineResult.create(location)
                } else {
                    LocationEngineResult.create(
                        mutableListOf<Location?>(),
                    )
                },
            )
        }

        override fun onFailure(e: Exception) {
            callback.onFailure(e)
        }
    }

    companion object {
        private fun toGMSLocationRequest(request: LocationEngineRequest): LocationRequest {
            val builder = LocationRequest.Builder(request.interval)
            builder.setMinUpdateIntervalMillis(request.fastestInterval)
            builder.setMinUpdateDistanceMeters(request.displacement)
            builder.setMaxUpdateDelayMillis(request.maxWaitTime)
            builder.setPriority(toGMSLocationPriority(request.priority))
            return builder.build()
        }

        private fun toGMSLocationPriority(enginePriority: Int): Int =
            when (enginePriority) {
                LocationEngineRequest.PRIORITY_HIGH_ACCURACY -> Priority.PRIORITY_HIGH_ACCURACY
                LocationEngineRequest.PRIORITY_BALANCED_POWER_ACCURACY -> Priority.PRIORITY_BALANCED_POWER_ACCURACY
                LocationEngineRequest.PRIORITY_LOW_POWER -> Priority.PRIORITY_LOW_POWER
                LocationEngineRequest.PRIORITY_NO_POWER -> Priority.PRIORITY_PASSIVE
                else -> Priority.PRIORITY_PASSIVE
            }
    }
}
