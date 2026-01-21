package org.maplibre.reactnative.components.layers.types.raster;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.maplibre.reactnative.components.layers.MLRNLayerManager;

public class MLRNRasterLayerManager extends MLRNLayerManager<MLRNRasterLayer> {
    public static final String REACT_CLASS = "MLRNRasterLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNRasterLayer createLayerViewInstance(ThemedReactContext reactContext) {
        return new MLRNRasterLayer(reactContext);
    }

    // Source prop (required for raster layers)
    @ReactProp(name="source")
    public void setSourceID(MLRNRasterLayer layer, String sourceID) {
        layer.setSourceID(sourceID);
    }
}
