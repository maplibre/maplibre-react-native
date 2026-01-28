package org.maplibre.reactnative.components

import android.content.Context
import com.facebook.react.views.view.ReactViewGroup
import org.maplibre.reactnative.components.mapview.MLRNMapView

abstract class AbstractMapFeature(
    context: Context?,
) : ReactViewGroup(context) {
    abstract fun addToMap(mapView: MLRNMapView)

    abstract fun removeFromMap(mapView: MLRNMapView)
}
