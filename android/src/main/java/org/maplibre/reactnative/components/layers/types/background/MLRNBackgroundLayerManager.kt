package org.maplibre.reactnative.components.layers.types.background

import com.facebook.react.uimanager.ThemedReactContext
import org.maplibre.reactnative.components.layers.MLRNLayerManager

class MLRNBackgroundLayerManager : MLRNLayerManager<MLRNBackgroundLayer?>() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createLayerViewInstance(reactContext: ThemedReactContext?): MLRNBackgroundLayer {
        return MLRNBackgroundLayer(reactContext)
    }

    companion object {
        const val REACT_CLASS: String = "MLRNBackgroundLayer"
    }
}
