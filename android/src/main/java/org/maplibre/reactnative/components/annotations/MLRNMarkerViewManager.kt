package org.maplibre.reactnative.components.annotations

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import org.maplibre.reactnative.components.AbstractEventEmitter
import org.maplibre.reactnative.utils.GeoJSONUtils

class MLRNMarkerViewManager(reactApplicationContext: ReactApplicationContext) : AbstractEventEmitter<MLRNMarkerView>(reactApplicationContext) {
    companion object {
        const val REACT_CLASS: String = "MLRNMarkerView"
    }

    override fun getName(): String = REACT_CLASS

    @ReactProp(name="coordinate")
    fun setCoordinate(markerView: MLRNMarkerView, geoJSONStr: String) {
        val point = GeoJSONUtils.toPointGeometry(geoJSONStr)
        if (point != null) {
            markerView.setCoordinate(point)
        }
    }

    @ReactProp(name="anchor")
    fun setAnchor(markerView: MLRNMarkerView, map: ReadableMap) {
        markerView.setAnchor(map.getDouble("x").toFloat(), map.getDouble("y").toFloat())
    }

    protected override fun createViewInstance(reactContext: ThemedReactContext): MLRNMarkerView {
        return MLRNMarkerView(reactContext, this)
    }

    override fun customEvents(): Map<String, String> {
        return emptyMap()
    }
}
