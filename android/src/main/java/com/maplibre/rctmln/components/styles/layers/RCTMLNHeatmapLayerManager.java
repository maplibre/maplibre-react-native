package com.maplibre.rctmln.components.styles.layers;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;

/**
 * Created by dhee9000 on 6/8/2019
 */

public class RCTMLNHeatmapLayerManager extends ViewGroupManager<RCTMLNHeatmapLayer>{
    public static final String REACT_CLASS = "RCTMLNHeatmapLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RCTMLNHeatmapLayer createViewInstance(ThemedReactContext reactContext) {
        return new RCTMLNHeatmapLayer(reactContext);
    }

    @ReactProp(name="id")
    public void setId(RCTMLNHeatmapLayer layer, String id) {
        layer.setID(id);
    }

    @ReactProp(name="sourceID")
    public void setSourceID(RCTMLNHeatmapLayer layer, String sourceID) {
        layer.setSourceID(sourceID);
    }

    @ReactProp(name="aboveLayerID")
    public void setAboveLayerID(RCTMLNHeatmapLayer layer, String aboveLayerID) {
        layer.setAboveLayerID(aboveLayerID);
    }

    @ReactProp(name="belowLayerID")
    public void setBelowLayerID(RCTMLNHeatmapLayer layer, String belowLayerID) {
        layer.setBelowLayerID(belowLayerID);
    }

    @ReactProp(name="layerIndex")
    public void setLayerIndex(RCTMLNHeatmapLayer layer, int layerIndex){
        layer.setLayerIndex(layerIndex);
    }

    @ReactProp(name="minZoomLevel")
    public void setMinZoomLevel(RCTMLNHeatmapLayer layer, double minZoomLevel) {
        layer.setMinZoomLevel(minZoomLevel);
    }

    @ReactProp(name="maxZoomLevel")
    public void setMaxZoomLevel(RCTMLNHeatmapLayer layer, double maxZoomLevel) {
        layer.setMaxZoomLevel(maxZoomLevel);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(RCTMLNHeatmapLayer layer, ReadableMap style) {
        layer.setReactStyle(style);
    }

    @ReactProp(name="sourceLayerID")
    public void setSourceLayerId(RCTMLNHeatmapLayer layer, String sourceLayerID) {
        layer.setSourceLayerID(sourceLayerID);
    }

    @ReactProp(name="filter")
    public void setFilter(RCTMLNHeatmapLayer layer, ReadableArray filterList) {
        layer.setFilter(filterList);
    }
}
