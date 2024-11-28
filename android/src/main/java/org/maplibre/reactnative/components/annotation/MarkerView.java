package org.maplibre.reactnative.components.annotation;

import android.view.View;

import androidx.annotation.NonNull;

import org.maplibre.android.geometry.LatLng;

/**
 * Subclass of MarkerView so we MarkerViewManager can implement remove/restoreViews
 */
public class MarkerView extends org.maplibre.android.plugins.markerview.MarkerView {
    View view;

    public MarkerView(@NonNull LatLng latLng, @NonNull View view) {
        super(latLng, view);
        this.view = view;
    }

    public View getView() {
        return this.view;
    }
}
