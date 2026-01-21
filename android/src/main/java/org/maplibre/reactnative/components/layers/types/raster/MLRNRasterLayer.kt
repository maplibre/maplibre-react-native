package org.maplibre.reactnative.components.layers.types.raster

import android.content.Context
import org.maplibre.android.style.layers.RasterLayer
import org.maplibre.reactnative.components.layers.MLRNLayer
import org.maplibre.reactnative.components.layers.style.MLRNStyle
import org.maplibre.reactnative.components.layers.style.MLRNStyleFactory

class MLRNRasterLayer(context: Context?) : MLRNLayer<RasterLayer?>(context) {
    override fun makeLayer(): RasterLayer {
        return RasterLayer(mID, mSourceID)
    }

    override fun addStyles() {
        MLRNStyleFactory.setRasterLayerStyle(mLayer, MLRNStyle(getContext(), mReactStyle, mMap))
    }
}
