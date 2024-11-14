package com.maplibre.rctmln.components.styles.light;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by nickitaliano on 9/26/17.
 */

public class RCTMLNLightManager extends ViewGroupManager<RCTMLNLight> {
    public static final String REACT_CLASS = "RCTMLNLight";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RCTMLNLight createViewInstance(ThemedReactContext reactContext) {
        return new RCTMLNLight(reactContext);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(RCTMLNLight light, ReadableMap reactStyle) {
        light.setReactStyle(reactStyle);
    }
}
