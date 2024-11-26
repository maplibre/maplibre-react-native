package org.maplibre.mlrn.components.styles.light;

import android.content.Context;

import com.facebook.react.bridge.ReadableMap;
import org.maplibre.android.maps.MapLibreMap;
import org.maplibre.android.maps.Style;
import org.maplibre.android.style.layers.TransitionOptions;
import org.maplibre.android.style.light.Light;
import org.maplibre.android.style.light.Position;
import org.maplibre.mlrn.components.AbstractMapFeature;
import org.maplibre.mlrn.components.mapview.MLRNMapView;
import org.maplibre.mlrn.components.styles.MLRNStyle;
import org.maplibre.mlrn.components.styles.MLRNStyleFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by nickitaliano on 9/26/17.
 */

public class MLRNLight extends AbstractMapFeature {
    private MapLibreMap mMap;
    private ReadableMap mReactStyle;

    public MLRNLight(Context context) {
        super(context);
    }

    @Override
    public void addToMap(MLRNMapView mapView) {
        mMap = mapView.getMapboxMap();
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
