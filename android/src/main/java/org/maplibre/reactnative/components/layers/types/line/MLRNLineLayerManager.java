package org.maplibre.reactnative.components.layers.types.line;

import com.facebook.react.uimanager.ThemedReactContext;

import org.maplibre.reactnative.components.layers.MLRNVectorLayerManager;

public class MLRNLineLayerManager extends MLRNVectorLayerManager<MLRNLineLayer> {
    public static final String REACT_CLASS = "MLRNLineLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNLineLayer createLayerViewInstance(ThemedReactContext reactContext) {
        return new MLRNLineLayer(reactContext);
    }
}
