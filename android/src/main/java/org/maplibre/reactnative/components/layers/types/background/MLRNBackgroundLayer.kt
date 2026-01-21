package org.maplibre.reactnative.components.layers.types.background

import android.content.Context
import org.maplibre.android.style.layers.BackgroundLayer
import org.maplibre.reactnative.components.layers.MLRNLayer
import org.maplibre.reactnative.components.layers.style.MLRNStyle
import org.maplibre.reactnative.components.layers.style.MLRNStyleFactory

class MLRNBackgroundLayer(context: Context?) : MLRNLayer<BackgroundLayer?>(context) {
    override fun makeLayer(): BackgroundLayer {
        return BackgroundLayer(mID)
    }

    override fun addStyles() {
        MLRNStyleFactory.setBackgroundLayerStyle(mLayer, MLRNStyle(getContext(), mReactStyle, mMap))
    }
}
