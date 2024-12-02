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

public class MLRNFillExtrusionLayerManager extends ViewGroupManager<MLRNFillExtrusionLayer> {
    public static final String REACT_CLASS = "MLRNFillExtrusionLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNFillExtrusionLayer createViewInstance(ThemedReactContext reactContext) {
        return new MLRNFillExtrusionLayer(reactContext);
    }

    @ReactProp(name="id")
    public void setId(MLRNFillExtrusionLayer layer, String id) {
        layer.setID(id);
    }

    @ReactProp(name="sourceID")
    public void setSourceID(MLRNFillExtrusionLayer layer, String sourceID) {
        layer.setSourceID(sourceID);
    }

    @ReactProp(name="aboveLayerID")
    public void setAboveLayerID(MLRNFillExtrusionLayer layer, String aboveLayerID) {
        layer.setAboveLayerID(aboveLayerID);
    }

    @ReactProp(name="belowLayerID")
    public void setBelowLayerID(MLRNFillExtrusionLayer layer, String belowLayerID) {
        layer.setBelowLayerID(belowLayerID);
    }

    @ReactProp(name="layerIndex")
    public void setLayerIndex(MLRNFillExtrusionLayer layer, int layerIndex){
        layer.setLayerIndex(layerIndex);
    }

    @ReactProp(name="minZoomLevel")
    public void setMinZoomLevel(MLRNFillExtrusionLayer layer, double minZoomLevel) {
        layer.setMinZoomLevel(minZoomLevel);
    }

    @ReactProp(name="maxZoomLevel")
    public void setMaxZoomLevel(MLRNFillExtrusionLayer layer, double maxZoomLevel) {
        layer.setMaxZoomLevel(maxZoomLevel);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(MLRNFillExtrusionLayer layer, ReadableMap style) {
        layer.setReactStyle(style);
    }

    @ReactProp(name="sourceLayerID")
    public void setSourceLayerId(MLRNFillExtrusionLayer layer, String sourceLayerID) {
        layer.setSourceLayerID(sourceLayerID);
    }

    @ReactProp(name="filter")
    public void setFilter(MLRNFillExtrusionLayer layer, ReadableArray filterList) {
        layer.setFilter(filterList);
    }
}
