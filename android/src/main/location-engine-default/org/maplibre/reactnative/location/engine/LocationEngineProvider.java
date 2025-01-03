package org.maplibre.reactnative.location.engine;

import android.content.Context;

import org.maplibre.android.location.engine.LocationEngine;

public class LocationEngineProvider implements LocationEngineProvidable {
    @Override
    public LocationEngine getLocationEngine(Context context) {
        return new DefaultLocationEngineProvider().getLocationEngine(context);
    }
}
