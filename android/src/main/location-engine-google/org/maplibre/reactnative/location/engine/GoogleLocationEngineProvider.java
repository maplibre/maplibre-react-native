package org.maplibre.reactnative.location.engine;

import android.content.Context;
import android.util.Log;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;

import org.maplibre.android.location.engine.LocationEngine;
import org.maplibre.android.location.engine.LocationEngineProxy;

public class GoogleLocationEngineProvider implements LocationEngineProvidable {
    private static final String LOG_TAG = "GoogleLocationEngineProvider";

    public LocationEngine getLocationEngine(Context context) {
        if (GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context) == ConnectionResult.SUCCESS) {
            LocationEngine locationEngine = new LocationEngineProxy<>(new GoogleLocationEngineImpl(context.getApplicationContext()));
            Log.d(LOG_TAG, "GoogleLocationEngine will be used.");
            return locationEngine;
        } else {
            return new DefaultLocationEngineProvider().getLocationEngine(context);
        }
    }
}