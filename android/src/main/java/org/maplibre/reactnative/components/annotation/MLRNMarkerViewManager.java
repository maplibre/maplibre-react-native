package org.maplibre.reactnative.components.annotation;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import org.maplibre.reactnative.components.AbstractEventEmitter;
import org.maplibre.reactnative.utils.GeoJSONUtils;

import java.util.Map;

public class MLRNMarkerViewManager extends AbstractEventEmitter<MLRNMarkerView> {
    public static final String REACT_CLASS = "MLRNMarkerView";

    public MLRNMarkerViewManager(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactProp(name="coordinate")
    public void setCoordinate(MLRNMarkerView markerView, String geoJSONStr) {
        markerView.setCoordinate(GeoJSONUtils.toPointGeometry(geoJSONStr));
    }

    @ReactProp(name="anchor")
    public void setAnchor(MLRNMarkerView markerView, ReadableMap map) {
        markerView.setAnchor((float) map.getDouble("x"), (float) map.getDouble("y"));
    }

    @Override
    protected MLRNMarkerView createViewInstance(ThemedReactContext reactContext) {
        return new MLRNMarkerView(reactContext, this);
    }

    @Override
    public Map<String, String> customEvents() {
        return MapBuilder.<String, String>builder()
                .build();
    }
}
