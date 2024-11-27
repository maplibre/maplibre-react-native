package org.maplibre.reactnative.components.annotation;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

/**
 * Created by nickitaliano on 10/11/17.
 */

public class MLRNCalloutManager extends ViewGroupManager<MLRNCallout> {
    public static final String REACT_CLASS = "MLRNCallout";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNCallout createViewInstance(ThemedReactContext reactContext) {
        return new MLRNCallout(reactContext);
    }
}
