package com.maplibre.rctmln.components.annotation;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

/**
 * Created by nickitaliano on 10/11/17.
 */

public class RCTMLNCalloutManager extends ViewGroupManager<RCTMLNCallout> {
    public static final String REACT_CLASS = "RCTMLNCallout";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RCTMLNCallout createViewInstance(ThemedReactContext reactContext) {
        return new RCTMLNCallout(reactContext);
    }
}
