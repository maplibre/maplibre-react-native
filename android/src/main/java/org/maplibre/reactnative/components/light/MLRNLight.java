package org.maplibre.reactnative.components.light;

import android.content.Context;

import com.facebook.react.bridge.ReadableMap;
import org.maplibre.android.maps.MapLibreMap;
import org.maplibre.android.maps.Style;
import org.maplibre.android.style.light.Light;
import org.maplibre.reactnative.components.AbstractMapFeature;
import org.maplibre.reactnative.components.mapview.MLRNMapView;
import org.maplibre.reactnative.components.layers.style.MLRNStyle;
import org.maplibre.reactnative.components.layers.style.MLRNStyleFactory;

public class MLRNLight extends AbstractMapFeature {
    private MapLibreMap mMap;
    private ReadableMap mReactStyle;

    public MLRNLight(Context context) {
        super(context);
    }

    @Override
    public void addToMap(MLRNMapView mapView) {
        mMap = mapView.getMapLibreMap();
        setLight();
    }

    @Override
    public void removeFromMap(MLRNMapView mapView) {
        // ignore there's nothing to remove just update the light style
    }

    public void setReactStyle(ReadableMap reactStyle) {
        mReactStyle = reactStyle;

        setLight();
    }

    private void setLight(Light light) {
        MLRNStyleFactory.setLightLayerStyle(light, new MLRNStyle(getContext(), mReactStyle, mMap));
    }

    private void setLight() {
        Style style = getStyle();
        if (style != null) {
            setLight(style.getLight());
        }
    }

    private Style getStyle() {
        if (mMap == null) {
            return null;
        }
        return mMap.getStyle();
    }
}
