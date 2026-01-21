package org.maplibre.reactnative.components.layers

import android.content.Context
import com.facebook.common.logging.FLog
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import org.maplibre.android.location.LocationComponentConstants
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.layers.Layer
import org.maplibre.android.style.layers.Property
import org.maplibre.android.style.layers.PropertyFactory
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.components.mapview.MLRNMapView.FoundLayerCallback
import org.maplibre.reactnative.utils.ExpressionParser.from

abstract class MLRNLayer<T : Layer?>(protected var mContext: Context?) : AbstractMapFeature(
    mContext
) {
    protected var mID: String? = null
    protected var mSourceID: String? = null
    protected var mAboveLayerID: String? = null
    protected var mBelowLayerID: String? = null

    protected var mLayerIndex: Int? = null
    protected var mVisible: Boolean = false
    protected var mMinZoomLevel: Double? = null
    protected var mMaxZoomLevel: Double? = null
    protected var mReactStyle: ReadableMap? = null
    protected var mFilter: Expression? = null

    protected var mMap: MapLibreMap? = null
    protected var mLayer: T? = null

    protected var mMapView: MLRNMapView? = null

    protected var mHadFilter: Boolean = false

    var iD: String
        get() = mID!!
        set(id) {
            mID = id
        }

    fun setSourceID(sourceID: String?) {
        mSourceID = sourceID
    }

    fun setAboveLayerID(aboveLayerID: String?) {
        if (mAboveLayerID != null && mAboveLayerID == aboveLayerID) {
            return
        }

        mAboveLayerID = aboveLayerID
        if (mLayer != null) {
            removeFromMap(mMapView)
            addAbove(mAboveLayerID!!)
        }
    }

    fun setBelowLayerID(belowLayerID: String?) {
        if (mBelowLayerID != null && mBelowLayerID == belowLayerID) {
            return
        }

        mBelowLayerID = belowLayerID
        if (mLayer != null) {
            removeFromMap(mMapView)
            addBelow(mBelowLayerID!!)
        }
    }

    fun setLayerIndex(layerIndex: Int) {
        if (mLayerIndex != null && mLayerIndex == layerIndex) {
            return
        }

        mLayerIndex = layerIndex
        if (mLayer != null) {
            removeFromMap(mMapView)
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

    fun add() {
        if (!hasInitialized()) {
            return
        }
        if (this.style == null) return

        val userBackgroundID = LocationComponentConstants.BACKGROUND_LAYER
        val userLocationBackgroundLayer = this.style.getLayer(userBackgroundID)

        // place below user location layer
        if (userLocationBackgroundLayer != null) {
            this.style.addLayerBelow(mLayer, userBackgroundID)
            mMapView!!.layerAdded(mLayer!!)
            return
        }

        this.style.addLayer(mLayer)
        mMapView!!.layerAdded(mLayer!!)
    }

    fun addAbove(aboveLayerID: String) {
        mMapView!!.waitForLayer(aboveLayerID, object : FoundLayerCallback {
            override fun found(layer: Layer?) {
                if (!hasInitialized()) {
                    return
                }
                if (this.style == null) return
                this.style.addLayerAbove(mLayer, aboveLayerID)
                mMapView!!.layerAdded(mLayer!!)
            }
        })
    }

    fun addBelow(belowLayerID: String) {
        mMapView!!.waitForLayer(belowLayerID, object : FoundLayerCallback {
            override fun found(layer: Layer?) {
                if (!hasInitialized()) {
                    return
                }
                if (this.style == null) return
                this.style.addLayerBelow(mLayer, belowLayerID)
                mMapView!!.layerAdded(mLayer!!)
            }
        })
    }

    fun addAtIndex(index: Int) {
        var index = index
        if (!hasInitialized()) {
            return
        }
        if (this.style == null) return
        val layerSize = this.style.getLayers().size
        if (index >= layerSize) {
            FLog.e(
                LOG_TAG,
                "Layer index is greater than number of layers on map. Layer inserted at end of layer stack."
            )
            index = layerSize - 1
        }
        this.style.addLayerAt(mLayer, index)
        mMapView!!.layerAdded(mLayer!!)
    }

    protected fun insertLayer() {
        if (this.style == null) return
        if (this.style.getLayer(mID) != null) {
            return  // prevent adding a layer twice
        }

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

    protected fun setZoomBounds() {
        if (mMaxZoomLevel != null) {
            mLayer!!.setMaxZoom(mMaxZoomLevel!!.toFloat())
        }

        if (mMinZoomLevel != null) {
            mLayer!!.setMinZoom(mMinZoomLevel!!.toFloat())
        }
    }

    protected open fun updateFilter(expression: Expression?) {
        // override if you want to update the filter
    }

    override fun addToMap(mapView: MLRNMapView) {
        mMap = mapView.mapLibreMap
        mMapView = mapView

        if (this.style == null) return

        val existingLayer = this.style.getLayerAs<T?>(mID)
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

    override fun removeFromMap(mapView: MLRNMapView?) {
        if (this.style != null) {
            this.style.removeLayer(mLayer)
        }
    }

    private val style: Style?
        get() {
            if (mMap == null) {
                return null
            }
            return mMap!!.getStyle()
        }

    abstract fun makeLayer(): T?
    abstract fun addStyles()

    private fun hasInitialized(): Boolean {
        return mMap != null && mLayer != null
    }

    companion object {
        const val LOG_TAG: String = "MLRNLayer"
    }
}
