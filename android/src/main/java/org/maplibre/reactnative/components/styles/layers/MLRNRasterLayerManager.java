package org.maplibre.reactnative.components.styles.layers;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class MLRNRasterLayerManager extends ViewGroupManager<MLRNRasterLayer> {
    public static final String REACT_CLASS = "MLRNRasterLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNRasterLayer createViewInstance(ThemedReactContext reactContext) {
        return new MLRNRasterLayer(reactContext);
    }

    @ReactProp(name="id")
    public void setId(MLRNRasterLayer layer, String id) {
        layer.setID(id);
    }

    @ReactProp(name="sourceID")
    public void setSourceID(MLRNRasterLayer layer, String sourceID) {
        layer.setSourceID(sourceID);
    }

    @ReactProp(name="aboveLayerID")
    public void setAboveLayerID(MLRNRasterLayer layer, String aboveLayerID) {
        layer.setAboveLayerID(aboveLayerID);
    }

    @ReactProp(name="belowLayerID")
    public void setBelowLayerID(MLRNRasterLayer layer, String belowLayerID) {
        layer.setBelowLayerID(belowLayerID);
    }

    @ReactProp(name="layerIndex")
    public void setLayerIndex(MLRNRasterLayer layer, int layerIndex){
        layer.setLayerIndex(layerIndex);
    }

    @ReactProp(name="minZoomLevel")
    public void setMinZoomLevel(MLRNRasterLayer layer, double minZoomLevel) {
        layer.setMinZoomLevel(minZoomLevel);
    }

    @ReactProp(name="maxZoomLevel")
    public void setMaxZoomLevel(MLRNRasterLayer layer, double maxZoomLevel) {
        layer.setMaxZoomLevel(maxZoomLevel);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(MLRNRasterLayer layer, ReadableMap style) {
        layer.setReactStyle(style);
    }
}
