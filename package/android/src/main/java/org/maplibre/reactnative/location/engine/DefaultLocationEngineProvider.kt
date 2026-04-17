package org.maplibre.reactnative.location.engine

import android.content.Context
import android.util.Log
import org.maplibre.android.location.engine.LocationEngine
import org.maplibre.android.location.engine.LocationEngineDefault.getDefaultLocationEngine

class DefaultLocationEngineProvider : LocationEngineProvidable {
    override fun getLocationEngine(context: Context): LocationEngine {
        val locationEngine = getDefaultLocationEngine(context.applicationContext)
        Log.d(LOG_TAG, "DefaultLocationEngine will be used.")
        return locationEngine
    }

    companion object {
        private const val LOG_TAG = "DefaultLocationEngineProvider"
    }
}
