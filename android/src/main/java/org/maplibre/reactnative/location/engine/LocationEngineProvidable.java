package org.maplibre.reactnative.location.engine;

import android.content.Context;

import org.maplibre.android.location.engine.LocationEngine;

public interface LocationEngineProvidable {
    LocationEngine getLocationEngine(Context context);
}