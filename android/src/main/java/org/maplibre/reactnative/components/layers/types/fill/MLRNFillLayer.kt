package org.maplibre.reactnative.components.layers.types.fill

import android.content.Context
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.layers.FillLayer
import org.maplibre.reactnative.components.layers.MLRNLayer
import org.maplibre.reactnative.components.layers.style.MLRNStyle
import org.maplibre.reactnative.components.layers.style.MLRNStyleFactory
import org.maplibre.reactnative.components.mapview.MLRNMapView

class MLRNFillLayer(context: Context?) : MLRNLayer<FillLayer?>(context) {
    private var mSourceLayerID: String? = null

    override fun updateFilter(expression: Expression) {
        mLayer!!.setFilter(expression)
    }

    override fun addToMap(mapView: MLRNMapView) {
        super.addToMap(mapView)
    }

    override fun makeLayer(): FillLayer {
        val layer = FillLayer(mID, mSourceID)

        if (mSourceLayerID != null) {
            layer.setSourceLayer(mSourceLayerID)
        }

        return layer
    }

    override fun addStyles() {
        MLRNStyleFactory.setFillLayerStyle(mLayer, MLRNStyle(getContext(), mReactStyle, mMap))
    }

    fun setSourceLayerID(sourceLayerID: String?) {
        mSourceLayerID = sourceLayerID

        if (mLayer != null) {
            mLayer!!.setSourceLayer(mSourceLayerID)
        }
    }
}
