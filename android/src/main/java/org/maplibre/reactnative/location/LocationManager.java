package org.maplibre.reactnative.location;

import android.content.Context;
import android.location.Location;
import android.os.Looper;
import android.util.Log;

import org.maplibre.android.location.engine.LocationEngine;
import org.maplibre.android.location.engine.LocationEngineCallback;
import org.maplibre.android.location.engine.LocationEngineRequest;
import org.maplibre.android.location.engine.LocationEngineResult;
import org.maplibre.android.location.permissions.PermissionsManager;
import org.maplibre.reactnative.location.engine.LocationEngineProvider;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings({"MissingPermission"})
public class LocationManager implements LocationEngineCallback<LocationEngineResult> {
    static final long DEFAULT_FASTEST_INTERVAL_MILLIS = 1000;
    static final long DEFAULT_INTERVAL_MILLIS = 1000;

    public static final String LOG_TAG = "LocationManager";

    private LocationEngine locationEngine;
    private Context context;
    private List<OnUserLocationChange> listeners = new ArrayList<>();

    private float mMinDisplacement = 0;
    private boolean isActive = false;
    private Location lastLocation = null;

    private LocationEngineRequest locationEngineRequest = null;

    private static WeakReference<LocationManager> INSTANCE = null;

    public static LocationManager getInstance(Context context) {
        if (INSTANCE == null) {
            INSTANCE = new WeakReference<>(new LocationManager(context));
        }
        return INSTANCE.get();
    }

    public interface OnUserLocationChange {
        void onLocationChange(Location location);
    }

    private LocationManager(Context context) {
        this.context = context;
        this.buildEngineRequest();

    }

    private void buildEngineRequest() {
        locationEngine = new LocationEngineProvider().getLocationEngine(context);

        locationEngineRequest = new LocationEngineRequest.Builder(DEFAULT_INTERVAL_MILLIS)
                .setFastestInterval(DEFAULT_FASTEST_INTERVAL_MILLIS)
                .setPriority(LocationEngineRequest.PRIORITY_HIGH_ACCURACY)
                .setDisplacement(mMinDisplacement)
                .build();
    }

    public void addLocationListener(OnUserLocationChange listener) {
        if (!listeners.contains(listener)) {
            listeners.add(listener);
        }
    }

    public void removeLocationListener(OnUserLocationChange listener) {
        if (listeners.contains(listener)) {
            listeners.remove(listener);
        }
    }

    public void setMinDisplacement(float minDisplacement) {
        mMinDisplacement = minDisplacement;
    }

    public void enable() {
        if (!PermissionsManager.areLocationPermissionsGranted(context)) {
            return;
        }

        // remove existing listeners
        locationEngine.removeLocationUpdates(this);

        // refresh location engine request with new values
        this.buildEngineRequest();

        // add new listeners
        locationEngine.requestLocationUpdates(
                locationEngineRequest,
                this,
                Looper.getMainLooper()
        );
        isActive = true;
    }


    public void disable() {
        locationEngine.removeLocationUpdates(this);
        isActive = false;
    }

    public void dispose() {
        if (locationEngine == null) {
            return;
        }
        disable();
        locationEngine.removeLocationUpdates(this);
    }

    public boolean isActive() {
        return locationEngine != null && this.isActive;
    }

    public Location getLastKnownLocation() {
        if (locationEngine == null) {
            return null;
        }
        return lastLocation;
    }


    public void getLastKnownLocation(LocationEngineCallback<LocationEngineResult> callback) {
        if (locationEngine == null) {
            callback.onFailure(new Exception("LocationEngine not initialized"));
        }

        try {
            locationEngine.getLastLocation(callback);
        } catch (Exception exception) {
            Log.w(LOG_TAG, exception);
            callback.onFailure(exception);
        }
    }

    public LocationEngine getEngine() {
        return locationEngine;
    }

    public void onLocationChanged(Location location) {
        lastLocation = location;
        for (OnUserLocationChange listener : listeners) {
            listener.onLocationChange(location);
        }
    }

    @Override
    public void onFailure(Exception exception) {
        // FMTODO handle this.
    }

    @Override
    public void onSuccess(LocationEngineResult result) {
        onLocationChanged(result.getLastLocation());
    }
}
