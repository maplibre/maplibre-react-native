package org.maplibre.reactnative.components.layers.types.symbol

import android.content.Context
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.layers.SymbolLayer
import org.maplibre.reactnative.components.layers.MLRNLayer
import org.maplibre.reactnative.components.layers.style.MLRNStyle
import org.maplibre.reactnative.components.layers.style.MLRNStyleFactory
import org.maplibre.reactnative.components.mapview.MLRNMapView

class MLRNSymbolLayer(context: Context?) : MLRNLayer<SymbolLayer?>(context) {
    private var mSourceLayerID: String? = null

    override fun updateFilter(expression: Expression) {
        mLayer!!.setFilter(expression)
    }

    override fun addToMap(mapView: MLRNMapView) {
        super.addToMap(mapView)
    }

    override fun makeLayer(): SymbolLayer {
        val layer = SymbolLayer(mID, mSourceID)

        if (mSourceLayerID != null) {
            layer.setSourceLayer(mSourceLayerID)
        }

        return layer
    }

    override fun addStyles() {
        MLRNStyleFactory.setSymbolLayerStyle(mLayer, MLRNStyle(getContext(), mReactStyle, mMap))
    }

    fun setSourceLayerID(sourceLayerID: String?) {
        mSourceLayerID = sourceLayerID

        if (mLayer != null) {
            mLayer!!.setSourceLayer(sourceLayerID)
        }
    }
}
