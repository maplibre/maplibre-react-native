package org.maplibre.reactnative.components.styles.sources;

import android.content.Context;
import androidx.annotation.NonNull;

import android.graphics.PointF;
import android.view.View;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import org.maplibre.geojson.Feature;
import org.maplibre.android.geometry.LatLng;
import org.maplibre.android.log.Logger;
import org.maplibre.android.maps.MapLibreMap;
import org.maplibre.android.maps.Style;
import org.maplibre.android.style.sources.Source;
import org.maplibre.reactnative.components.AbstractMapFeature;
import org.maplibre.reactnative.components.mapview.MLRNMapView;
import org.maplibre.reactnative.components.styles.layers.MLRNLayer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class MLRNSource<T extends Source> extends AbstractMapFeature {
    public static final String DEFAULT_ID = "composite";
    public static final String LOG_TAG = "MLRNSource";

    public static final double DEFAULT_HITBOX_WIDTH = 44.0;
    public static final double DEFAULT_HITBOX_HEIGHT = 44.0;

    protected MLRNMapView mMapView;
    protected MapLibreMap mMap;

    protected String mID;
    protected T mSource;
    protected boolean mHasPressListener;
    protected Map<String, Double> mTouchHitbox;

    protected List<MLRNLayer> mLayers;
    private List<MLRNLayer> mQueuedLayers;

    public MLRNSource(Context context) {
        super(context);
        mLayers = new ArrayList<>();
        mQueuedLayers = new ArrayList<>();
    }

    public String getID() {
        return mID;
    }

    public String[] getLayerIDs() {
        List<String> layerIDs = new ArrayList<>();

        for (int i = 0; i < mLayers.size(); i++) {
            MLRNLayer layer = mLayers.get(i);
            layerIDs.add(layer.getID());
        }

        return layerIDs.toArray(new String[layerIDs.size()]);
    }

    public boolean hasPressListener() {
        return mHasPressListener;
    }

    public void setHasPressListener (boolean hasPressListener) {
        mHasPressListener = hasPressListener;
    }

    public void setHitbox(ReadableMap map) {
        Map<String, Double> hitbox = new HashMap<>();
        hitbox.put("width", map.getDouble("width"));
        hitbox.put("height", map.getDouble("height"));
        mTouchHitbox = hitbox;
    }

    public void setID(String id) {
        mID = id;
    }

    public void setSource(T source) {
        mSource = source;
    }

    public Map<String, Double> getTouchHitbox() {
        if (!hasPressListener()) {
            return null;
        }

        if (mTouchHitbox == null) {
            return MapBuilder.<String, Double>builder()
                    .put("width", DEFAULT_HITBOX_WIDTH)
                    .put("height", DEFAULT_HITBOX_HEIGHT)
                    .build();
        }

        return mTouchHitbox;
    }

    public int getLayerCount () {
        int totalCount = 0;

        if (mQueuedLayers != null) {
            totalCount = mQueuedLayers.size();
        }

        totalCount += mLayers.size();
        return totalCount;
    }

    @Override
    public void addToMap(MLRNMapView mapView) {
        mMapView = mapView;
        mMap = mapView.getMapboxMap();
        mMap.getStyle(new Style.OnStyleLoaded() {
            public void onStyleLoaded(@NonNull Style style) {
                T existingSource = style.getSourceAs(mID);
                if (existingSource != null) {
                    mSource = existingSource;
                } else {
                    mSource = makeSource();
                    style.addSource(mSource);
                }

                if (mQueuedLayers != null && mQueuedLayers.size() > 0) { // first load
                    for (int i = 0; i < mQueuedLayers.size(); i++) {
                        addLayerToMap(mQueuedLayers.get(i), i);
                    }
                    mQueuedLayers = null;
                } else if (mLayers.size() > 0) { // handles the case of switching style url, but keeping layers on map
                    for (int i = 0; i < mLayers.size(); i++) {
                        addLayerToMap(mLayers.get(i), i);
                    }
                }
            }
        });


    }

    @Override
    public void removeFromMap(MLRNMapView mapView) {
        if (mLayers.size() > 0) {
            for (int i = 0; i < mLayers.size(); i++) {
                MLRNLayer layer = mLayers.get(i);
                layer.removeFromMap(mMapView);
            }
        }
        if (mQueuedLayers != null) {
            mQueuedLayers.clear();
        }
        if (mMap != null && mSource != null  && mMap.getStyle() != null) {
            try {
                mMap.getStyle().removeSource(mSource);
            } catch (Throwable ex) {
                Logger.w(LOG_TAG, String.format("MLRNSource.removeFromMap: %s - %s", mSource, ex.getMessage()), ex);
            }
        }
    }

    public void addLayer(View childView, int childPosition) {
        if (!(childView instanceof MLRNLayer)) {
            return;
        }

        MLRNLayer layer = (MLRNLayer) childView;
        if (mMap == null) {
            mQueuedLayers.add(childPosition, layer);
        } else {
            addLayerToMap(layer, childPosition);
        }
    }

    public void removeLayer(int childPosition) {
        MLRNLayer layer;
        if (mQueuedLayers != null && mQueuedLayers.size() > 0) {
            layer = mQueuedLayers.get(childPosition);
        } else {
            layer = mLayers.get(childPosition);
        }
        removeLayerFromMap(layer, childPosition);
    }

    public MLRNLayer getLayerAt(int childPosition) {
        if (mQueuedLayers != null && mQueuedLayers.size() > 0) {
            return mQueuedLayers.get(childPosition);
        }
        return mLayers.get(childPosition);
    }

    protected void addLayerToMap(MLRNLayer layer, int childPosition) {
        if (mMapView == null || layer == null) {
            return;
        }

        layer.addToMap(mMapView);
        if (!mLayers.contains(layer)) {
            mLayers.add(childPosition, layer);
        }
    }

    protected void removeLayerFromMap(MLRNLayer layer, int childPosition) {
        if (mMapView != null && layer != null) {
            layer.removeFromMap(mMapView);
        }
        if (mQueuedLayers != null && mQueuedLayers.size() > 0) {
            mQueuedLayers.remove(childPosition);
        } else {
            mLayers.remove(childPosition);
        }
    }

    public Style getStyle() {
        if (mMap == null) return null;
        return mMap.getStyle();
    }

    public abstract T makeSource();

    static public class OnPressEvent {
        public List<Feature> features;
        public LatLng latLng;
        public PointF screenPoint;

        public OnPressEvent(@NonNull List<Feature> features, @NonNull LatLng latLng, @NonNull PointF screenPoint) {
            this.features = features;
            this.latLng = latLng;
            this.screenPoint = screenPoint;
        }
    }

    public abstract void onPress(OnPressEvent event);

    public static boolean isDefaultSource(String sourceID) {
        return DEFAULT_ID.equals(sourceID);
    }
}
