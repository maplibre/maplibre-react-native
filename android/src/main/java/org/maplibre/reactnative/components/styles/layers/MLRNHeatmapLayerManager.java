package org.maplibre.reactnative.components.styles.layers;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;

public class MLRNHeatmapLayerManager extends ViewGroupManager<MLRNHeatmapLayer>{
    public static final String REACT_CLASS = "MLRNHeatmapLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNHeatmapLayer createViewInstance(ThemedReactContext reactContext) {
        return new MLRNHeatmapLayer(reactContext);
    }

    @ReactProp(name="id")
    public void setId(MLRNHeatmapLayer layer, String id) {
        layer.setID(id);
    }

    @ReactProp(name="sourceID")
    public void setSourceID(MLRNHeatmapLayer layer, String sourceID) {
        layer.setSourceID(sourceID);
    }

    @ReactProp(name="aboveLayerID")
    public void setAboveLayerID(MLRNHeatmapLayer layer, String aboveLayerID) {
        layer.setAboveLayerID(aboveLayerID);
    }

    @ReactProp(name="belowLayerID")
    public void setBelowLayerID(MLRNHeatmapLayer layer, String belowLayerID) {
        layer.setBelowLayerID(belowLayerID);
    }

    @ReactProp(name="layerIndex")
    public void setLayerIndex(MLRNHeatmapLayer layer, int layerIndex){
        layer.setLayerIndex(layerIndex);
    }

    @ReactProp(name="minZoomLevel")
    public void setMinZoomLevel(MLRNHeatmapLayer layer, double minZoomLevel) {
        layer.setMinZoomLevel(minZoomLevel);
    }

    @ReactProp(name="maxZoomLevel")
    public void setMaxZoomLevel(MLRNHeatmapLayer layer, double maxZoomLevel) {
        layer.setMaxZoomLevel(maxZoomLevel);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(MLRNHeatmapLayer layer, ReadableMap style) {
        layer.setReactStyle(style);
    }

    @ReactProp(name="sourceLayerID")
    public void setSourceLayerId(MLRNHeatmapLayer layer, String sourceLayerID) {
        layer.setSourceLayerID(sourceLayerID);
    }

    @ReactProp(name="filter")
    public void setFilter(MLRNHeatmapLayer layer, ReadableArray filterList) {
        layer.setFilter(filterList);
    }
}
