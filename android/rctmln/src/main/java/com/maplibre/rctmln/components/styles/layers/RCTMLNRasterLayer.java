package com.maplibre.rctmln.components.styles.layers;

import android.content.Context;

import com.mapbox.mapboxsdk.style.layers.RasterLayer;
import com.maplibre.rctmln.components.styles.RCTMLNStyle;
import com.maplibre.rctmln.components.styles.RCTMLNStyleFactory;

/**
 * Created by nickitaliano on 9/25/17.
 */

public class RCTMLNRasterLayer extends RCTLayer<RasterLayer> {
    public RCTMLNRasterLayer(Context context) {
        super(context);
    }

    @Override
    public RasterLayer makeLayer() {
        return new RasterLayer(mID, mSourceID);
    }

    @Override
    public void addStyles() {
        RCTMLNStyleFactory.setRasterLayerStyle(mLayer, new RCTMLNStyle(getContext(), mReactStyle, mMap));
    }
}
