package org.maplibre.reactnative.components.layers

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.annotations.ReactProp
import org.maplibre.reactnative.components.layers.types.circle.MLRNCircleLayer
import org.maplibre.reactnative.components.layers.types.fill.MLRNFillLayer
import org.maplibre.reactnative.components.layers.types.fillextrusion.MLRNFillExtrusionLayer
import org.maplibre.reactnative.components.layers.types.heatmap.MLRNHeatmapLayer
import org.maplibre.reactnative.components.layers.types.line.MLRNLineLayer
import org.maplibre.reactnative.components.layers.types.symbol.MLRNSymbolLayer

/**
 * Base view manager for vector based layers
 */
abstract class MLRNVectorLayerManager<T : MLRNLayer<*>?> : MLRNLayerManager<T?>() {
    @ReactProp(name = "source")
    fun setSourceID(layer: T?, sourceID: String?) {
        layer!!.setSourceID(sourceID)
    }

    @ReactProp(name = "source-layer")
    fun setSourceLayerId(layer: T?, sourceLayerID: String?) {
        if (layer is MLRNCircleLayer) {
            (layer as MLRNCircleLayer).setSourceLayerID(sourceLayerID)
        } else if (layer is MLRNFillLayer) {
            (layer as MLRNFillLayer).setSourceLayerID(sourceLayerID)
        } else if (layer is MLRNFillExtrusionLayer) {
            (layer as MLRNFillExtrusionLayer).setSourceLayerID(sourceLayerID)
        } else if (layer is MLRNLineLayer) {
            (layer as MLRNLineLayer).setSourceLayerID(sourceLayerID)
        } else if (layer is MLRNHeatmapLayer) {
            (layer as MLRNHeatmapLayer).setSourceLayerID(sourceLayerID)
        } else if (layer is MLRNSymbolLayer) {
            (layer as MLRNSymbolLayer).setSourceLayerID(sourceLayerID)
        }
    }

    @ReactProp(name = "filter")
    override fun setFilter(layer: T?, filterList: ReadableArray?) {
        if (layer is MLRNCircleLayer) {
            (layer as MLRNCircleLayer).setFilter(filterList)
        } else if (layer is MLRNFillLayer) {
            (layer as MLRNFillLayer).setFilter(filterList)
        } else if (layer is MLRNFillExtrusionLayer) {
            (layer as MLRNFillExtrusionLayer).setFilter(filterList)
        } else if (layer is MLRNLineLayer) {
            (layer as MLRNLineLayer).setFilter(filterList)
        } else if (layer is MLRNHeatmapLayer) {
            (layer as MLRNHeatmapLayer).setFilter(filterList)
        } else if (layer is MLRNSymbolLayer) {
            (layer as MLRNSymbolLayer).setFilter(filterList)
        }
    }
}
