package com.maplibre.rctmln.components;

import android.content.Context;

import com.facebook.react.views.view.ReactViewGroup;
import com.maplibre.rctmln.components.mapview.RCTMLNMapView;

/**
 * Created by nickitaliano on 9/6/17.
 */

public abstract class AbstractMapFeature extends ReactViewGroup {
    public AbstractMapFeature(Context context) {
        super(context);
    }

    public abstract void addToMap(RCTMLNMapView mapView);
    public abstract void removeFromMap(RCTMLNMapView mapView);
}
