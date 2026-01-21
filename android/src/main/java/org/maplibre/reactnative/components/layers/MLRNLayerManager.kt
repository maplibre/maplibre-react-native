package org.maplibre.reactnative.components.layers

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

abstract class MLRNLayerManager<T : MLRNLayer<*>?> : ViewGroupManager<T?>() {
    protected abstract fun createLayerViewInstance(reactContext: ThemedReactContext?): T?

    override fun createViewInstance(reactContext: ThemedReactContext?): T? {
        return createLayerViewInstance(reactContext)
    }

    @ReactProp(name = "id")
    fun setId(layer: T?, id: String?) {
        layer!!.setID(id)
    }

    @ReactProp(name = "afterId")
    fun setAboveLayerID(layer: T?, aboveLayerID: String?) {
        layer!!.setAboveLayerID(aboveLayerID)
    }

    @ReactProp(name = "beforeId")
    fun setBelowLayerID(layer: T?, belowLayerID: String?) {
        layer!!.setBelowLayerID(belowLayerID)
    }

    @ReactProp(name = "layerIndex")
    fun setLayerIndex(layer: T?, layerIndex: Int) {
        layer!!.setLayerIndex(layerIndex)
    }

    @ReactProp(name = "minzoom")
    fun setMinZoomLevel(layer: T?, minZoomLevel: Double) {
        layer!!.setMinZoomLevel(minZoomLevel)
    }

    @ReactProp(name = "maxzoom")
    fun setMaxZoomLevel(layer: T?, maxZoomLevel: Double) {
        layer!!.setMaxZoomLevel(maxZoomLevel)
    }

    @ReactProp(name = "reactStyle")
    fun setReactStyle(layer: T?, style: ReadableMap?) {
        layer!!.setReactStyle(style)
    }
}
