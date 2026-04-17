package org.maplibre.reactnative.components.sources.tilesources.rasterdemsource

import android.content.Context
import org.maplibre.android.style.sources.RasterDemSource
import org.maplibre.reactnative.components.sources.tilesources.MLRNTileSource

class MLRNRasterDEMSource(
    context: Context?,
) : MLRNTileSource<RasterDemSource?>(context) {
    var tileSize: Int? = null

    override fun makeSource(): RasterDemSource {
        val configurationUrl = url
        val tileSize = (if (tileSize != null) tileSize else RasterDemSource.DEFAULT_TILE_SIZE)!!
        if (configurationUrl != null) {
            return RasterDemSource(mID, configurationUrl, tileSize)
        }
        return RasterDemSource(mID, buildTileset(), tileSize)
    }
}

