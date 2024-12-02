package org.maplibre.reactnative.components.styles.layers;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;

public class MLRNCircleLayerManager extends ViewGroupManager<MLRNCircleLayer> {
    public static final String REACT_CLASS = "MLRNCircleLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNCircleLayer createViewInstance(ThemedReactContext reactContext) {
        return new MLRNCircleLayer(reactContext);
    }

    @ReactProp(name="id")
    public void setId(MLRNCircleLayer layer, String id) {
        layer.setID(id);
    }

    @ReactProp(name="sourceID")
    public void setSourceID(MLRNCircleLayer layer, String sourceID) {
        layer.setSourceID(sourceID);
    }

    @ReactProp(name="aboveLayerID")
    public void setAboveLayerID(MLRNCircleLayer layer, String aboveLayerID) {
        layer.setAboveLayerID(aboveLayerID);
    }

    @ReactProp(name="belowLayerID")
    public void setBelowLayerID(MLRNCircleLayer layer, String belowLayerID) {
        layer.setBelowLayerID(belowLayerID);
    }

    @ReactProp(name="layerIndex")
    public void setLayerIndex(MLRNCircleLayer layer, int layerIndex){
        layer.setLayerIndex(layerIndex);
    }

    @ReactProp(name="minZoomLevel")
    public void setMinZoomLevel(MLRNCircleLayer layer, double minZoomLevel) {
        layer.setMinZoomLevel(minZoomLevel);
    }

    @ReactProp(name="maxZoomLevel")
    public void setMaxZoomLevel(MLRNCircleLayer layer, double maxZoomLevel) {
        layer.setMaxZoomLevel(maxZoomLevel);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(MLRNCircleLayer layer, ReadableMap style) {
        layer.setReactStyle(style);
    }

    @ReactProp(name="sourceLayerID")
    public void setSourceLayerId(MLRNCircleLayer layer, String sourceLayerID) {
        layer.setSourceLayerID(sourceLayerID);
    }

    @ReactProp(name="filter")
    public void setFilter(MLRNCircleLayer layer, ReadableArray filterList) {
        layer.setFilter(filterList);
    }
}
