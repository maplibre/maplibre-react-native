package org.maplibre.reactnative.components.camera;

import org.maplibre.geojson.FeatureCollection;
import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import org.maplibre.reactnative.components.AbstractEventEmitter;
import org.maplibre.reactnative.utils.GeoJSONUtils;

import java.util.HashMap;
import java.util.Map;

public class MLRNCameraManager extends AbstractEventEmitter<MLRNCamera> {
    public static final String REACT_CLASS = "MLRNCamera";

    private ReactApplicationContext mContext;

    public MLRNCameraManager(ReactApplicationContext context) {
        super(context);
        mContext = context;
    }

    @Override
    public Map<String, String> customEvents() {
        return new HashMap<>();
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNCamera createViewInstance(ThemedReactContext reactContext) {
        return new MLRNCamera(reactContext, this);
    }

    @ReactProp(name="stop")
    public void setStop(MLRNCamera camera, ReadableMap map) {
        if (map != null) {
            CameraStop stop = CameraStop.fromReadableMap(mContext, map, null);
            camera.setStop(stop);
        }
    }

    @ReactProp(name="defaultStop")
    public void setDefaultStop(MLRNCamera camera, ReadableMap map) {
        if (map != null) {
            CameraStop stop = CameraStop.fromReadableMap(mContext, map, null);
            camera.setDefaultStop(stop);
        }
    }

    @ReactProp(name="maxBounds")
    public void setMaxBounds(MLRNCamera camera, String value) {
        if (value != null) {
            FeatureCollection collection = FeatureCollection.fromJson(value);
            camera.setMaxBounds(GeoJSONUtils.toLatLngBounds(collection));
        }
    }


    @ReactProp(name="userTrackingMode")
    public void setUserTrackingMode(MLRNCamera camera, int userTrackingMode) {
        camera.setUserTrackingMode(userTrackingMode);
        throw new AssertionError("Unused code");
    }

    @ReactProp(name="followZoomLevel")
    public void setZoomLevel(MLRNCamera camera, double zoomLevel) {
        camera.setZoomLevel(zoomLevel);
    }

    @ReactProp(name="followUserLocation")
    public void setFollowUserLocation(MLRNCamera camera, boolean value) {
        camera.setFollowUserLocation(value);
    }

    @ReactProp(name="followUserMode")
    public void setFollowUserMode(MLRNCamera camera, String value) {
        camera.setFollowUserMode(value);
    }

    @ReactProp(name="minZoomLevel")
    public void setMinZoomLevel(MLRNCamera camera, double value) {
        camera.setMinZoomLevel(value);
    }

    @ReactProp(name="maxZoomLevel")
    public void setMaxZoomLevel(MLRNCamera camera, double value) {
        camera.setMaxZoomLevel(value);
    }

    @ReactProp(name="followPitch")
    public void setFollowPitch(MLRNCamera camera, double value) {
        camera.setFollowPitch(value);
    }

}
