package org.maplibre.reactnative.components.layers.types.circle

import com.facebook.react.uimanager.ThemedReactContext
import org.maplibre.reactnative.components.layers.MLRNVectorLayerManager

class MLRNCircleLayerManager : MLRNVectorLayerManager<MLRNCircleLayer?>() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createLayerViewInstance(reactContext: ThemedReactContext?): MLRNCircleLayer {
        return MLRNCircleLayer(reactContext)
    }

    companion object {
        const val REACT_CLASS: String = "MLRNCircleLayer"
    }
}
