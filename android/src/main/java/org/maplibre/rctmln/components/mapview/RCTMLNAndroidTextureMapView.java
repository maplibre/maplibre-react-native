package org.maplibre.rctmln.components.mapview;

import android.content.Context;
import org.maplibre.android.maps.MapLibreMapOptions;
/**
 * Created by hernanmateo on 12/11/18.
 */

@SuppressWarnings({"MissingPermission"})
public class RCTMLNAndroidTextureMapView extends RCTMLNMapView {
	public static final String LOG_TAG = "RCTMLNAndroidTextureMapView";
	
    public RCTMLNAndroidTextureMapView(Context context, RCTMLNAndroidTextureMapViewManager manager, MapLibreMapOptions options) {
        super(context, manager, options);
    }
}
