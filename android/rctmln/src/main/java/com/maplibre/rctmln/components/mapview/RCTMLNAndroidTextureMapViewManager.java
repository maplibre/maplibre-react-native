package com.maplibre.rctmln.components.mapview;

import com.facebook.react.bridge.ReactApplicationContext;
import org.maplibre.android.maps.MapLibreMapOptions;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by hernanmateo on 12/11/18.
 */

public class RCTMLNAndroidTextureMapViewManager extends RCTMLNMapViewManager {
    public static final String LOG_TAG = "RCTMLNAndroidTextureMapViewManager";
    public static final String REACT_CLASS = "RCTMLNAndroidTextureMapView";

    public RCTMLNAndroidTextureMapViewManager(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RCTMLNAndroidTextureMapView createViewInstance(ThemedReactContext themedReactContext) {
        MapLibreMapOptions options = new MapLibreMapOptions();
        options.textureMode(true);
        return new RCTMLNAndroidTextureMapView(themedReactContext, this, options);
    }
}
