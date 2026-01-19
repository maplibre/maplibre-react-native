package org.maplibre.reactnative.components.sources.imagesource

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import org.maplibre.android.geometry.LatLngQuad
import org.maplibre.reactnative.components.sources.MLRNSourceManager
import org.maplibre.reactnative.utils.GeoJSONUtils

class MLRNImageSourceManager(context: ReactApplicationContext) :
    MLRNSourceManager<MLRNImageSource>(context) {

    companion object {
        const val REACT_CLASS: String = "MLRNImageSource"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(themedReactContext: ThemedReactContext): MLRNImageSource {
        return MLRNImageSource(themedReactContext)
    }

    @ReactProp(name = "url")
    fun setUrl(source: MLRNImageSource, url: String?) {
        source.setURL(url)
    }

    @ReactProp(name = "coordinates")
    fun setCoordinates(source: MLRNImageSource, arr: ReadableArray?) {
        val quad: LatLngQuad? = arr?.let { GeoJSONUtils.toLatLngQuad(it) }
        source.setCoordinates(quad)
    }
}
