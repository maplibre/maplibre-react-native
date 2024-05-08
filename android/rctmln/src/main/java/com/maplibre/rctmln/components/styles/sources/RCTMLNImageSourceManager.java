package com.maplibre.rctmln.components.styles.sources;

import android.content.Context;
import android.view.View;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.imagehelper.ImageSource;
import com.mapbox.mapboxsdk.geometry.LatLngQuad;
import com.maplibre.rctmln.utils.ConvertUtils;
import com.maplibre.rctmln.utils.GeoJSONUtils;

/**
 * Created by nickitaliano on 11/29/17.
 */

public class RCTMLNImageSourceManager extends ViewGroupManager<RCTMLNImageSource> {
    public static final String REACT_CLASS = "RCTMLNImageSource";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RCTMLNImageSource createViewInstance(ThemedReactContext reactContext) {
        return new RCTMLNImageSource(reactContext);
    }

    @Override
    public View getChildAt(RCTMLNImageSource source, int childPosition) {
        return source.getLayerAt(childPosition);
    }

    @Override
    public int getChildCount(RCTMLNImageSource source) {
        return source.getLayerCount();
    }

    @Override
    public void addView(RCTMLNImageSource source, View childView, int childPosition) {
        source.addLayer(childView, childPosition);
    }

    @Override
    public void removeViewAt(RCTMLNImageSource source, int childPosition) {
        source.removeLayer(childPosition);
    }

    @ReactProp(name = "id")
    public void setId(RCTMLNImageSource source, String id) {
        source.setID(id);
    }

    @ReactProp(name = "url")
    public void setUrl(RCTMLNImageSource source, String url) {
        source.setURL(url);
    }

    @ReactProp(name = "coordinates")
    public void setCoordinates(RCTMLNImageSource source, ReadableArray arr) {
        LatLngQuad quad = GeoJSONUtils.toLatLngQuad(arr);

        if (quad == null) {
            return;
        }

        source.setCoordinates(quad);
    }
}
