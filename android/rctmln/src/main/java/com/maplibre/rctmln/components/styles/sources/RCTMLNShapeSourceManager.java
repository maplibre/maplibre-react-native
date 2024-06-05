package com.maplibre.rctmln.components.styles.sources;

import android.content.Context;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.media.Image;
import android.util.Log;
import android.view.View;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.mapbox.mapboxsdk.style.expressions.Expression;
import com.maplibre.rctmln.components.AbstractEventEmitter;
import com.maplibre.rctmln.components.annotation.RCTMLNCallout;
import com.maplibre.rctmln.components.mapview.RCTMLNMapView;
import com.maplibre.rctmln.components.styles.layers.RCTLayer;
import com.maplibre.rctmln.events.constants.EventKeys;
import com.maplibre.rctmln.utils.ClusterPropertyEntry;
import com.maplibre.rctmln.utils.ExpressionParser;
import com.maplibre.rctmln.utils.ImageEntry;
import com.maplibre.rctmln.utils.ResourceUtils;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by nickitaliano on 9/19/17.
 */

public class RCTMLNShapeSourceManager extends AbstractEventEmitter<RCTMLNShapeSource> {
    public static final String LOG_TAG = "RCTMLNShapeSourceManager";
    public static final String REACT_CLASS = "RCTMLNShapeSource";

    private ReactApplicationContext mContext;

    public RCTMLNShapeSourceManager(ReactApplicationContext context) {
        super(context);
        mContext = context;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RCTMLNShapeSource createViewInstance(ThemedReactContext reactContext) {
        return new RCTMLNShapeSource(reactContext, this);
    }

    @Override
    public View getChildAt(RCTMLNShapeSource source, int childPosition) {
        return source.getLayerAt(childPosition);
    }

    @Override
    public int getChildCount(RCTMLNShapeSource source) {
        return source.getLayerCount();
    }

    @Override
    public void addView(RCTMLNShapeSource source, View childView, int childPosition) {
        source.addLayer(childView, getChildCount(source));
    }

    @Override
    public void removeViewAt(RCTMLNShapeSource source, int childPosition) {
        source.removeLayer(childPosition);
    }

    @ReactProp(name = "id")
    public void setId(RCTMLNShapeSource source, String id) {
        source.setID(id);
    }

    @ReactProp(name = "url")
    public void setURL(RCTMLNShapeSource source, String urlStr) {
        try {
            source.setURL(new URL(urlStr));
        } catch (MalformedURLException e) {
            Log.w(LOG_TAG, e.getLocalizedMessage());
        }
    }

    @ReactProp(name = "shape")
    public void setGeometry(RCTMLNShapeSource source, String geoJSONStr) {
        source.setShape(geoJSONStr);
    }

    @ReactProp(name = "cluster")
    public void setCluster(RCTMLNShapeSource source, int cluster) {
        source.setCluster(cluster == 1);
    }

    @ReactProp(name = "clusterRadius")
    public void setClusterRadius(RCTMLNShapeSource source, int radius) {
        source.setClusterRadius(radius);
    }

    @ReactProp(name = "clusterMaxZoomLevel")
    public void setClusterMaxZoomLevel(RCTMLNShapeSource source, int clusterMaxZoom) {
        source.setClusterMaxZoom(clusterMaxZoom);
    }

    @ReactProp(name = "clusterProperties")
    public void setClusterProperties(RCTMLNShapeSource source, ReadableMap map) {
        List<Map.Entry<String, ClusterPropertyEntry>> properties = new ArrayList<>();

        ReadableMapKeySetIterator iterator = map.keySetIterator();
        while (iterator.hasNextKey()) {
            String name = iterator.nextKey();
            ReadableArray expressions = map.getArray(name);

            Expression operator;
            if (expressions.getType(0) == ReadableType.Array) {
                operator = ExpressionParser.from(expressions.getArray(0));
            } else {
                operator = Expression.literal(expressions.getString(0));
            }

            Expression mapping = ExpressionParser.from(expressions.getArray(1));

            properties.add(new AbstractMap.SimpleEntry<>(name, new ClusterPropertyEntry(operator, mapping)));
        }

        source.setClusterProperties(properties);
    }

    @ReactProp(name = "maxZoomLevel")
    public void setMaxZoomLevel(RCTMLNShapeSource source, int maxZoom) {
        source.setMaxZoom(maxZoom);
    }

    @ReactProp(name = "buffer")
    public void setBuffer(RCTMLNShapeSource source, int buffer) {
        source.setBuffer(buffer);
    }

    @ReactProp(name = "tolerance")
    public void setTolerance(RCTMLNShapeSource source, double tolerance) {
        source.setTolerance(tolerance);
    }

    @ReactProp(name = "lineMetrics")
    public void setLineMetrics(RCTMLNShapeSource source, boolean lineMetrics) {
        source.setLineMetrics(lineMetrics);
    }

    @ReactProp(name = "hasPressListener")
    public void setHasPressListener(RCTMLNShapeSource source, boolean hasPressListener) {
        source.setHasPressListener(hasPressListener);
    }

    @ReactProp(name="hitbox")
    public void setHitbox(RCTMLNShapeSource source, ReadableMap map) {
        source.setHitbox(map);
    }

    @Override
    public Map<String, String> customEvents() {
        return MapBuilder.<String, String>builder()
                .put(EventKeys.SHAPE_SOURCE_LAYER_CLICK, "onMapboxShapeSourcePress")
                .put(EventKeys.MAP_ANDROID_CALLBACK, "onAndroidCallback")
                .build();
    }

    //region React Methods
    public static final int METHOD_FEATURES = 103;
    public static final int METHOD_GET_CLUSTER_EXPANSION_ZOOM = 104;
    public static final int METHOD_GET_CLUSTER_LEAVES = 105;
    public static final int METHOD_GET_CLUSTER_CHILDREN = 106;

    // Deprecated. Will be removed in 9+ ver.
    public static final int METHOD_GET_CLUSTER_EXPANSION_ZOOM_BY_ID = 107;
    public static final int METHOD_GET_CLUSTER_LEAVES_BY_ID = 108;
    public static final int METHOD_GET_CLUSTER_CHILDREN_BY_ID = 109;

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.<String, Integer>builder()
                .put("features", METHOD_FEATURES)
                .put("getClusterExpansionZoom", METHOD_GET_CLUSTER_EXPANSION_ZOOM)
                .put("getClusterLeaves", METHOD_GET_CLUSTER_LEAVES)
                .put("getClusterChildren", METHOD_GET_CLUSTER_CHILDREN)

                // Deprecated. Will be removed in 9+ ver.
                .put("getClusterExpansionZoomById", METHOD_GET_CLUSTER_EXPANSION_ZOOM_BY_ID)
                .put("getClusterLeavesById", METHOD_GET_CLUSTER_LEAVES_BY_ID)
                .put("getClusterChildrenById", METHOD_GET_CLUSTER_CHILDREN_BY_ID)
               
                .build();
    }

    @Override
    public void receiveCommand(RCTMLNShapeSource source, int commandID, @Nullable ReadableArray args) {
        switch (commandID) {
            case METHOD_FEATURES:
                source.querySourceFeatures(
                        args.getString(0),
                        ExpressionParser.from(args.getArray(1))
                );
                break;
            case METHOD_GET_CLUSTER_EXPANSION_ZOOM:
                source.getClusterExpansionZoom(args.getString(0), args.getString(1));
                break;
            case METHOD_GET_CLUSTER_LEAVES:
                source.getClusterLeaves(
                        args.getString(0),
                        args.getString(1),
                        args.getInt(2),
                        args.getInt((3))
                );
                break;
            case METHOD_GET_CLUSTER_CHILDREN:
                source.getClusterChildren(
                        args.getString(0),
                        args.getString(1)                        
                );
                break;
            case METHOD_GET_CLUSTER_EXPANSION_ZOOM_BY_ID:
                source.getClusterExpansionZoomById(args.getString(0), args.getInt(1));
                break;
            case METHOD_GET_CLUSTER_LEAVES_BY_ID:
                source.getClusterLeavesById(
                        args.getString(0),
                        args.getInt(1),
                        args.getInt(2),
                        args.getInt((3))
                );
                break;
            case METHOD_GET_CLUSTER_CHILDREN_BY_ID:
                source.getClusterChildrenById(
                        args.getString(0),
                        args.getInt(1)                        
                );
                break;
        }
    }
}
