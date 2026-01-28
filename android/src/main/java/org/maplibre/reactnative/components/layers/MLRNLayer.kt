package org.maplibre.reactnative.components.layers

import android.content.Context
import com.facebook.common.logging.FLog
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import org.maplibre.android.location.LocationComponentConstants
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.Style
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.layers.BackgroundLayer
import org.maplibre.android.style.layers.CircleLayer
import org.maplibre.android.style.layers.FillExtrusionLayer
import org.maplibre.android.style.layers.FillLayer
import org.maplibre.android.style.layers.HeatmapLayer
import org.maplibre.android.style.layers.Layer
import org.maplibre.android.style.layers.LineLayer
import org.maplibre.android.style.layers.Property
import org.maplibre.android.style.layers.PropertyFactory
import org.maplibre.android.style.layers.RasterLayer
import org.maplibre.android.style.layers.SymbolLayer
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.layers.style.MLRNStyle
import org.maplibre.reactnative.components.layers.style.MLRNStyleFactory
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.components.mapview.MLRNMapView.FoundLayerCallback
import org.maplibre.reactnative.utils.ExpressionParser.from

class MLRNLayer(context: Context?) : AbstractMapFeature(context) {
    private var mID: String? = null
    private var mSourceID: String? = null
    private var mAboveLayerID: String? = null
    private var mBelowLayerID: String? = null
    private var mLayerIndex: Int? = null
    private var mVisible: Boolean = false
    private var mMinZoomLevel: Double? = null
    private var mMaxZoomLevel: Double? = null
    private var mReactStyle: ReadableMap? = null
    private var mFilter: Expression? = null
    private var mHadFilter: Boolean = false

    private var mLayerType: String? = null
    private var mSourceLayerID: String? = null

    private var mMap: MapLibreMap? = null
    private var mLayer: Layer? = null
    private var mMapView: MLRNMapView? = null

    var iD: String
        get() = mID!!
        set(id) {
            mID = id
        }

    fun setSourceID(sourceID: String?) {
        mSourceID = sourceID
    }

    fun setLayerType(layerType: String?) {
        mLayerType = layerType
    }

    fun setSourceLayerID(sourceLayerID: String?) {
        mSourceLayerID = sourceLayerID
        if (mLayer != null) {
            applySourceLayer()
        }
    }

    fun setAboveLayerID(aboveLayerID: String?) {
        if (mAboveLayerID != null && mAboveLayerID == aboveLayerID) {
            return
        }
        mAboveLayerID = aboveLayerID
        if (mLayer != null) {
            removeFromMap(mMapView!!)
            addAbove(mAboveLayerID!!)
        }
    }

    fun setBelowLayerID(belowLayerID: String?) {
        if (mBelowLayerID != null && mBelowLayerID == belowLayerID) {
            return
        }
        mBelowLayerID = belowLayerID
        if (mLayer != null) {
            removeFromMap(mMapView!!)
            addBelow(mBelowLayerID!!)
        }
    }

    fun setLayerIndex(layerIndex: Int) {
        if (mLayerIndex != null && mLayerIndex == layerIndex) {
            return
        }
        mLayerIndex = layerIndex
        if (mLayer != null) {
            removeFromMap(mMapView!!)
            addAtIndex(mLayerIndex!!)
        }
    }

    fun setVisible(visible: Boolean) {
        mVisible = visible
        if (mLayer != null) {
            val visibility = if (mVisible) Property.VISIBLE else Property.NONE
            mLayer!!.setProperties(PropertyFactory.visibility(visibility))
        }
    }

    fun setMinZoomLevel(minZoomLevel: Double) {
        mMinZoomLevel = minZoomLevel
        if (mLayer != null) {
            mLayer!!.setMinZoom(minZoomLevel.toFloat())
        }
    }

    fun setMaxZoomLevel(maxZoomLevel: Double) {
        mMaxZoomLevel = maxZoomLevel
        if (mLayer != null) {
            mLayer!!.setMaxZoom(maxZoomLevel.toFloat())
        }
    }

    fun setReactStyle(reactStyle: ReadableMap?) {
        mReactStyle = reactStyle
        if (mLayer != null) {
            addStyles()
        }
    }

    fun setFilter(readableFilterArray: ReadableArray?) {
        val filterExpression = from(readableFilterArray)
        mFilter = filterExpression
        if (mLayer != null) {
            if (mFilter != null) {
                mHadFilter = true
                updateFilter(mFilter)
            } else if (mHadFilter) {
                updateFilter(Expression.literal(true))
            }
        }
    }

    private fun makeLayer(): Layer? {
        return when (mLayerType) {
            "fill" -> {
                val layer = FillLayer(mID, mSourceID)
                if (mSourceLayerID != null) layer.setSourceLayer(mSourceLayerID)
                layer
            }
            "line" -> {
                val layer = LineLayer(mID, mSourceID)
                if (mSourceLayerID != null) layer.setSourceLayer(mSourceLayerID)
                layer
            }
            "symbol" -> {
                val layer = SymbolLayer(mID, mSourceID)
                if (mSourceLayerID != null) layer.setSourceLayer(mSourceLayerID)
                layer
            }
            "circle" -> {
                val layer = CircleLayer(mID, mSourceID)
                if (mSourceLayerID != null) layer.setSourceLayer(mSourceLayerID)
                layer
            }
            "heatmap" -> {
                val layer = HeatmapLayer(mID, mSourceID)
                if (mSourceLayerID != null) layer.setSourceLayer(mSourceLayerID)
                layer
            }
            "fill-extrusion" -> {
                val layer = FillExtrusionLayer(mID, mSourceID)
                if (mSourceLayerID != null) layer.setSourceLayer(mSourceLayerID)
                layer
            }
            "raster" -> RasterLayer(mID, mSourceID)
            "background" -> BackgroundLayer(mID)
            else -> {
                FLog.e(LOG_TAG, "Unknown layer type: $mLayerType")
                null
            }
        }
    }

    private fun addStyles() {
        val style = MLRNStyle(context, mReactStyle, mMap)
        when (mLayer) {
            is FillLayer -> MLRNStyleFactory.setFillLayerStyle(mLayer as FillLayer?, style)
            is LineLayer -> MLRNStyleFactory.setLineLayerStyle(mLayer as LineLayer?, style)
            is SymbolLayer -> MLRNStyleFactory.setSymbolLayerStyle(mLayer as SymbolLayer?, style)
            is CircleLayer -> MLRNStyleFactory.setCircleLayerStyle(mLayer as CircleLayer?, style)
            is HeatmapLayer -> MLRNStyleFactory.setHeatmapLayerStyle(mLayer as HeatmapLayer?, style)
            is FillExtrusionLayer -> MLRNStyleFactory.setFillExtrusionLayerStyle(mLayer as FillExtrusionLayer?, style)
            is RasterLayer -> MLRNStyleFactory.setRasterLayerStyle(mLayer as RasterLayer?, style)
            is BackgroundLayer -> MLRNStyleFactory.setBackgroundLayerStyle(mLayer as BackgroundLayer?, style)
        }
    }

    private fun updateFilter(expression: Expression?) {
        when (mLayer) {
            is FillLayer -> (mLayer as FillLayer).setFilter(expression!!)
            is LineLayer -> (mLayer as LineLayer).setFilter(expression!!)
            is SymbolLayer -> (mLayer as SymbolLayer).setFilter(expression!!)
            is CircleLayer -> (mLayer as CircleLayer).setFilter(expression!!)
            is HeatmapLayer -> (mLayer as HeatmapLayer).setFilter(expression!!)
            is FillExtrusionLayer -> (mLayer as FillExtrusionLayer).setFilter(expression!!)
        }
    }

    private fun applySourceLayer() {
        when (mLayer) {
            is FillLayer -> (mLayer as FillLayer).setSourceLayer(mSourceLayerID)
            is LineLayer -> (mLayer as LineLayer).setSourceLayer(mSourceLayerID)
            is SymbolLayer -> (mLayer as SymbolLayer).setSourceLayer(mSourceLayerID)
            is CircleLayer -> (mLayer as CircleLayer).setSourceLayer(mSourceLayerID)
            is HeatmapLayer -> (mLayer as HeatmapLayer).setSourceLayer(mSourceLayerID)
            is FillExtrusionLayer -> (mLayer as FillExtrusionLayer).setSourceLayer(mSourceLayerID)
        }
    }

    private fun add() {
        if (!hasInitialized()) return
        val style = this.style ?: return

        val userBackgroundID = LocationComponentConstants.BACKGROUND_LAYER
        val userLocationBackgroundLayer = style.getLayer(userBackgroundID)

        if (userLocationBackgroundLayer != null) {
            style.addLayerBelow(mLayer, userBackgroundID)
            mMapView!!.layerAdded(mLayer!!)
            return
        }

        style.addLayer(mLayer)
        mMapView!!.layerAdded(mLayer!!)
    }

    private fun addAbove(aboveLayerID: String) {
        mMapView!!.waitForLayer(aboveLayerID, object : FoundLayerCallback {
            override fun found(layer: Layer?) {
                if (!hasInitialized()) return
                val style = this@MLRNLayer.style ?: return
                style.addLayerAbove(mLayer, aboveLayerID)
                mMapView!!.layerAdded(mLayer!!)
            }
        })
    }

    private fun addBelow(belowLayerID: String) {
        mMapView!!.waitForLayer(belowLayerID, object : FoundLayerCallback {
            override fun found(layer: Layer?) {
                if (!hasInitialized()) return
                val style = this@MLRNLayer.style ?: return
                style.addLayerBelow(mLayer, belowLayerID)
                mMapView!!.layerAdded(mLayer!!)
            }
        })
    }

    private fun addAtIndex(index: Int) {
        var idx = index
        if (!hasInitialized()) return
        val style = this.style ?: return
        val layerSize = style.getLayers().size
        if (idx >= layerSize) {
            FLog.e(LOG_TAG, "Layer index is greater than number of layers on map. Layer inserted at end of layer stack.")
            idx = layerSize - 1
        }
        style.addLayerAt(mLayer, idx)
        mMapView!!.layerAdded(mLayer!!)
    }

    private fun insertLayer() {
        val style = this.style ?: return
        if (style.getLayer(mID) != null) return

        if (mAboveLayerID != null) {
            addAbove(mAboveLayerID!!)
        } else if (mBelowLayerID != null) {
            addBelow(mBelowLayerID!!)
        } else if (mLayerIndex != null) {
            addAtIndex(mLayerIndex!!)
        } else {
            add()
        }

        setZoomBounds()
    }

    private fun setZoomBounds() {
        if (mMaxZoomLevel != null) {
            mLayer!!.setMaxZoom(mMaxZoomLevel!!.toFloat())
        }
        if (mMinZoomLevel != null) {
            mLayer!!.setMinZoom(mMinZoomLevel!!.toFloat())
        }
    }

    override fun addToMap(mapView: MLRNMapView) {
        mMap = mapView.mapLibreMap
        mMapView = mapView

        val style = this.style ?: return

        val existingLayer = style.getLayer(mID!!)
        if (existingLayer != null) {
            mLayer = existingLayer
        } else {
            mLayer = makeLayer()
            insertLayer()
        }

        addStyles()
        if (mFilter != null) {
            mHadFilter = true
            updateFilter(mFilter)
        }
    }

    override fun removeFromMap(mapView: MLRNMapView) {
        this.style?.removeLayer(mLayer)
    }

    private val style: Style?
        get() = mMap?.style

    private fun hasInitialized(): Boolean {
        return mMap != null && mLayer != null
    }

    companion object {
        const val LOG_TAG: String = "MLRNLayer"
    }
}
