package org.maplibre.reactnative.components.layers

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

class MLRNLayerManager : ViewGroupManager<MLRNLayer>() {
    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): MLRNLayer = MLRNLayer(reactContext)

    @ReactProp(name = "id")
    fun setId(
        layer: MLRNLayer?,
        id: String?,
    ) {
        layer!!.ID = id!!
    }

    @ReactProp(name = "layerType")
    fun setLayerType(
        layer: MLRNLayer?,
        layerType: String?,
    ) {
        layer!!.setLayerType(layerType)
    }

    @ReactProp(name = "source")
    fun setSource(
        layer: MLRNLayer?,
        sourceID: String?,
    ) {
        layer!!.setSourceID(sourceID)
    }

    @ReactProp(name = "sourceLayer")
    fun setSourceLayer(
        layer: MLRNLayer?,
        sourceLayerID: String?,
    ) {
        layer!!.setSourceLayerID(sourceLayerID)
    }

    @ReactProp(name = "afterId")
    fun setAfterId(
        layer: MLRNLayer?,
        aboveLayerID: String?,
    ) {
        layer!!.setAboveLayerID(aboveLayerID)
    }

    @ReactProp(name = "beforeId")
    fun setBeforeId(
        layer: MLRNLayer?,
        belowLayerID: String?,
    ) {
        layer!!.setBelowLayerID(belowLayerID)
    }

    @ReactProp(name = "layerIndex")
    fun setLayerIndex(
        layer: MLRNLayer?,
        layerIndex: Int,
    ) {
        layer!!.setLayerIndex(layerIndex)
    }

    @ReactProp(name = "minzoom")
    fun setMinzoom(
        layer: MLRNLayer?,
        minZoomLevel: Double,
    ) {
        layer!!.setMinZoomLevel(minZoomLevel)
    }

    @ReactProp(name = "maxzoom")
    fun setMaxzoom(
        layer: MLRNLayer?,
        maxZoomLevel: Double,
    ) {
        layer!!.setMaxZoomLevel(maxZoomLevel)
    }

    @ReactProp(name = "reactStyle")
    fun setReactStyle(
        layer: MLRNLayer?,
        style: ReadableMap?,
    ) {
        layer!!.setReactStyle(style)
    }

    @ReactProp(name = "filter")
    fun setFilter(
        layer: MLRNLayer?,
        filterList: ReadableArray?,
    ) {
        layer!!.setFilter(filterList)
    }

    companion object {
        const val REACT_CLASS: String = "MLRNLayer"
    }
}
