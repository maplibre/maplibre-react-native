package org.maplibre.reactnative.components.styles.sources;

import android.content.Context;
import android.view.View;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.imagehelper.ImageSource;
import org.maplibre.android.geometry.LatLngQuad;
import org.maplibre.reactnative.utils.ConvertUtils;
import org.maplibre.reactnative.utils.GeoJSONUtils;

public class MLRNImageSourceManager extends ViewGroupManager<MLRNImageSource> {
    public static final String REACT_CLASS = "MLRNImageSource";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MLRNImageSource createViewInstance(ThemedReactContext reactContext) {
        return new MLRNImageSource(reactContext);
    }

    @Override
    public View getChildAt(MLRNImageSource source, int childPosition) {
        return source.getLayerAt(childPosition);
    }

    @Override
    public int getChildCount(MLRNImageSource source) {
        return source.getLayerCount();
    }

    @Override
    public void addView(MLRNImageSource source, View childView, int childPosition) {
        source.addLayer(childView, childPosition);
    }

    @Override
    public void removeViewAt(MLRNImageSource source, int childPosition) {
        source.removeLayer(childPosition);
    }

    @ReactProp(name = "id")
    public void setId(MLRNImageSource source, String id) {
        source.setID(id);
    }

    @ReactProp(name = "url")
    public void setUrl(MLRNImageSource source, String url) {
        source.setURL(url);
    }

    @ReactProp(name = "coordinates")
    public void setCoordinates(MLRNImageSource source, ReadableArray arr) {
        LatLngQuad quad = GeoJSONUtils.toLatLngQuad(arr);

        if (quad == null) {
            return;
        }

        source.setCoordinates(quad);
    }
}
