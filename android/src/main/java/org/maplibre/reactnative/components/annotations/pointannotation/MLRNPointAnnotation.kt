package org.maplibre.reactnative.components.annotations.pointannotation

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.PointF
import android.graphics.Bitmap
import android.view.View

import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper

import org.maplibre.geojson.Point
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.plugins.annotation.Symbol
import org.maplibre.android.plugins.annotation.SymbolOptions
import org.maplibre.android.maps.MapLibreMap

import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.annotations.callout.MLRNCallout
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.events.PointAnnotationEvent
import org.maplibre.reactnative.utils.GeoJSONUtils
import org.maplibre.reactnative.utils.BitmapUtils

@SuppressLint("ViewConstructor")
class MLRNPointAnnotation(private val mContext: Context) : AbstractMapFeature(mContext), View.OnLayoutChangeListener {
    private var mAnnotation: Symbol? = null
    private var mMap: MapLibreMap? = null
    private var mMapView: MLRNMapView? = null

    private val mHasChildren = false

    private var mCoordinate: Point? = null

    private var mID: String? = null
    private var mTitle: String? = null
    private var mSnippet: String? = null

    private var mAnchor: FloatArray? = null
    private var mOffset: FloatArray? = null
    private val mIsSelected = false
    private var mDraggable = false

    private var mChildView: View? = null
    private var mChildBitmap: Bitmap? = null
    private var mChildBitmapId: String? = null

    private var mCalloutView: View? = null
    private var mCalloutSymbol: Symbol? = null
    private var mCalloutBitmap: Bitmap? = null
    private var mCalloutBitmapId: String? = null

    companion object {
        const val MARKER_IMAGE_ID: String = "MARKER_IMAGE_ID"
    }

    private val surfaceId: Int
        get() {
            val reactContext = mContext as ReactContext
            return UIManagerHelper.getSurfaceId(reactContext)
        }

    override fun addView(childView: View, childPosition: Int) {
        if (childView is MLRNCallout) {
            mCalloutView = childView
        } else {
            // Only accept position 0 for non-callout children - the wrapper View
            // with collapsable={false} from JS side. This prevents Fabric from
            // sending multiple flattened children that would overwrite mChildView.
            if (childPosition != 0) {
                return
            }
            mChildView = childView
        }
        childView.addOnLayoutChangeListener(this)
        mMapView?.offscreenAnnotationViewContainer()?.addView(childView)
    }

    override fun removeView(childView: View?) {
        if (childView == null) return

        childView.removeOnLayoutChangeListener(this)
        // Remove from offscreen container
        mMapView?.offscreenAnnotationViewContainer()?.removeView(childView)

        if (childView == mChildView) {
            mMap?.getStyle { style ->
                mChildBitmapId?.let { style.removeImage(it) }
                mChildBitmap = null
                mChildBitmapId = null
                updateOptions()
            }
            mChildView = null
        } else if (childView == mCalloutView) {
            mCalloutView = null
        }
    }

    override fun removeViewAt(index: Int) {
        val child = getChildAt(index)
        if (child != null) {
            removeView(child)
        }
    }

    override fun getChildCount(): Int {
        var count = 0
        if (mChildView != null) count++
        if (mCalloutView != null) count++
        return count
    }

    override fun getChildAt(index: Int): View? {
        // Return children in consistent order: child view first, then callout
        return when {
            index == 0 && mChildView != null -> mChildView
            index == 0 && mChildView == null && mCalloutView != null -> mCalloutView
            index == 1 && mChildView != null && mCalloutView != null -> mCalloutView
            else -> null
        }
    }

    override fun addToMap(mapView: MLRNMapView) {
        mMapView = mapView
        mMap = mapView.mapLibreMap
        makeMarker()

        if (mChildView != null) {
            if (!mChildView!!.isAttachedToWindow) {
                mMapView?.offscreenAnnotationViewContainer()?.addView(mChildView)
            }
            addBitmapToStyle(mChildBitmap, mChildBitmapId)
            updateOptions()
        }
        if (mCalloutView != null) {
            if (!mCalloutView!!.isAttachedToWindow) {
                mMapView?.offscreenAnnotationViewContainer()?.addView(mCalloutView)
            }
            addBitmapToStyle(mCalloutBitmap, mCalloutBitmapId)
        }
    }

    override fun removeFromMap(mapView: MLRNMapView) {
        val map = if (mMapView != null) mMapView else mapView
        if (map == null) {
            return
        }

        if (mAnnotation != null) {
            map.getSymbolManager().delete(mAnnotation)
        }
        if (mChildView != null) {
            map.offscreenAnnotationViewContainer()?.removeView(mChildView)
        }
        if (mCalloutView != null) {
            map.offscreenAnnotationViewContainer()?.removeView(mCalloutView)
        }
    }

    override fun onLayoutChange(v: View, left: Int, top: Int, right: Int, bottom: Int, oldLeft: Int,
                                oldTop: Int, oldRight: Int, oldBottom: Int) {
        if (left == 0 && top == 0 && right == 0 && bottom == 0) {
            return
        }
        if (left != oldLeft || right != oldRight || top != oldTop || bottom != oldBottom) {
            refreshBitmap(v, left, top, right, bottom)
        }
    }

    private fun refreshBitmap(v: View, left: Int, top: Int, right: Int, bottom: Int) {
        val bitmap: Bitmap = BitmapUtils.viewToBitmap(v, left, top, right, bottom)
        val bitmapId: String = v.id.toString()
        addBitmapToStyle(bitmap, bitmapId)
        if (v is MLRNCallout) {
            mCalloutBitmap = bitmap
            mCalloutBitmapId = bitmapId
        } else {
            mChildBitmap = bitmap
            mChildBitmapId = bitmapId
            updateOptions()
        }
    }

    private fun refreshBitmap(v: View) {
        refreshBitmap(v, v.left, v.top, v.right, v.bottom)
    }

    fun getLatLng(): LatLng? {
        return GeoJSONUtils.toLatLng(mCoordinate)
    }

    val mapboxID: Long get() = mAnnotation?.id ?: -1

    fun getID(): String? = mID

    fun setID(id: String) {
        mID = id
    }

    fun setTitle(title: String?) {
        mTitle = title
    }

    fun setSnippet(snippet: String?) {
        mSnippet = snippet
    }

    fun getCalloutView(): View? {
        return mCalloutView
    }

    fun setLngLat(lngLat: DoubleArray?) {
        if (lngLat == null || lngLat.size < 2) {
            return
        }
        val point = Point.fromLngLat(lngLat[0], lngLat[1])
        mCoordinate = point

        if (mAnnotation != null) {
            mAnnotation!!.latLng = GeoJSONUtils.toLatLng(point)!!
            mMapView?.getSymbolManager()?.update(mAnnotation)
        }
        if (mCalloutSymbol != null) {
            mCalloutSymbol!!.latLng = GeoJSONUtils.toLatLng(point)!!
            mMapView?.getSymbolManager()?.update(mCalloutSymbol)
        }
    }

    fun setAnchor(x: Float, y: Float) {
        mAnchor = floatArrayOf(x, y)

        if (mAnnotation != null) {
            updateAnchor()
            mMapView?.getSymbolManager()?.update(mAnnotation)
        }
    }

    fun setOffset(x: Float, y: Float) {
        mOffset = floatArrayOf(x, y)

        if (mAnnotation != null) {
            updateAnchor()
            mMapView?.getSymbolManager()?.update(mAnnotation)
        }
    }

    fun setDraggable(draggable: Boolean) {
        mDraggable = draggable
        if (mAnnotation != null) {
            mAnnotation!!.isDraggable = draggable
            mMapView?.getSymbolManager()?.update(mAnnotation)
        }
    }

    fun getMarker(): Symbol? {
        return mAnnotation
    }

    fun onSelect(shouldSendEvent: Boolean) {
        if (mCalloutView != null) {
            makeCallout()
        }
        if (shouldSendEvent) {
            emitEvent("onSelected")
        }
    }

    fun onDeselect() {
        emitEvent("onDeselected")
        if (mCalloutSymbol != null) {
            mMapView?.getSymbolManager()?.delete(mCalloutSymbol)
        }
    }

    fun onDragStart() {
        val latLng = mAnnotation?.latLng
        if (latLng != null) {
            mCoordinate = Point.fromLngLat(latLng.longitude, latLng.latitude)
        }
        emitEvent("onDragStart")
    }

    fun onDrag() {
        val latLng = mAnnotation?.latLng
        if (latLng != null) {
            mCoordinate = Point.fromLngLat(latLng.longitude, latLng.latitude)
        }
        emitEvent("onDrag")
    }

    fun onDragEnd() {
        val latLng = mAnnotation?.latLng
        if (latLng != null) {
            mCoordinate = Point.fromLngLat(latLng.longitude, latLng.latitude)
        }
        emitEvent("onDragEnd")
    }

    fun makeMarker() {
        val options = SymbolOptions()
            .withLatLng(GeoJSONUtils.toLatLng(mCoordinate))
            .withDraggable(mDraggable)
            .withIconSize(1.0f)
            .withSymbolSortKey(10.0f)
        val symbolManager = mMapView?.getSymbolManager()
        if (symbolManager != null) {
            mAnnotation = symbolManager.create(options)
            updateOptions()
        }
    }

    private fun updateOptions() {
        if (mAnnotation != null) {
            updateIconImage()
            updateAnchor()
            mMapView?.getSymbolManager()?.update(mAnnotation)
        }
    }

    private fun updateIconImage() {
        if (mChildView != null) {
            if (mChildBitmapId != null) {
                mAnnotation?.iconImage = mChildBitmapId
            }
        } else {
            mAnnotation?.iconImage = MARKER_IMAGE_ID
            mAnnotation?.iconAnchor = "bottom"
        }
    }

    private fun updateAnchor() {
        if (mChildView != null && mChildBitmap != null) {
            val scale = resources.displayMetrics.density
            var offsetX = 0f
            var offsetY = 0f

            // Apply anchor offset (anchor is a percentage of view dimensions)
            if (mAnchor != null) {
                val w = (mChildBitmap!!.width / scale).toInt()
                val h = (mChildBitmap!!.height / scale).toInt()
                offsetX = w * mAnchor!![0] * -1
                offsetY = h * mAnchor!![1] * -1
            }

            // Apply pixel offset
            if (mOffset != null) {
                offsetX += mOffset!![0]
                offsetY += mOffset!![1]
            }

            mAnnotation?.iconAnchor = "top-left"
            mAnnotation?.setIconOffset(PointF(offsetX, offsetY))
        }
    }

    private fun makeCallout() {
        var yOffset = -28f
        if (mChildView != null) {
            if (mChildBitmap != null) {
                val scale = resources.displayMetrics.density
                var h = mChildBitmap!!.height / 2
                h = (h / scale).toInt()
                yOffset = (h * -1).toFloat()
            }
        }
        val options = SymbolOptions()
            .withLatLng(GeoJSONUtils.toLatLng(mCoordinate))
            .withIconImage(mCalloutBitmapId)
            .withIconSize(1.0f)
            .withIconAnchor("bottom")
            .withIconOffset(floatArrayOf(0f, yOffset).toTypedArray())
            .withSymbolSortKey(11.0f)
            .withDraggable(false)
        val symbolManager = mMapView?.getSymbolManager()
        if (symbolManager != null) {
            mCalloutSymbol = symbolManager.create(options)
        }
    }

    private fun addBitmapToStyle(bitmap: Bitmap?, bitmapId: String?) {
        if (mMap != null && bitmapId != null && bitmap != null) {
            mMap!!.getStyle { style ->
                style.addImage(bitmapId, bitmap)
            }
        }
    }

    private fun emitEvent(eventName: String) {
        val latLng = GeoJSONUtils.toLatLng(mCoordinate) ?: return
        val screenPos = getScreenPosition(latLng) ?: return

        val event = PointAnnotationEvent(
            surfaceId,
            id,
            eventName,
            mID,
            latLng,
            screenPos
        )

        mMapView?.eventDispatcher?.dispatchEvent(event)
    }

    private fun getDisplayDensity(): Float {
        return mContext.resources.displayMetrics.density
    }

    private fun getScreenPosition(latLng: LatLng): PointF? {
        val screenPos = mMap?.projection?.toScreenLocation(latLng)
        val density = getDisplayDensity()
        screenPos?.x = screenPos?.x?.div(density) ?: 0f
        screenPos?.y = screenPos?.y?.div(density) ?: 0f
        return screenPos
    }

    fun refresh() {
        mChildView?.let { refreshBitmap(it) }
    }
}
