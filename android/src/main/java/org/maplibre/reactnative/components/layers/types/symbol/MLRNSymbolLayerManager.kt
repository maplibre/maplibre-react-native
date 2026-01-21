package org.maplibre.reactnative.components.layers.types.symbol

import com.facebook.react.uimanager.ThemedReactContext
import org.maplibre.reactnative.components.layers.MLRNVectorLayerManager

class MLRNSymbolLayerManager : MLRNVectorLayerManager<MLRNSymbolLayer?>() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createLayerViewInstance(reactContext: ThemedReactContext?): MLRNSymbolLayer {
        return MLRNSymbolLayer(reactContext)
    }

    companion object {
        const val REACT_CLASS: String = "MLRNSymbolLayer"
    }
}
