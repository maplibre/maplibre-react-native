package org.maplibre.reactnative.components.annotations

import android.view.View
import org.maplibre.android.geometry.LatLng

/**
 * Subclass of MarkerView so we MarkerViewManager can implement remove/restoreViews
 */
class MarkerView(latLng: LatLng, private val view: View) : org.maplibre.android.plugins.markerview.MarkerView(latLng, view) {
    fun getView(): View {
        return view
    }
}
