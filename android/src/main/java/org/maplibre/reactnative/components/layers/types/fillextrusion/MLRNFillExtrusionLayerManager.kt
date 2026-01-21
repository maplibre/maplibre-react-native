package org.maplibre.reactnative.components.layers.types.fillextrusion

import com.facebook.react.uimanager.ThemedReactContext
import org.maplibre.reactnative.components.layers.MLRNVectorLayerManager

class MLRNFillExtrusionLayerManager : MLRNVectorLayerManager<MLRNFillExtrusionLayer?>() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createLayerViewInstance(reactContext: ThemedReactContext?): MLRNFillExtrusionLayer {
        return MLRNFillExtrusionLayer(reactContext)
    }

    companion object {
        const val REACT_CLASS: String = "MLRNFillExtrusionLayer"
    }
}
