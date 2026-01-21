package org.maplibre.reactnative.components.layers.types.fillextrusion;

import com.facebook.react.uimanager.ThemedReactContext;

import org.maplibre.reactnative.components.layers.MLRNVectorLayerManager;

public class MLRNFillExtrusionLayerManager extends MLRNVectorLayerManager<MLRNFillExtrusionLayer> {
    public static final String REACT_CLASS = "MLRNFillExtrusionLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNFillExtrusionLayer createLayerViewInstance(ThemedReactContext reactContext) {
        return new MLRNFillExtrusionLayer(reactContext);
    }
}
