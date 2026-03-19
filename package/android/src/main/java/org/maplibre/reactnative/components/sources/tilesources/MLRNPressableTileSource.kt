package org.maplibre.reactnative.components.sources.tilesources

import android.content.Context
import org.maplibre.android.style.sources.Source
import org.maplibre.reactnative.components.sources.MLRNPressableSource

abstract class MLRNPressableTileSource<T : Source?>(
    context: Context?,
) : MLRNPressableSource<T?>(context),
    TileSourceInterface {
    override var url: String? = null
    override var tiles: MutableCollection<String>? = null

    override var attribution: String? = null

    override var minZoom: Int? = null
    override var maxZoom: Int? = null

    override var scheme: String? = null
}
