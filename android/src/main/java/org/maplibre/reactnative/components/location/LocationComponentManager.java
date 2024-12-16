package org.maplibre.reactnative.components.location;

import android.annotation.SuppressLint;
import android.content.Context;

import org.maplibre.android.location.LocationComponent;
import org.maplibre.android.location.LocationComponentActivationOptions;
import org.maplibre.android.location.LocationComponentOptions;
import org.maplibre.android.location.OnCameraTrackingChangedListener;
import org.maplibre.android.location.modes.CameraMode;
import org.maplibre.android.location.modes.RenderMode;
import org.maplibre.android.maps.MapLibreMap;
import org.maplibre.android.maps.Style;
import org.maplibre.reactnative.R;
import org.maplibre.reactnative.components.mapview.MLRNMapView;
import org.maplibre.reactnative.location.LocationManager;

import androidx.annotation.NonNull;

/**
 * The LocationComponent on android implements both location tracking and display of user's current location.
 * LocationComponentManager attempts to separate that, so that Camera can ask for location tracking independent of display of user current location.
 * And NativeUserLocation can ask for display of user's current location - independent of Camera's user tracking.
 */
public class LocationComponentManager {
    private MLRNMapView mMapView = null;
    private MapLibreMap mMap = null;

    private LocationManager mLocationManager = null;
    private LocationComponent mLocationComponent = null;
    private Context mContext = null;

    private @RenderMode.Mode int mRenderMode = RenderMode.COMPASS;

    public LocationComponentManager(MLRNMapView mlrnMapView, Context context) {
        mMapView = mlrnMapView;
        mMap = mMapView.getMapboxMap();
        mContext = context;

        mLocationManager = LocationManager.getInstance(context);
    }

    private boolean mShowUserLocation = false;

    private boolean mFollowUserLocation = false;

    private boolean mShowingUserLocation = false;

    private OnCameraTrackingChangedListener mOnCameraTrackingChangedListener = null;

    public void showUserLocation(boolean showUserLocation) {
        mShowUserLocation = showUserLocation;
        stateChanged();
    }

    public void setFollowUserLocation(boolean followUserLocation) {
        mFollowUserLocation = followUserLocation;
        stateChanged();
    }

    public void setCameraMode(@CameraMode.Mode int cameraMode) {
        mLocationComponent.setCameraMode(cameraMode);
    }

    public void setRenderMode(@RenderMode.Mode int renderMode) {
        mRenderMode = renderMode;
        if (mShowingUserLocation) {
            mLocationComponent.setRenderMode(renderMode);
        }
    }

    public void setPreferredFramesPerSecond(int preferredFramesPerSecond) {
        if (mLocationComponent == null || preferredFramesPerSecond <= 0) {
            return;
        }

        mLocationComponent.setMaxAnimationFps(preferredFramesPerSecond);
    }

    public void addOnCameraTrackingChangedListener(OnCameraTrackingChangedListener onCameraTrackingChangedListener) {
        if (mOnCameraTrackingChangedListener != null) {
            mLocationComponent.removeOnCameraTrackingChangedListener(mOnCameraTrackingChangedListener);
        }

        mOnCameraTrackingChangedListener = onCameraTrackingChangedListener;

        mLocationComponent.addOnCameraTrackingChangedListener(mOnCameraTrackingChangedListener);
    }

    @SuppressLint("MissingPermission")
    private void stateChanged() {
        mLocationComponent.setLocationComponentEnabled((mFollowUserLocation || mShowUserLocation));

        if (mShowingUserLocation != mShowUserLocation) {
            updateShowUserLocation(mShowUserLocation);
        }

        if (mFollowUserLocation) {
            if (!mShowUserLocation) {
                mLocationComponent.setRenderMode(RenderMode.GPS);
            } else {
                mLocationComponent.setRenderMode(mRenderMode);
            }
            mLocationComponent.onStart();
        } else {
            mLocationComponent.setCameraMode(CameraMode.NONE);
        }
    }

    public boolean hasLocationComponent() {
        return (mLocationComponent != null);
    }

    public void update(@NonNull Style style) {
        update(mShowUserLocation, style);
    }

    public void update(boolean displayUserLocation, @NonNull Style style) {
        Integer tintColor = mMapView.getTintColor();

        if (mLocationComponent == null || tintColor != null) {
            mLocationComponent = mMap.getLocationComponent();

            LocationComponentActivationOptions locationComponentActivationOptions = LocationComponentActivationOptions
                    .builder(mContext, style)
                    .locationComponentOptions(options(displayUserLocation))
                    .build();
            mLocationComponent.activateLocationComponent(locationComponentActivationOptions);
            mLocationComponent.setLocationEngine(mLocationManager.getEngine());
            mShowingUserLocation = displayUserLocation;
        }

        updateShowUserLocation(displayUserLocation);
    }

    private void updateShowUserLocation(boolean displayUserLocation) {
        if (mShowingUserLocation != displayUserLocation) {
            mLocationComponent.applyStyle(options(displayUserLocation));
            mShowingUserLocation = displayUserLocation;
        }
    }

    LocationComponentOptions options(boolean displayUserLocation) {
        LocationComponentOptions.Builder builder = LocationComponentOptions.builder(mContext);
        Integer tintColor = mMapView.getTintColor();
        if (!displayUserLocation) {
            builder = builder
                    .padding(mMap.getPadding())
                    .backgroundDrawable(R.drawable.empty)
                    .backgroundDrawableStale(R.drawable.empty)
                    .bearingDrawable(R.drawable.empty)
                    .foregroundDrawable(R.drawable.empty)
                    .foregroundDrawableStale(R.drawable.empty)
                    .gpsDrawable(R.drawable.empty)
                    .accuracyAlpha(0.0f);
        } else if (tintColor != null) {
            builder = builder
                    .enableStaleState(false)
                    .bearingTintColor(tintColor)
                    .foregroundTintColor(tintColor)
                    .accuracyColor(tintColor);
        }
        return builder.build();
    }
}
