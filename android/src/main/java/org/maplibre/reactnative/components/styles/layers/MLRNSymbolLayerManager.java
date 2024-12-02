package org.maplibre.reactnative.components.styles.layers;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class MLRNSymbolLayerManager extends ViewGroupManager<MLRNSymbolLayer> {
    public static final String REACT_CLASS = "MLRNSymbolLayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNSymbolLayer createViewInstance(ThemedReactContext reactContext) {
        return new MLRNSymbolLayer(reactContext);
    }

    @ReactProp(name="id")
    public void setId(MLRNSymbolLayer layer, String id) {
        layer.setID(id);
    }

    @ReactProp(name="sourceID")
    public void setSourceID(MLRNSymbolLayer layer, String sourceID) {
        layer.setSourceID(sourceID);
    }

    @ReactProp(name="aboveLayerID")
    public void setAboveLayerID(MLRNSymbolLayer layer, String aboveLayerID) {
        layer.setAboveLayerID(aboveLayerID);
    }

    @ReactProp(name="belowLayerID")
    public void setBelowLayerID(MLRNSymbolLayer layer, String belowLayerID) {
        layer.setBelowLayerID(belowLayerID);
    }

    @ReactProp(name="layerIndex")
    public void setLayerIndex(MLRNSymbolLayer layer, int layerIndex){
        layer.setLayerIndex(layerIndex);
    }

    @ReactProp(name="minZoomLevel")
    public void setMinZoomLevel(MLRNSymbolLayer layer, double minZoomLevel) {
        layer.setMinZoomLevel(minZoomLevel);
    }

    @ReactProp(name="maxZoomLevel")
    public void setMaxZoomLevel(MLRNSymbolLayer layer, double maxZoomLevel) {
        layer.setMaxZoomLevel(maxZoomLevel);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(MLRNSymbolLayer layer, ReadableMap style) {
        layer.setReactStyle(style);
    }

    @ReactProp(name="sourceLayerID")
    public void setSourceLayerId(MLRNSymbolLayer layer, String sourceLayerID) {
        layer.setSourceLayerID(sourceLayerID);
    }

    @ReactProp(name="filter")
    public void setFilter(MLRNSymbolLayer layer, ReadableArray filterList) {
        layer.setFilter(filterList);
    }
}
