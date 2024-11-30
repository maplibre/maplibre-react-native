package org.maplibre.reactnative.components.mapview;

import android.content.Context;
import org.maplibre.android.maps.MapLibreMapOptions;

@SuppressWarnings({"MissingPermission"})
public class MLRNAndroidTextureMapView extends MLRNMapView {
	public static final String LOG_TAG = "MLRNAndroidTextureMapView";
	
    public MLRNAndroidTextureMapView(Context context, MLRNAndroidTextureMapViewManager manager, MapLibreMapOptions options) {
        super(context, manager, options);
    }
}
