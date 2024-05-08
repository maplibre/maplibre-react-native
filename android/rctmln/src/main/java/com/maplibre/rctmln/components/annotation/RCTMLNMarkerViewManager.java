package com.maplibre.rctmln.components.annotation;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.maplibre.rctmln.components.AbstractEventEmitter;
import com.maplibre.rctmln.utils.GeoJSONUtils;

import java.util.Map;

public class RCTMLNMarkerViewManager extends AbstractEventEmitter<RCTMLNMarkerView> {
    public static final String REACT_CLASS = "RCTMLNMarkerView";

    public RCTMLNMarkerViewManager(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactProp(name="coordinate")
    public void setCoordinate(RCTMLNMarkerView markerView, String geoJSONStr) {
        markerView.setCoordinate(GeoJSONUtils.toPointGeometry(geoJSONStr));
    }

    @ReactProp(name="anchor")
    public void setAnchor(RCTMLNMarkerView markerView, ReadableMap map) {
        markerView.setAnchor((float) map.getDouble("x"), (float) map.getDouble("y"));
    }

    @Override
    protected RCTMLNMarkerView createViewInstance(ThemedReactContext reactContext) {
        return new RCTMLNMarkerView(reactContext, this);
    }

    @Override
    public Map<String, String> customEvents() {
        return MapBuilder.<String, String>builder()
                .build();
    }
}
