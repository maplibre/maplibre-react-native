package com.maplibre.rctmln.components.location;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.mapbox.mapboxsdk.location.modes.RenderMode;

import javax.annotation.Nonnull;

public class RCTMLNNativeUserLocationManager extends ViewGroupManager<RCTMLNNativeUserLocation> {
    public static final String REACT_CLASS = "RCTMLNNativeUserLocation";

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactProp(name="androidRenderMode")
    public void setAndroidRenderMode(RCTMLNNativeUserLocation userLocation, String mode) {
       if ("compass".equalsIgnoreCase(mode)) {
           userLocation.setRenderMode(RenderMode.COMPASS);
        } else if ("gps".equalsIgnoreCase(mode)) {
           userLocation.setRenderMode(RenderMode.GPS);
        } else {
           userLocation.setRenderMode(RenderMode.NORMAL);
       }
    }

    @Nonnull
    @Override
    protected RCTMLNNativeUserLocation createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new RCTMLNNativeUserLocation(reactContext);
    }
}
