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
 * Created by nickitaliano on 9/15/17.
 */

public class RCTMLNFillExtrusionLayerManager extends ViewGroupManager<RCTMLNFillExtrusionLayer> {
    public static final String REACT_CLASS = "RCTMLNFillExtrusionLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RCTMLNFillExtrusionLayer createViewInstance(ThemedReactContext reactContext) {
        return new RCTMLNFillExtrusionLayer(reactContext);
    }

    @ReactProp(name="id")
    public void setId(RCTMLNFillExtrusionLayer layer, String id) {
        layer.setID(id);
    }

    @ReactProp(name="sourceID")
    public void setSourceID(RCTMLNFillExtrusionLayer layer, String sourceID) {
        layer.setSourceID(sourceID);
    }

    @ReactProp(name="aboveLayerID")
    public void setAboveLayerID(RCTMLNFillExtrusionLayer layer, String aboveLayerID) {
        layer.setAboveLayerID(aboveLayerID);
    }

    @ReactProp(name="belowLayerID")
    public void setBelowLayerID(RCTMLNFillExtrusionLayer layer, String belowLayerID) {
        layer.setBelowLayerID(belowLayerID);
    }

    @ReactProp(name="layerIndex")
    public void setLayerIndex(RCTMLNFillExtrusionLayer layer, int layerIndex){
        layer.setLayerIndex(layerIndex);
    }

    @ReactProp(name="minZoomLevel")
    public void setMinZoomLevel(RCTMLNFillExtrusionLayer layer, double minZoomLevel) {
        layer.setMinZoomLevel(minZoomLevel);
    }

    @ReactProp(name="maxZoomLevel")
    public void setMaxZoomLevel(RCTMLNFillExtrusionLayer layer, double maxZoomLevel) {
        layer.setMaxZoomLevel(maxZoomLevel);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(RCTMLNFillExtrusionLayer layer, ReadableMap style) {
        layer.setReactStyle(style);
    }

    @ReactProp(name="sourceLayerID")
    public void setSourceLayerId(RCTMLNFillExtrusionLayer layer, String sourceLayerID) {
        layer.setSourceLayerID(sourceLayerID);
    }

    @ReactProp(name="filter")
    public void setFilter(RCTMLNFillExtrusionLayer layer, ReadableArray filterList) {
        layer.setFilter(filterList);
    }
}
