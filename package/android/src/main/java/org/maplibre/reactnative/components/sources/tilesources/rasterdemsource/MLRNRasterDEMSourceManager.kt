package org.maplibre.reactnative.components.sources.tilesources.rasterdemsource

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import org.maplibre.reactnative.components.sources.tilesources.MLRNTileSourceManager

class MLRNRasterDEMSourceManager(
    context: ReactApplicationContext,
) : MLRNTileSourceManager<MLRNRasterDEMSource>(context) {
    companion object {
        const val REACT_CLASS: String = "MLRNRasterDEMSource"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(themedReactContext: ThemedReactContext): MLRNRasterDEMSource =
        MLRNRasterDEMSource(themedReactContext)

    @ReactProp(name = "tileSize")
    fun setTileSize(
        source: MLRNRasterDEMSource,
        tileSize: Int,
    ) {
        source.tileSize = tileSize
    }
}

