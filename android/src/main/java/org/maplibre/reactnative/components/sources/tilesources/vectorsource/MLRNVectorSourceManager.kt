package org.maplibre.reactnative.components.sources.tilesources.vectorsource

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import org.maplibre.reactnative.components.sources.tilesources.MLRNTileSourceManager

class MLRNVectorSourceManager(context: ReactApplicationContext) :
    MLRNTileSourceManager<MLRNVectorSource>(context) {

    companion object {
        const val REACT_CLASS: String = "MLRNVectorSource"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(themedReactContext: ThemedReactContext): MLRNVectorSource {
        return MLRNVectorSource(themedReactContext)
    }
}

