package org.maplibre.reactnative.components.layers.types.circle;

import com.facebook.react.uimanager.ThemedReactContext;

import org.maplibre.reactnative.components.layers.MLRNVectorLayerManager;

public class MLRNCircleLayerManager extends MLRNVectorLayerManager<MLRNCircleLayer> {
    public static final String REACT_CLASS = "MLRNCircleLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNCircleLayer createLayerViewInstance(ThemedReactContext reactContext) {
        return new MLRNCircleLayer(reactContext);
    }
}
