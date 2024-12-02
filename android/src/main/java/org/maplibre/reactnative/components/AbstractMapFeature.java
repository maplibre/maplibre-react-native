package org.maplibre.reactnative.components;

import android.content.Context;

import com.facebook.react.views.view.ReactViewGroup;
import org.maplibre.reactnative.components.mapview.MLRNMapView;

public abstract class AbstractMapFeature extends ReactViewGroup {
    public AbstractMapFeature(Context context) {
        super(context);
    }

    public abstract void addToMap(MLRNMapView mapView);
    public abstract void removeFromMap(MLRNMapView mapView);
}
