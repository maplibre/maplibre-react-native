package org.maplibre.reactnative.components.layers.types.background;

import android.content.Context;

import org.maplibre.android.style.layers.BackgroundLayer;
import org.maplibre.reactnative.components.layers.MLRNLayer;
import org.maplibre.reactnative.components.layers.style.MLRNStyle;
import org.maplibre.reactnative.components.layers.style.MLRNStyleFactory;

public class MLRNBackgroundLayer extends MLRNLayer<BackgroundLayer> {
    public MLRNBackgroundLayer(Context context) {
        super(context);
    }

    @Override
    public BackgroundLayer makeLayer() {
        return new BackgroundLayer(mID);
    }

    @Override
    public void addStyles() {
        MLRNStyleFactory.setBackgroundLayerStyle(mLayer, new MLRNStyle(getContext(), mReactStyle, mMap));
    }
}
