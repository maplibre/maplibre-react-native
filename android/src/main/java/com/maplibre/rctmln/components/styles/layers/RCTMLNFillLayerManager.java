package com.maplibre.rctmln.components.styles.layers;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.maplibre.rctmln.components.AbstractEventEmitter;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by nickitaliano on 9/8/17.
 */

public class RCTMLNFillLayerManager extends ViewGroupManager<RCTMLNFillLayer> {
    public static final String REACT_CLASS = "RCTMLNFillLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RCTMLNFillLayer createViewInstance(ThemedReactContext reactContext) {
        return new RCTMLNFillLayer(reactContext);
    }

    @ReactProp(name="id")
    public void setId(RCTMLNFillLayer layer, String id) {
        layer.setID(id);
    }

    @ReactProp(name="sourceID")
    public void setSourceID(RCTMLNFillLayer layer, String sourceID) {
        layer.setSourceID(sourceID);
    }

    @ReactProp(name="sourceLayerID")
    public void setSourceLayerId(RCTMLNFillLayer layer, String sourceLayerID) {
        layer.setSourceLayerID(sourceLayerID);
    }

    @ReactProp(name="aboveLayerID")
    public void setAboveLayerID(RCTMLNFillLayer layer, String aboveLayerID) {
        layer.setAboveLayerID(aboveLayerID);
    }

    @ReactProp(name="belowLayerID")
    public void setBelowLayerID(RCTMLNFillLayer layer, String belowLayerID) {
        layer.setBelowLayerID(belowLayerID);
    }

    @ReactProp(name="layerIndex")
    public void setLayerIndex(RCTMLNFillLayer layer, int layerIndex){
        layer.setLayerIndex(layerIndex);
    }

    @ReactProp(name="minZoomLevel")
    public void setMinZoomLevel(RCTMLNFillLayer layer, double minZoomLevel) {
        layer.setMinZoomLevel(minZoomLevel);
    }

    @ReactProp(name="maxZoomLevel")
    public void setMaxZoomLevel(RCTMLNFillLayer layer, double maxZoomLevel) {
        layer.setMaxZoomLevel(maxZoomLevel);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(RCTMLNFillLayer layer, ReadableMap style) {
        layer.setReactStyle(style);
    }

    @ReactProp(name="filter")
    public void setFilter(RCTMLNFillLayer layer, ReadableArray filterList) {
        layer.setFilter(filterList);
    }
}
