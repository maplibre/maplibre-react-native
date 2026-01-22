package org.maplibre.reactnative.components.sources.tilesources.rastersource

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import org.maplibre.reactnative.components.sources.tilesources.MLRNTileSourceManager

class MLRNRasterSourceManager(context: ReactApplicationContext) :
    MLRNTileSourceManager<MLRNRasterSource>(context) {

    companion object {
        const val REACT_CLASS: String = "MLRNRasterSource"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(themedReactContext: ThemedReactContext): MLRNRasterSource {
        return MLRNRasterSource(themedReactContext)
    }

    @ReactProp(name = "tileSize")
    fun setTileSize(source: MLRNRasterSource, tileSize: Int) {
        source.tileSize = tileSize
    }
}
