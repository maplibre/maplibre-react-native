package org.maplibre.reactnative.components.layers.types.symbol;

import com.facebook.react.uimanager.ThemedReactContext;

import org.maplibre.reactnative.components.layers.MLRNVectorLayerManager;

public class MLRNSymbolLayerManager extends MLRNVectorLayerManager<MLRNSymbolLayer> {
    public static final String REACT_CLASS = "MLRNSymbolLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNSymbolLayer createLayerViewInstance(ThemedReactContext reactContext) {
        return new MLRNSymbolLayer(reactContext);
    }
}
