package com.maplibre.rctmln.components.camera;

import com.mapbox.geojson.FeatureCollection;
import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.maplibre.rctmln.components.AbstractEventEmitter;
import com.maplibre.rctmln.utils.GeoJSONUtils;

import java.util.HashMap;
import java.util.Map;

public class RCTMLNCameraManager extends AbstractEventEmitter<RCTMLNCamera> {
    public static final String REACT_CLASS = "RCTMLNCamera";

    private ReactApplicationContext mContext;

    public RCTMLNCameraManager(ReactApplicationContext context) {
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
    protected RCTMLNCamera createViewInstance(ThemedReactContext reactContext) {
        return new RCTMLNCamera(reactContext, this);
    }

    @ReactProp(name="stop")
    public void setStop(RCTMLNCamera camera, ReadableMap map) {
        if (map != null) {
            CameraStop stop = CameraStop.fromReadableMap(mContext, map, null);
            camera.setStop(stop);
        }
    }

    @ReactProp(name="defaultStop")
    public void setDefaultStop(RCTMLNCamera camera, ReadableMap map) {
        if (map != null) {
            CameraStop stop = CameraStop.fromReadableMap(mContext, map, null);
            camera.setDefaultStop(stop);
        }
    }

    @ReactProp(name="maxBounds")
    public void setMaxBounds(RCTMLNCamera camera, String value) {
        if (value != null) {
            FeatureCollection collection = FeatureCollection.fromJson(value);
            camera.setMaxBounds(GeoJSONUtils.toLatLngBounds(collection));
        }
    }


    @ReactProp(name="userTrackingMode")
    public void setUserTrackingMode(RCTMLNCamera camera, int userTrackingMode) {
        camera.setUserTrackingMode(userTrackingMode);
        throw new AssertionError("Unused code");
    }

    @ReactProp(name="followZoomLevel")
    public void setZoomLevel(RCTMLNCamera camera, double zoomLevel) {
        camera.setZoomLevel(zoomLevel);
    }

    @ReactProp(name="followUserLocation")
    public void setFollowUserLocation(RCTMLNCamera camera, boolean value) {
        camera.setFollowUserLocation(value);
    }

    @ReactProp(name="followUserMode")
    public void setFollowUserMode(RCTMLNCamera camera, String value) {
        camera.setFollowUserMode(value);
    }

    @ReactProp(name="minZoomLevel")
    public void setMinZoomLevel(RCTMLNCamera camera, double value) {
        camera.setMinZoomLevel(value);
    }

    @ReactProp(name="maxZoomLevel")
    public void setMaxZoomLevel(RCTMLNCamera camera, double value) {
        camera.setMaxZoomLevel(value);
    }

    @ReactProp(name="followPitch")
    public void setFollowPitch(RCTMLNCamera camera, double value) {
        camera.setFollowPitch(value);
    }

}
