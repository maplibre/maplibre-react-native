package org.maplibre.reactnative.components.layers.types.fillextrusion

import android.content.Context
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.layers.FillExtrusionLayer
import org.maplibre.reactnative.components.layers.MLRNLayer
import org.maplibre.reactnative.components.layers.style.MLRNStyle
import org.maplibre.reactnative.components.layers.style.MLRNStyleFactory
import org.maplibre.reactnative.components.mapview.MLRNMapView

class MLRNFillExtrusionLayer(context: Context?) : MLRNLayer<FillExtrusionLayer?>(context) {
    private var mSourceLayerID: String? = null

    override fun updateFilter(expression: Expression) {
        mLayer!!.setFilter(expression)
    }

    override fun addToMap(mapView: MLRNMapView) {
        super.addToMap(mapView)
    }

    override fun makeLayer(): FillExtrusionLayer {
        val layer = FillExtrusionLayer(mID, mSourceID)

        if (mSourceLayerID != null) {
            layer.setSourceLayer(mSourceLayerID)
        }

        return layer
    }

    override fun addStyles() {
        MLRNStyleFactory.setFillExtrusionLayerStyle(
            mLayer,
            MLRNStyle(getContext(), mReactStyle, mMap)
        )
    }

    fun setSourceLayerID(sourceLayerID: String?) {
        mSourceLayerID = sourceLayerID

        if (mLayer != null) {
            mLayer!!.setSourceLayer(mSourceLayerID)
        }
    }
}
