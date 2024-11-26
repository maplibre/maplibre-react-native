package org.maplibre.mlrn.components.mapview;

import com.facebook.react.bridge.ReactApplicationContext;
import org.maplibre.android.maps.MapLibreMapOptions;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by hernanmateo on 12/11/18.
 */

public class MLRNAndroidTextureMapViewManager extends MLRNMapViewManager {
    public static final String LOG_TAG = "MLRNAndroidTextureMapViewManager";
    public static final String REACT_CLASS = "MLRNAndroidTextureMapView";

    public MLRNAndroidTextureMapViewManager(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNAndroidTextureMapView createViewInstance(ThemedReactContext themedReactContext) {
        MapLibreMapOptions options = new MapLibreMapOptions();
        options.textureMode(true);
        return new MLRNAndroidTextureMapView(themedReactContext, this, options);
    }
}
