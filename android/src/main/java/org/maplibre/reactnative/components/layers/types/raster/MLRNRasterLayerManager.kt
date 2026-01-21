package org.maplibre.reactnative.components.layers.types.raster

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import org.maplibre.reactnative.components.layers.MLRNLayerManager

class MLRNRasterLayerManager : MLRNLayerManager<MLRNRasterLayer?>() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createLayerViewInstance(reactContext: ThemedReactContext?): MLRNRasterLayer {
        return MLRNRasterLayer(reactContext)
    }

    // Source prop (required for raster layers)
    @ReactProp(name = "source")
    fun setSourceID(layer: MLRNRasterLayer, sourceID: String?) {
        layer.setSourceID(sourceID)
    }

    companion object {
        const val REACT_CLASS: String = "MLRNRasterLayer"
    }
}
