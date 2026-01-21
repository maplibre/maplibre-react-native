package org.maplibre.reactnative.components.layers.types.raster;

import android.content.Context;

import org.maplibre.android.style.layers.RasterLayer;
import org.maplibre.reactnative.components.layers.MLRNLayer;
import org.maplibre.reactnative.components.layers.style.MLRNStyle;
import org.maplibre.reactnative.components.layers.style.MLRNStyleFactory;

public class MLRNRasterLayer extends MLRNLayer<RasterLayer> {
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
