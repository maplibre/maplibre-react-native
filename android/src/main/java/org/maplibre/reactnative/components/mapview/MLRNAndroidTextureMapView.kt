package org.maplibre.reactnative.components.mapview

import android.content.Context
import org.maplibre.android.maps.MapLibreMapOptions

class MLRNAndroidTextureMapView(
    context: Context, manager: MLRNAndroidTextureMapViewManager, options: MapLibreMapOptions?
) : MLRNMapView(context, manager, options) {
    companion object {
        const val LOG_TAG: String = "MLRNAndroidTextureMapView"
    }
}
