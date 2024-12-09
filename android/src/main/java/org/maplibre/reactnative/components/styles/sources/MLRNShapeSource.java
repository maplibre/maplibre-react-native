package org.maplibre.reactnative.components.styles.sources;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.Size;
import androidx.core.content.res.ResourcesCompat;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import org.maplibre.geojson.Feature;
import org.maplibre.geojson.FeatureCollection;
import org.maplibre.android.maps.MapLibreMap;
import org.maplibre.android.maps.Style;
import org.maplibre.android.style.expressions.Expression;
import org.maplibre.android.style.sources.GeoJsonOptions;
import org.maplibre.android.style.sources.GeoJsonSource;
import org.maplibre.android.utils.BitmapUtils;
import org.maplibre.reactnative.R;
import org.maplibre.reactnative.components.mapview.MLRNMapView;
import org.maplibre.reactnative.events.AndroidCallbackEvent;
import org.maplibre.reactnative.events.FeatureClickEvent;
import org.maplibre.reactnative.utils.ClusterPropertyEntry;
import org.maplibre.reactnative.utils.DownloadMapImageTask;
import org.maplibre.reactnative.utils.ImageEntry;

import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class MLRNShapeSource extends MLRNSource<GeoJsonSource> {
    private URL mURL;
    private MLRNShapeSourceManager mManager;

    private String mShape;

    private Boolean mCluster;
    private Integer mClusterRadius;
    private Integer mClusterMaxZoom;
    private List<Map.Entry<String, ClusterPropertyEntry>> mClusterProperties;

    private Integer mMaxZoom;
    private Integer mBuffer;
    private Double mTolerance;
    private Boolean mLineMetrics;

    private static Bitmap mImagePlaceholder;
    private List<Map.Entry<String, ImageEntry>> mImages;
    private List<Map.Entry<String, BitmapDrawable>> mNativeImages;

    public MLRNShapeSource(Context context, MLRNShapeSourceManager manager) {
        super(context);
        mManager = manager;
    }

    @Override
    public void addToMap(final MLRNMapView mapView) {
        // Wait for style before adding the source to the map
        mapView.getMapboxMap().getStyle(new Style.OnStyleLoaded() {
            @Override
            public void onStyleLoaded(@NonNull Style style) {
                MapLibreMap map = mapView.getMapboxMap();
                MLRNShapeSource.super.addToMap(mapView);
            }
        });
    }

    @Override
    public GeoJsonSource makeSource() {
        GeoJsonOptions options = getOptions();

        if (mShape != null) {
            return new GeoJsonSource(mID, mShape, options);
        }

        return new GeoJsonSource(mID, mURL, options);
    }

    public void setURL(URL url) {
        mURL = url;

        if (mSource != null && mMapView != null && !mMapView.isDestroyed() ) {
            mSource.setUrl(mURL);
        }
    }

    public void setShape(String geoJSONStr) {
        mShape = geoJSONStr;

        if (mSource != null && mMapView != null && !mMapView.isDestroyed() ) {
            mSource.setGeoJson(mShape);
        }
    }

    public void setCluster(boolean cluster) {
        mCluster = cluster;
    }

    public void setClusterRadius(int clusterRadius) {
        mClusterRadius = clusterRadius;
    }

    public void setClusterMaxZoom(int clusterMaxZoom) {
        mClusterMaxZoom = clusterMaxZoom;
    }

    public void setClusterProperties(List<Map.Entry<String, ClusterPropertyEntry>> clusterProperties) {
        mClusterProperties = clusterProperties;
    }

    public void setMaxZoom(int maxZoom) {
        mMaxZoom = maxZoom;
    }

    public void setBuffer(int buffer) {
        mBuffer = buffer;
    }

    public void setTolerance(double tolerance) {
        mTolerance = tolerance;
    }

    public void setLineMetrics(boolean lineMetrics) {
        mLineMetrics = lineMetrics;
    }

    public void onPress(OnPressEvent event) {
        mManager.handleEvent(FeatureClickEvent.makeShapeSourceEvent(this, event));
    }

    private GeoJsonOptions getOptions() {
        GeoJsonOptions options = new GeoJsonOptions();

        if (mCluster != null) {
            options.withCluster(mCluster);
        }

        if (mClusterRadius != null) {
            options.withClusterRadius(mClusterRadius);
        }

        if (mClusterMaxZoom != null) {
            options.withClusterMaxZoom(mClusterMaxZoom);
        }

        if (mClusterProperties != null) {
            for (Map.Entry<String, ClusterPropertyEntry> entry : mClusterProperties) {
                ClusterPropertyEntry property = entry.getValue();

                options.withClusterProperty(entry.getKey(), property.operator, property.mapping);
            }
        }

        if (mMaxZoom != null) {
            options.withMaxZoom(mMaxZoom);
        }

        if (mBuffer != null) {
            options.withBuffer(mBuffer);
        }

        if (mTolerance != null) {
            options.withTolerance(mTolerance.floatValue());
        }

        if (mLineMetrics != null) {
            options.withLineMetrics(mLineMetrics);
        }

        return options;
    }

    public void querySourceFeatures(String callbackID,
                                    @Nullable Expression filter) {
        if (mSource == null) {
            WritableMap payload = new WritableNativeMap();
            payload.putString("error", "source is not yet loaded");
            AndroidCallbackEvent event = new AndroidCallbackEvent(this, callbackID, payload);
            mManager.handleEvent(event);
            return;
        }
        List<Feature> features = mSource.querySourceFeatures(filter);
        WritableMap payload = new WritableNativeMap();
        payload.putString("data", FeatureCollection.fromFeatures(features).toJson());

        AndroidCallbackEvent event = new AndroidCallbackEvent(this, callbackID, payload);
        mManager.handleEvent(event);
    }

    public void getClusterExpansionZoom(String callbackID, String featureJSON) {
        if (mSource == null) {
            WritableMap payload = new WritableNativeMap();
            payload.putString("error", "source is not yet loaded");
            AndroidCallbackEvent event = new AndroidCallbackEvent(this, callbackID, payload);
            mManager.handleEvent(event);
            return;
        }
        Feature feature = Feature.fromJson(featureJSON);
   
        int zoom = mSource.getClusterExpansionZoom(feature);

        WritableMap payload = new WritableNativeMap();
        payload.putInt("data", zoom);

        AndroidCallbackEvent event = new AndroidCallbackEvent(this, callbackID, payload);
        mManager.handleEvent(event);
    }

    public void getClusterLeaves(String callbackID, String featureJSON, int number, int offset) {
        if (mSource == null) {
            WritableMap payload = new WritableNativeMap();
            payload.putString("error", "source is not yet loaded");
            AndroidCallbackEvent event = new AndroidCallbackEvent(this, callbackID, payload);
            mManager.handleEvent(event);
            return;
        }
        Feature clusterFeature = Feature.fromJson(featureJSON);
        FeatureCollection leaves = mSource.getClusterLeaves(clusterFeature, number, offset);
        WritableMap payload = new WritableNativeMap();
        payload.putString("data", leaves.toJson());

        AndroidCallbackEvent event = new AndroidCallbackEvent(this, callbackID, payload);
        mManager.handleEvent(event);
    }

    public void getClusterChildren(String callbackID, String featureJSON) {
        if (mSource == null) {
            WritableMap payload = new WritableNativeMap();
            payload.putString("error", "source is not yet loaded");
            AndroidCallbackEvent event = new AndroidCallbackEvent(this, callbackID, payload);
            mManager.handleEvent(event);
            return;
        }
        Feature clusterFeature = Feature.fromJson(featureJSON);
        FeatureCollection leaves = mSource.getClusterChildren(clusterFeature);
        WritableMap payload = new WritableNativeMap();
        payload.putString("data", leaves.toJson());

        AndroidCallbackEvent event = new AndroidCallbackEvent(this, callbackID, payload);
        mManager.handleEvent(event);
    }
}
