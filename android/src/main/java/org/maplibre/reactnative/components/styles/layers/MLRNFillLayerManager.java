package org.maplibre.reactnative.components.styles.layers;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import org.maplibre.reactnative.components.AbstractEventEmitter;

import java.util.HashMap;
import java.util.Map;

public class MLRNFillLayerManager extends ViewGroupManager<MLRNFillLayer> {
    public static final String REACT_CLASS = "MLRNFillLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNFillLayer createViewInstance(ThemedReactContext reactContext) {
        return new MLRNFillLayer(reactContext);
    }

    @ReactProp(name="id")
    public void setId(MLRNFillLayer layer, String id) {
        layer.setID(id);
    }

    @ReactProp(name="sourceID")
    public void setSourceID(MLRNFillLayer layer, String sourceID) {
        layer.setSourceID(sourceID);
    }

    @ReactProp(name="sourceLayerID")
    public void setSourceLayerId(MLRNFillLayer layer, String sourceLayerID) {
        layer.setSourceLayerID(sourceLayerID);
    }

    @ReactProp(name="aboveLayerID")
    public void setAboveLayerID(MLRNFillLayer layer, String aboveLayerID) {
        layer.setAboveLayerID(aboveLayerID);
    }

    @ReactProp(name="belowLayerID")
    public void setBelowLayerID(MLRNFillLayer layer, String belowLayerID) {
        layer.setBelowLayerID(belowLayerID);
    }

    @ReactProp(name="layerIndex")
    public void setLayerIndex(MLRNFillLayer layer, int layerIndex){
        layer.setLayerIndex(layerIndex);
    }

    @ReactProp(name="minZoomLevel")
    public void setMinZoomLevel(MLRNFillLayer layer, double minZoomLevel) {
        layer.setMinZoomLevel(minZoomLevel);
    }

    @ReactProp(name="maxZoomLevel")
    public void setMaxZoomLevel(MLRNFillLayer layer, double maxZoomLevel) {
        layer.setMaxZoomLevel(maxZoomLevel);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(MLRNFillLayer layer, ReadableMap style) {
        layer.setReactStyle(style);
    }

    @ReactProp(name="filter")
    public void setFilter(MLRNFillLayer layer, ReadableArray filterList) {
        layer.setFilter(filterList);
    }
}
