package org.maplibre.reactnative.components.styles.layers;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import org.maplibre.reactnative.components.AbstractEventEmitter;
import org.maplibre.reactnative.components.AbstractMapFeature;

import java.util.Map;

public class MLRNLineLayerManager extends ViewGroupManager<MLRNLineLayer> {
    public static final String REACT_CLASS = "MLRNLineLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNLineLayer createViewInstance(ThemedReactContext reactContext) {
        return new MLRNLineLayer(reactContext);
    }

    @ReactProp(name="id")
    public void setId(MLRNLineLayer layer, String id) {
        layer.setID(id);
    }

    @ReactProp(name="sourceID")
    public void setSourceID(MLRNLineLayer layer, String sourceID) {
        layer.setSourceID(sourceID);
    }

    @ReactProp(name="aboveLayerID")
    public void setAboveLayerID(MLRNLineLayer layer, String aboveLayerID) {
        layer.setAboveLayerID(aboveLayerID);
    }

    @ReactProp(name="belowLayerID")
    public void setBelowLayerID(MLRNLineLayer layer, String belowLayerID) {
        layer.setBelowLayerID(belowLayerID);
    }

    @ReactProp(name="layerIndex")
    public void setLayerIndex(MLRNLineLayer layer, int layerIndex){
        layer.setLayerIndex(layerIndex);
    }

    @ReactProp(name="minZoomLevel")
    public void setMinZoomLevel(MLRNLineLayer layer, double minZoomLevel) {
        layer.setMinZoomLevel(minZoomLevel);
    }

    @ReactProp(name="maxZoomLevel")
    public void setMaxZoomLevel(MLRNLineLayer layer, double maxZoomLevel) {
        layer.setMaxZoomLevel(maxZoomLevel);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(MLRNLineLayer layer, ReadableMap style) {
        layer.setReactStyle(style);
    }

    @ReactProp(name="sourceLayerID")
    public void setSourceLayerId(MLRNLineLayer layer, String sourceLayerID) {
        layer.setSourceLayerID(sourceLayerID);
    }

    @ReactProp(name="filter")
    public void setFilter(MLRNLineLayer layer, ReadableArray filterList) {
        layer.setFilter(filterList);
    }
}
