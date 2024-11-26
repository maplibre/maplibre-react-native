package org.maplibre.mlrn.components.styles.layers;

import android.content.Context;

import org.maplibre.android.style.layers.RasterLayer;
import org.maplibre.mlrn.components.styles.MLRNStyle;
import org.maplibre.mlrn.components.styles.MLRNStyleFactory;

/**
 * Created by nickitaliano on 9/25/17.
 */

public class MLRNRasterLayer extends RCTLayer<RasterLayer> {
    public MLRNRasterLayer(Context context) {
        super(context);
    }

    @Override
    public RasterLayer makeLayer() {
        return new RasterLayer(mID, mSourceID);
    }

    @Override
    public void addStyles() {
        MLRNStyleFactory.setRasterLayerStyle(mLayer, new MLRNStyle(getContext(), mReactStyle, mMap));
    }
}
