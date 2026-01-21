package org.maplibre.reactnative.components.layers.types.fill;

import com.facebook.react.uimanager.ThemedReactContext;

import org.maplibre.reactnative.components.layers.MLRNVectorLayerManager;

public class MLRNFillLayerManager extends MLRNVectorLayerManager<MLRNFillLayer> {
    public static final String REACT_CLASS = "MLRNFillLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNFillLayer createLayerViewInstance(ThemedReactContext reactContext) {
        return new MLRNFillLayer(reactContext);
    }
}
