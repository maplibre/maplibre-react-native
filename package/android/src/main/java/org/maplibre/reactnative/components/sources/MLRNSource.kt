package org.maplibre.reactnative.components.sources

import android.content.Context
import android.view.View
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.EventDispatcher
import org.maplibre.android.log.Logger
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.Style
import org.maplibre.android.style.sources.Source
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.layer.MLRNLayer
import org.maplibre.reactnative.components.mapview.MLRNMapView

abstract class MLRNSource<T : Source?>(
    context: Context?,
) : AbstractMapFeature(context) {
    protected var mMapView: MLRNMapView? = null

    protected var mMap: MapLibreMap? = null

    @JvmField
    protected var mID: String? = null

    @JvmField
    protected var source: T? = null

    protected var mLayers: MutableList<MLRNLayer> = ArrayList()
    private var mQueuedLayers: MutableList<MLRNLayer?>? = ArrayList()

    val eventDispatcher: EventDispatcher?
        get() {
            val reactContext = context as ReactContext

            return UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
        }

    val surfaceId: Int
        get() {
            val reactContext = context as ReactContext

            return UIManagerHelper.getSurfaceId(reactContext)
        }

    fun getID(): String = mID!!

    fun setID(id: String) {
        mID = id
    }

    fun getLayerIDs(): Array<String?> {
        val layerIDs: MutableList<String?> = ArrayList()

        for (i in mLayers.indices) {
            val layer = mLayers[i]
            layerIDs.add(layer.ID)
        }

        return layerIDs.toTypedArray<String?>()
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
                source = existingSource
            } else {
                source = makeSource()
                style.addSource(source!!)
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

    override fun removeFromMap(mapView: MLRNMapView) {
        if (mLayers.isNotEmpty()) {
            for (i in mLayers.indices) {
                val layer = mLayers[i]
                layer.removeFromMap(mapView)
            }
        }
        if (mQueuedLayers != null) {
            mQueuedLayers!!.clear()
        }
        if (mMap != null && source != null && mMap!!.style != null) {
            try {
                mMap!!.style!!.removeSource(source!!)
            } catch (ex: Throwable) {
                Logger.w(
                    LOG_TAG,
                    String.format("MLRNSource.removeFromMap: %s - %s", source, ex.message),
                    ex,
                )
            }
        }
    }

    fun addLayer(
        childView: View?,
        childPosition: Int,
    ) {
        if (childView !is MLRNLayer) {
            return
        }

        if (mMap == null) {
            mQueuedLayers!!.add(childPosition, childView)
        } else {
            addLayerToMap(childView, childPosition)
        }
    }

    fun removeLayer(childPosition: Int) {
        val layer: MLRNLayer? =
            if (mQueuedLayers != null && mQueuedLayers!!.isNotEmpty()) {
                mQueuedLayers!![childPosition]
            } else {
                mLayers[childPosition]
            }
        removeLayerFromMap(layer, childPosition)
    }

    fun getLayerAt(childPosition: Int): MLRNLayer? {
        if (mQueuedLayers != null && mQueuedLayers!!.isNotEmpty()) {
            return mQueuedLayers!![childPosition]
        }
        return mLayers[childPosition]
    }

    protected fun addLayerToMap(
        layer: MLRNLayer?,
        childPosition: Int,
    ) {
        val mapView = mMapView ?: return
        if (layer == null) return

        if (mID != null) {
            layer.setSourceID(mID)
        }
        layer.addToMap(mapView)
        if (!mLayers.contains(layer)) {
            mLayers.add(childPosition, layer)
        }
    }

    protected fun removeLayerFromMap(
        layer: MLRNLayer?,
        childPosition: Int,
    ) {
        val mapView = mMapView
        if (mapView != null && layer != null) {
            layer.removeFromMap(mapView)
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

    abstract fun makeSource(): T

    companion object {
        const val LOG_TAG: String = "MLRNSource"
    }
}
