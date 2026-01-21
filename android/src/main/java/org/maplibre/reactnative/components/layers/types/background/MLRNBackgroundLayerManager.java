package org.maplibre.reactnative.components.layers.types.background;

import com.facebook.react.uimanager.ThemedReactContext;

import org.maplibre.reactnative.components.layers.MLRNLayerManager;

public class MLRNBackgroundLayerManager extends MLRNLayerManager<MLRNBackgroundLayer> {
    public static final String REACT_CLASS = "MLRNBackgroundLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNBackgroundLayer createLayerViewInstance(ThemedReactContext reactContext) {
        return new MLRNBackgroundLayer(reactContext);
    }
}
