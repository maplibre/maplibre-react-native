package org.maplibre.reactnative.components.sources

import android.content.Context
import android.graphics.PointF
import android.view.View
import com.facebook.react.bridge.ReadableMap
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.log.Logger
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.Style
import org.maplibre.android.style.sources.Source
import org.maplibre.geojson.Feature
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.layers.MLRNLayer
import org.maplibre.reactnative.components.mapview.MLRNMapView

abstract class MLRNSource<T : Source?>(context: Context?) : AbstractMapFeature(context) {
    protected var mMapView: MLRNMapView? = null

    @JvmField
    protected var mMap: MapLibreMap? = null

    @JvmField
    protected var mID: String? = null

    @JvmField
    protected var mSource: T? = null
    protected var mHasOnPress: Boolean = false
    protected var mTouchHitbox: MutableMap<String?, Double?>? = null

    protected var mLayers: MutableList<MLRNLayer<*>> = ArrayList()
    private var mQueuedLayers: MutableList<MLRNLayer<*>?>? = ArrayList()

    fun getID(): String {
        return mID!!
    }

    fun setID(id: String) {
        mID = id
    }

    fun getLayerIDs(): Array<String?> {
        val layerIDs: MutableList<String?> = ArrayList()

        for (i in mLayers.indices) {
            val layer = mLayers[i]
            layerIDs.add(layer.getID())
        }

        return layerIDs.toTypedArray<String?>()
    }


    open fun hasOnPress(): Boolean {
        return mHasOnPress
    }

    fun setHasOnPress(hasPressListener: Boolean) {
        mHasOnPress = hasPressListener
    }

    fun setHitbox(map: ReadableMap?) {
        if (map != null) {
            val hitbox: MutableMap<String?, Double?> = HashMap()
            hitbox["width"] = map.getDouble("width")
            hitbox["height"] = map.getDouble("height")
            mTouchHitbox = hitbox
        } else {
            mTouchHitbox = null
        }
    }

    fun setSource(source: T?) {
        mSource = source
    }

    val touchHitbox: MutableMap<String?, Double?>?
        get() {
            if (!hasOnPress()) {
                return null
            }

            if (mTouchHitbox == null) {
                val hitbox: MutableMap<String?, Double?> = HashMap()
                hitbox["top"] = DEFAULT_HITBOX / 2.0
                hitbox["right"] = DEFAULT_HITBOX / 2.0
                hitbox["bottom"] = DEFAULT_HITBOX / 2.0
                hitbox["left"] = DEFAULT_HITBOX / 2.0

                return hitbox
            }

            return mTouchHitbox
        }

    val layerCount: Int
        get() {
            var totalCount = 0

            if (mQueuedLayers != null) {
                totalCount = mQueuedLayers!!.size
            }

            totalCount += mLayers.size
            return totalCount
        }

    override fun addToMap(mapView: MLRNMapView) {
        mMapView = mapView
        mMap = mapView.mapLibreMap
        mMap!!.getStyle { style ->
            val existingSource = style.getSourceAs<T?>(mID!!)
            if (existingSource != null) {
                mSource = existingSource
            } else {
                mSource = makeSource()
                style.addSource(mSource!!)
            }

            if (mQueuedLayers != null && mQueuedLayers!!.isNotEmpty()) { // first load
                for (i in mQueuedLayers!!.indices) {
                    addLayerToMap(mQueuedLayers!![i], i)
                }
                mQueuedLayers = null
            } else if (mLayers.isNotEmpty()) { // handles the case of switching style url, but keeping layers on map
                for (i in mLayers.indices) {
                    addLayerToMap(mLayers[i], i)
                }
            }
        }
    }

    override fun removeFromMap(mapView: MLRNMapView?) {
        if (mLayers.isNotEmpty()) {
            for (i in mLayers.indices) {
                val layer = mLayers[i]
                layer.removeFromMap(mMapView)
            }
        }
        if (mQueuedLayers != null) {
            mQueuedLayers!!.clear()
        }
        if (mMap != null && mSource != null && mMap!!.style != null) {
            try {
                mMap!!.style!!.removeSource(mSource!!)
            } catch (ex: Throwable) {
                Logger.w(
                    LOG_TAG,
                    String.format("MLRNSource.removeFromMap: %s - %s", mSource, ex.message),
                    ex
                )
            }
        }
    }

    fun addLayer(childView: View?, childPosition: Int) {
        if (childView !is MLRNLayer<*>) {
            return
        }

        if (mMap == null) {
            mQueuedLayers!!.add(childPosition, childView)
        } else {
            addLayerToMap(childView, childPosition)
        }
    }

    fun removeLayer(childPosition: Int) {
        val layer: MLRNLayer<*>? = if (mQueuedLayers != null && mQueuedLayers!!.isNotEmpty()) {
            mQueuedLayers!![childPosition]
        } else {
            mLayers[childPosition]
        }
        removeLayerFromMap(layer, childPosition)
    }

    fun getLayerAt(childPosition: Int): MLRNLayer<*>? {
        if (mQueuedLayers != null && mQueuedLayers!!.isNotEmpty()) {
            return mQueuedLayers!![childPosition]
        }
        return mLayers[childPosition]
    }

    protected fun addLayerToMap(layer: MLRNLayer<*>?, childPosition: Int) {
        if (mMapView == null || layer == null) {
            return
        }

        layer.addToMap(mMapView)
        if (!mLayers.contains(layer)) {
            mLayers.add(childPosition, layer)
        }
    }

    protected fun removeLayerFromMap(layer: MLRNLayer<*>?, childPosition: Int) {
        if (mMapView != null && layer != null) {
            layer.removeFromMap(mMapView)
        }
        if (mQueuedLayers != null && mQueuedLayers!!.isNotEmpty()) {
            mQueuedLayers!!.removeAt(childPosition)
        } else {
            mLayers.removeAt(childPosition)
        }
    }

    val style: Style?
        get() {
            if (mMap == null) return null
            return mMap!!.style
        }

    abstract fun makeSource(): T?

    class OnPressEvent(
        @JvmField var features: MutableList<Feature>,
        @JvmField var latLng: LatLng,
        @JvmField var screenPoint: PointF
    )

    abstract fun onPress(event: OnPressEvent)

    companion object {
        const val DEFAULT_ID: String = "composite"
        const val LOG_TAG: String = "MLRNSource"

        const val DEFAULT_HITBOX: Double = 44.0

        @JvmStatic
        fun isDefaultSource(sourceID: String?): Boolean {
            return DEFAULT_ID == sourceID
        }
    }
}
