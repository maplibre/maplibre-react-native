package org.maplibre.reactnative.location.engine

import android.content.Context
import org.maplibre.android.location.engine.LocationEngine

interface LocationEngineProvidable {
    fun getLocationEngine(context: Context): LocationEngine
}
