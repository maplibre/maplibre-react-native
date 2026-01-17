package org.maplibre.reactnative.components.sources.tilesources.rastersource

import android.content.Context
import org.maplibre.android.style.sources.RasterSource
import org.maplibre.reactnative.components.sources.tilesources.MLRNTileSource

class MLRNRasterSource(context: Context?) : MLRNTileSource<RasterSource?>(context) {
    var tileSize: Int? = null

    override fun makeSource(): RasterSource {
        val configurationUrl = url
        val tileSize = (if (tileSize != null) tileSize else RasterSource.DEFAULT_TILE_SIZE)!!
        if (configurationUrl != null) {
            return RasterSource(mID, configurationUrl, tileSize)
        }
        return RasterSource(mID, buildTileset(), tileSize)
    }
}
