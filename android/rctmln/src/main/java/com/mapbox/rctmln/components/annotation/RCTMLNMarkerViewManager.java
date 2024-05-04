package com.mapbox.rctmln.components.annotation;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.mapbox.rctmln.components.AbstractEventEmitter;
import com.mapbox.rctmln.utils.GeoJSONUtils;

import java.util.Map;

public class RCTLNMarkerViewManager extends AbstractEventEmitter<RCTLNMarkerView> {
    public static final String REACT_CLASS = "RCTLNMarkerView";

    public RCTLNMarkerViewManager(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactProp(name="coordinate")
    public void setCoordinate(RCTLNMarkerView markerView, String geoJSONStr) {
        markerView.setCoordinate(GeoJSONUtils.toPointGeometry(geoJSONStr));
    }

    @ReactProp(name="anchor")
    public void setAnchor(RCTLNMarkerView markerView, ReadableMap map) {
        markerView.setAnchor((float) map.getDouble("x"), (float) map.getDouble("y"));
    }

    @Override
    protected RCTLNMarkerView createViewInstance(ThemedReactContext reactContext) {
        return new RCTLNMarkerView(reactContext, this);
    }

    @Override
    public Map<String, String> customEvents() {
        return MapBuilder.<String, String>builder()
                .build();
    }
}
