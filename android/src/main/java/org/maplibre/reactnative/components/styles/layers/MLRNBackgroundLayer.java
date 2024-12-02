package org.maplibre.reactnative.components.styles.layers;

import android.content.Context;

import org.maplibre.android.style.layers.BackgroundLayer;
import org.maplibre.reactnative.components.styles.MLRNStyle;
import org.maplibre.reactnative.components.styles.MLRNStyleFactory;

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
