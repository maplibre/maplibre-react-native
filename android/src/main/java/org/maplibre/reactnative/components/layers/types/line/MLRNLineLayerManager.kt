package org.maplibre.reactnative.components.layers.types.line

import com.facebook.react.uimanager.ThemedReactContext
import org.maplibre.reactnative.components.layers.MLRNVectorLayerManager

class MLRNLineLayerManager : MLRNVectorLayerManager<MLRNLineLayer?>() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createLayerViewInstance(reactContext: ThemedReactContext?): MLRNLineLayer {
        return MLRNLineLayer(reactContext)
    }

    companion object {
        const val REACT_CLASS: String = "MLRNLineLayer"
    }
}
