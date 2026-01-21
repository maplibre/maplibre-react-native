package org.maplibre.reactnative.components.layers;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.maplibre.reactnative.components.layers.types.circle.MLRNCircleLayer;
import org.maplibre.reactnative.components.layers.types.fillextrusion.MLRNFillExtrusionLayer;
import org.maplibre.reactnative.components.layers.types.fill.MLRNFillLayer;
import org.maplibre.reactnative.components.layers.types.heatmap.MLRNHeatmapLayer;
import org.maplibre.reactnative.components.layers.types.line.MLRNLineLayer;
import org.maplibre.reactnative.components.layers.types.symbol.MLRNSymbolLayer;

/**
 * Base view manager for vector based layers
 */
public abstract class MLRNVectorLayerManager<T extends MLRNLayer<?>> extends MLRNLayerManager<T> {

    @ReactProp(name="source")
    public void setSourceID(T layer, String sourceID) {
        layer.setSourceID(sourceID);
    }

    @ReactProp(name="source-layer")
    public void setSourceLayerId(T layer, String sourceLayerID) {
        if (layer instanceof MLRNCircleLayer) {
            ((MLRNCircleLayer) layer).setSourceLayerID(sourceLayerID);
        } else if (layer instanceof MLRNFillLayer) {
            ((MLRNFillLayer) layer).setSourceLayerID(sourceLayerID);
        } else if (layer instanceof MLRNFillExtrusionLayer) {
            ((MLRNFillExtrusionLayer) layer).setSourceLayerID(sourceLayerID);
        } else if (layer instanceof MLRNLineLayer) {
            ((MLRNLineLayer) layer).setSourceLayerID(sourceLayerID);
        } else if (layer instanceof MLRNHeatmapLayer) {
            ((MLRNHeatmapLayer) layer).setSourceLayerID(sourceLayerID);
        } else if (layer instanceof MLRNSymbolLayer) {
            ((MLRNSymbolLayer) layer).setSourceLayerID(sourceLayerID);
        }
    }

    @ReactProp(name="filter")
    public void setFilter(T layer, ReadableArray filterList) {
        if (layer instanceof MLRNCircleLayer) {
            ((MLRNCircleLayer) layer).setFilter(filterList);
        } else if (layer instanceof MLRNFillLayer) {
            ((MLRNFillLayer) layer).setFilter(filterList);
        } else if (layer instanceof MLRNFillExtrusionLayer) {
            ((MLRNFillExtrusionLayer) layer).setFilter(filterList);
        } else if (layer instanceof MLRNLineLayer) {
            ((MLRNLineLayer) layer).setFilter(filterList);
        } else if (layer instanceof MLRNHeatmapLayer) {
            ((MLRNHeatmapLayer) layer).setFilter(filterList);
        } else if (layer instanceof MLRNSymbolLayer) {
            ((MLRNSymbolLayer) layer).setFilter(filterList);
        }
    }
}
