package org.maplibre.reactnative.location.engine

import android.content.Context
import android.util.Log
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.gms.location.LocationCallback
import org.maplibre.android.location.engine.LocationEngine
import org.maplibre.android.location.engine.LocationEngineProxy

class GoogleLocationEngineProvider : LocationEngineProvidable {
    override fun getLocationEngine(context: Context): LocationEngine {
        if (GoogleApiAvailability
                .getInstance()
                .isGooglePlayServicesAvailable(context) == ConnectionResult.SUCCESS
        ) {
            val locationEngine: LocationEngine =
                LocationEngineProxy<LocationCallback?>(GoogleLocationEngineImpl(context.applicationContext))
            Log.d(LOG_TAG, "GoogleLocationEngine will be used.")
            return locationEngine
        } else {
            return DefaultLocationEngineProvider().getLocationEngine(context)
        }
    }

    companion object {
        private const val LOG_TAG = "GoogleLocationEngineProvider"
    }
}
