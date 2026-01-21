package org.maplibre.reactnative.components.layers;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public abstract class MLRNLayerManager<T extends MLRNLayer<?>> extends ViewGroupManager<T> {

    protected abstract T createLayerViewInstance(ThemedReactContext reactContext);

    @Override
    protected T createViewInstance(ThemedReactContext reactContext) {
        return createLayerViewInstance(reactContext);
    }

    @ReactProp(name="id")
    public void setId(T layer, String id) {
        layer.setID(id);
    }

    @ReactProp(name="afterId")
    public void setAboveLayerID(T layer, String aboveLayerID) {
        layer.setAboveLayerID(aboveLayerID);
    }

    @ReactProp(name="beforeId")
    public void setBelowLayerID(T layer, String belowLayerID) {
        layer.setBelowLayerID(belowLayerID);
    }

    @ReactProp(name="layerIndex")
    public void setLayerIndex(T layer, int layerIndex){
        layer.setLayerIndex(layerIndex);
    }

    @ReactProp(name="minzoom")
    public void setMinZoomLevel(T layer, double minZoomLevel) {
        layer.setMinZoomLevel(minZoomLevel);
    }

    @ReactProp(name="maxzoom")
    public void setMaxZoomLevel(T layer, double maxZoomLevel) {
        layer.setMaxZoomLevel(maxZoomLevel);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(T layer, ReadableMap style) {
        layer.setReactStyle(style);
    }
}
