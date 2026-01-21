package org.maplibre.reactnative.components.layers.types.heatmap

import com.facebook.react.uimanager.ThemedReactContext
import org.maplibre.reactnative.components.layers.MLRNVectorLayerManager

class MLRNHeatmapLayerManager : MLRNVectorLayerManager<MLRNHeatmapLayer?>() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createLayerViewInstance(reactContext: ThemedReactContext?): MLRNHeatmapLayer {
        return MLRNHeatmapLayer(reactContext)
    }

    companion object {
        const val REACT_CLASS: String = "MLRNHeatmapLayer"
    }
}
