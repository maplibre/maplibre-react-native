package org.maplibre.reactnative.components.layers.types.heatmap;

import com.facebook.react.uimanager.ThemedReactContext;

import org.maplibre.reactnative.components.layers.MLRNVectorLayerManager;

public class MLRNHeatmapLayerManager extends MLRNVectorLayerManager<MLRNHeatmapLayer> {
    public static final String REACT_CLASS = "MLRNHeatmapLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNHeatmapLayer createLayerViewInstance(ThemedReactContext reactContext) {
        return new MLRNHeatmapLayer(reactContext);
    }
}
