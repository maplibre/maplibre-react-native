package org.maplibre.reactnative.components.sources.tilesources

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableType
import com.facebook.react.uimanager.annotations.ReactProp
import org.maplibre.reactnative.components.sources.MLRNSource
import org.maplibre.reactnative.components.sources.MLRNSourceManager

abstract class MLRNTileSourceManager<T>(
    context: ReactApplicationContext,
) : MLRNSourceManager<T>(context) where T : MLRNSource<*>, T : TileSourceInterface {
    @ReactProp(name = "url")
    fun setURL(
        source: T?,
        url: String?,
    ) {
        source!!.url = url
    }

    @ReactProp(name = "tiles")
    fun setTiles(
        source: T?,
        tiles: ReadableArray,
    ) {
        val urls: MutableList<String> = ArrayList()
        for (i in 0..<tiles.size()) {
            if (tiles.getType(i) == ReadableType.String) {
                tiles.getString(i)?.let { urls.add(it) }
            }
        }
        source!!.tiles = urls
    }

    @ReactProp(name = "attribution")
    fun setAttribution(
        source: T?,
        attribution: String?,
    ) {
        source!!.attribution = attribution
    }

    @ReactProp(name = "minzoom")
    fun setMinZoom(
        source: T?,
        minZoom: Int,
    ) {
        source!!.minZoom = minZoom
    }

    @ReactProp(name = "maxzoom")
    fun setMaxZoom(
        source: T?,
        maxZoom: Int,
    ) {
        source!!.maxZoom = maxZoom
    }

    @ReactProp(name = "scheme")
    fun setScheme(
        source: T?,
        scheme: String,
    ) {
        source!!.scheme = scheme
    }
}
