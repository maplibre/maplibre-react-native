package org.maplibre.reactnative.components.layers.types.circle

import android.content.Context
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.layers.CircleLayer
import org.maplibre.reactnative.components.layers.MLRNLayer
import org.maplibre.reactnative.components.layers.style.MLRNStyle
import org.maplibre.reactnative.components.layers.style.MLRNStyleFactory
import org.maplibre.reactnative.components.mapview.MLRNMapView

class MLRNCircleLayer(context: Context?) : MLRNLayer<CircleLayer?>(context) {
    private var mSourceLayerID: String? = null

    override fun updateFilter(expression: Expression) {
        mLayer!!.setFilter(expression)
    }

    override fun addToMap(mapView: MLRNMapView) {
        super.addToMap(mapView)
    }

    override fun makeLayer(): CircleLayer {
        val layer = CircleLayer(mID, mSourceID)

        if (mSourceLayerID != null) {
            layer.setSourceLayer(mSourceLayerID)
        }

        return layer
    }

    override fun addStyles() {
        MLRNStyleFactory.setCircleLayerStyle(mLayer, MLRNStyle(getContext(), mReactStyle, mMap))
    }

    fun setSourceLayerID(sourceLayerID: String?) {
        mSourceLayerID = sourceLayerID

        if (mLayer != null) {
            mLayer!!.setSourceLayer(sourceLayerID)
        }
    }
}
