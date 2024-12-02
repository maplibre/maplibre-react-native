package org.maplibre.reactnative.components.styles.light;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class MLRNLightManager extends ViewGroupManager<MLRNLight> {
    public static final String REACT_CLASS = "MLRNLight";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNLight createViewInstance(ThemedReactContext reactContext) {
        return new MLRNLight(reactContext);
    }

    @ReactProp(name="reactStyle")
    public void setReactStyle(MLRNLight light, ReadableMap reactStyle) {
        light.setReactStyle(reactStyle);
    }
}
