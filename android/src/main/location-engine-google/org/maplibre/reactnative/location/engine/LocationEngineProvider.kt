package org.maplibre.reactnative.location.engine

import android.content.Context
import org.maplibre.android.location.engine.LocationEngine

class LocationEngineProvider : LocationEngineProvidable {
    override fun getLocationEngine(context: Context): LocationEngine = GoogleLocationEngineProvider().getLocationEngine(context)
}
