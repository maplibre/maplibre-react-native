package org.maplibre.reactnative.components.mapview;

import org.maplibre.android.style.layers.CircleLayer;
import org.maplibre.android.style.layers.FillExtrusionLayer;
import org.maplibre.android.style.layers.FillLayer;
import org.maplibre.android.style.layers.HeatmapLayer;
import org.maplibre.android.style.layers.HillshadeLayer;
import org.maplibre.android.style.layers.Layer;
import org.maplibre.android.style.layers.LineLayer;
import org.maplibre.android.style.layers.RasterLayer;
import org.maplibre.android.style.layers.SymbolLayer;

import javax.annotation.Nullable;

class LayerSourceInfo {
    final String sourceId;

    @Nullable
    final String sourceLayerId;

    LayerSourceInfo(Layer layer) {
        if (layer instanceof CircleLayer) {
            CircleLayer symbolLayer = (CircleLayer) layer;
            sourceId = symbolLayer.getSourceId();
            sourceLayerId = symbolLayer.getSourceLayer();
        } else if (layer instanceof FillExtrusionLayer) {
            FillExtrusionLayer fillExtrusionLayer = (FillExtrusionLayer)layer;
            sourceId = fillExtrusionLayer.getSourceId();
            sourceLayerId = fillExtrusionLayer.getSourceLayer();
        } else if (layer instanceof FillLayer) {
            FillLayer fillLayer = (FillLayer)layer;
            sourceId = fillLayer.getSourceId();
            sourceLayerId = fillLayer.getSourceLayer();
        } else if (layer instanceof HeatmapLayer) {
            HeatmapLayer heatmapLayer = (HeatmapLayer)layer;
            sourceId = heatmapLayer.getSourceId();
            sourceLayerId = heatmapLayer.getSourceLayer();
        } else if (layer instanceof HillshadeLayer) {
            HillshadeLayer hillshadeLayer = (HillshadeLayer)layer;
            sourceId = hillshadeLayer.getSourceId();
            sourceLayerId = null;
        } else if (layer instanceof LineLayer) {
            LineLayer lineLayer = (LineLayer)layer;
            sourceId = lineLayer.getSourceId();
            sourceLayerId = lineLayer.getSourceLayer();
        } else if (layer instanceof RasterLayer) {
            RasterLayer rasterLayer = (RasterLayer) layer;
            sourceId = rasterLayer.getSourceId();
            sourceLayerId = null;
        } else if (layer instanceof SymbolLayer) {
            SymbolLayer symbolLayer = (SymbolLayer)layer;
            sourceId = symbolLayer.getSourceId();
            sourceLayerId = symbolLayer.getSourceLayer();
        } else {
            sourceId = "";
            sourceLayerId = null;
        }
    }
}
