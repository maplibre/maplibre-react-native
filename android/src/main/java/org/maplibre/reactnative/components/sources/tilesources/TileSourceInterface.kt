package org.maplibre.reactnative.components.sources.tilesources

import org.maplibre.android.style.sources.TileSet

interface TileSourceInterface {
    var url: String?
    var tiles: MutableCollection<String>?
    var attribution: String?
    var minZoom: Int?
    var maxZoom: Int?
    var scheme: String?

    fun buildTileset(): TileSet {
        val tileUrlTemplates = tiles!!.toTypedArray<String>()
        val tileSet = TileSet(TILE_SPEC_VERSION, *tileUrlTemplates)

        if (this.minZoom != null) {
            tileSet.minZoom = minZoom!!.toFloat()
        }

        if (this.maxZoom != null) {
            tileSet.maxZoom = maxZoom!!.toFloat()
        }

        if (this.scheme != null) {
            tileSet.scheme = this.scheme
        }

        if (this.attribution != null) {
            tileSet.attribution = this.attribution
        }

        return tileSet
    }

    companion object {
        const val TILE_SPEC_VERSION: String = "2.1.0"
    }
}

