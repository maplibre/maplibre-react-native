package org.maplibre.reactnative.components.styles.layers;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class MLRNBackgroundLayerManager extends ViewGroupManager<MLRNBackgroundLayer> {
    public static final String REACT_CLASS = "MLRNBackgroundLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNBackgroundLayer createViewInstance(ThemedReactContext reactContext) {
        return new MLRNBackgroundLayer(reactContext);
    }

    @ReactProp(name="id")
    public void setId(MLRNBackgroundLayer layer, String id) {
        layer.setID(id);
    }

    @ReactProp(name="sourceID")
    public void setSourceID(MLRNBackgroundLayer layer, String sourceID) {
        layer.setSourceID(sourceID);
    }

    @ReactProp(name="aboveLayerID")
    public void setAboveLayerID(MLRNBackgroundLayer layer, String aboveLayerID) {
        layer.setAboveLayerID(aboveLayerID);
    }

    @ReactProp(name="belowLayerID")
    public void setBelowLayerID(MLRNBackgroundLayer layer, String belowLayerID) {
        layer.setBelowLayerID(belowLayerID);
    }

    @ReactProp(name="layerIndex")
    public void setLayerIndex(MLRNBackgroundLayer layer, int layerIndex){
        layer.setLayerIndex(layerIndex);
    }

    @ReactProp(name="minZoomLevel")
    public void setMinZoomLevel(MLRNBackgroundLayer layer, double minZoomLevel) {
        layer.setMinZoomLevel(minZoomLevel);
    }

    @ReactProp(name="maxZoomLevel")
    public void setMaxZoomLevel(MLRNBackgroundLayer layer, double maxZoomLevel) {
        layer.setMaxZoomLevel(maxZoomLevel);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(MLRNBackgroundLayer layer, ReadableMap style) {
        layer.setReactStyle(style);
    }
}
