package org.maplibre.reactnative.components.layers.types.fill

import com.facebook.react.uimanager.ThemedReactContext
import org.maplibre.reactnative.components.layers.MLRNVectorLayerManager

class MLRNFillLayerManager : MLRNVectorLayerManager<MLRNFillLayer?>() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createLayerViewInstance(reactContext: ThemedReactContext?): MLRNFillLayer {
        return MLRNFillLayer(reactContext)
    }

    companion object {
        const val REACT_CLASS: String = "MLRNFillLayer"
    }
}
