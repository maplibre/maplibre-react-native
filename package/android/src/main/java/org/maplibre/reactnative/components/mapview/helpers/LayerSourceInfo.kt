package org.maplibre.reactnative.components.mapview.helpers

import org.maplibre.android.style.layers.CircleLayer
import org.maplibre.android.style.layers.FillExtrusionLayer
import org.maplibre.android.style.layers.FillLayer
import org.maplibre.android.style.layers.HeatmapLayer
import org.maplibre.android.style.layers.HillshadeLayer
import org.maplibre.android.style.layers.Layer
import org.maplibre.android.style.layers.LineLayer
import org.maplibre.android.style.layers.RasterLayer
import org.maplibre.android.style.layers.SymbolLayer

internal class LayerSourceInfo(
    layer: Layer?,
) {
    val sourceId: String

    val sourceLayerId: String?

    init {
        when (layer) {
            is CircleLayer -> {
                val symbolLayer = layer
                sourceId = symbolLayer.getSourceId()
                sourceLayerId = symbolLayer.getSourceLayer()
            }

            is FillExtrusionLayer -> {
                val fillExtrusionLayer = layer
                sourceId = fillExtrusionLayer.getSourceId()
                sourceLayerId = fillExtrusionLayer.getSourceLayer()
            }

            is FillLayer -> {
                val fillLayer = layer
                sourceId = fillLayer.getSourceId()
                sourceLayerId = fillLayer.getSourceLayer()
            }

            is HeatmapLayer -> {
                val heatmapLayer = layer
                sourceId = heatmapLayer.getSourceId()
                sourceLayerId = heatmapLayer.getSourceLayer()
            }

            is HillshadeLayer -> {
                val hillshadeLayer = layer
                sourceId = hillshadeLayer.getSourceId()
                sourceLayerId = null
            }

            is LineLayer -> {
                val lineLayer = layer
                sourceId = lineLayer.getSourceId()
                sourceLayerId = lineLayer.getSourceLayer()
            }

            is RasterLayer -> {
                val rasterLayer = layer
                sourceId = rasterLayer.getSourceId()
                sourceLayerId = null
            }

            is SymbolLayer -> {
                val symbolLayer = layer
                sourceId = symbolLayer.getSourceId()
                sourceLayerId = symbolLayer.getSourceLayer()
            }

            else -> {
                sourceId = ""
                sourceLayerId = null
            }
        }
    }
}
