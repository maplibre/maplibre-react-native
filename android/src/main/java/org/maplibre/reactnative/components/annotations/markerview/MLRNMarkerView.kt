package org.maplibre.reactnative.components.annotations.markerview

import android.annotation.SuppressLint
import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import com.facebook.react.uimanager.ViewGroupManager
import org.maplibre.geojson.Point
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.utils.GeoJSONUtils

@SuppressLint("ViewConstructor")
class MLRNMarkerView(
    context: Context,
) : AbstractMapFeature(context),
    View.OnLayoutChangeListener {
    private var mMapView: MLRNMapView? = null
    private var mChildView: View? = null
    private var mWrapperView: MLRNMarkerViewContent? = null
    private var mMarkerViewManager: MarkerViewManager? = null
    private var mMarkerInfo: MarkerViewManager.MarkerInfo? = null
    private var mCoordinate: Point? = null
    private var mAnchor: FloatArray? = null
    private var mOffset: FloatArray? = null
    private var mAddedToMap = false
    private var mLastWidth = 0
    private var mLastHeight = 0
    private var mLastZIndex: Int? = null

    private fun ViewGroup.disableClipping() {
        clipChildren = false
        clipToPadding = false
        clipToOutline = false
    }

    private fun disableClippingRecursively(view: View) {
        if (view is ViewGroup) {
            view.disableClipping()
            view.setOnHierarchyChangeListener(
                object : ViewGroup.OnHierarchyChangeListener {
                    override fun onChildViewAdded(
                        parent: View?,
                        child: View?,
                    ) {
                        child?.let { disableClippingRecursively(it) }
                    }

                    override fun onChildViewRemoved(
                        parent: View?,
                        child: View?,
                    ) {}
                },
            )
            for (i in 0 until view.childCount) {
                disableClippingRecursively(view.getChildAt(i))
            }
        }
    }

    override fun addView(
        childView: View,
        childPosition: Int,
    ) {
        if (childPosition != 0) return

        mChildView = childView
        childView.addOnLayoutChangeListener(this)
        disableClippingRecursively(childView)

        val offscreenContainer = mMapView?.offscreenAnnotationViewContainer()
        offscreenContainer?.disableClipping()
        offscreenContainer?.addView(childView)
    }

    override fun removeView(view: View?) {
        if (view == mChildView) {
            removeChildView()
        }
    }

    override fun removeViewAt(index: Int) {
        if (index == 0 && mChildView != null) {
            removeChildView()
        }
    }

    private fun removeChildView() {
        mChildView?.removeOnLayoutChangeListener(this)
        (mChildView?.parent as? android.view.ViewGroup)?.removeView(mChildView)
        mChildView = null
    }

    override fun getChildCount(): Int = if (mChildView != null) 1 else 0

    override fun getChildAt(index: Int): View? = if (index == 0) mChildView else null

    fun setLngLat(lngLat: DoubleArray?) {
        if (lngLat == null || lngLat.size < 2) return
        val point = Point.fromLngLat(lngLat[0], lngLat[1])
        mCoordinate = point
        val latLng = GeoJSONUtils.toLatLng(point)
        if (latLng != null && mMarkerInfo != null && mMarkerViewManager != null) {
            mMarkerViewManager!!.updateMarkerCoordinate(mMarkerInfo!!, latLng)
        }
    }

    fun setAnchor(
        x: Float,
        y: Float,
    ) {
        mAnchor = floatArrayOf(x, y)
        if (mMarkerInfo != null && mMarkerViewManager != null) {
            mMarkerViewManager!!.updateMarkerAnchor(mMarkerInfo!!, x, y)
        }
    }

    fun setOffset(
        x: Float,
        y: Float,
    ) {
        mOffset = floatArrayOf(x, y)
        val scale = resources.displayMetrics.density
        val pixelOffsetX = x * scale
        val pixelOffsetY = y * scale
        if (mMarkerInfo != null && mMarkerViewManager != null) {
            mMarkerViewManager!!.updateMarkerOffset(mMarkerInfo!!, pixelOffsetX, pixelOffsetY)
        }
    }

    fun updateZIndex(zIndex: Float) {
        mWrapperView?.translationZ = zIndex
    }

    override fun addToMap(mapView: MLRNMapView) {
        mMapView = mapView
        if (mChildView != null && !mChildView!!.isAttachedToWindow) {
            val offscreenContainer = mMapView?.offscreenAnnotationViewContainer()
            offscreenContainer?.disableClipping()
            offscreenContainer?.addView(mChildView)
        }
        tryAddToMarkerViewManager()
    }

    private fun tryAddToMarkerViewManager() {
        if (mAddedToMap || mMapView == null || mChildView == null) return
        if (mChildView!!.width == 0 || mChildView!!.height == 0) return

        mAddedToMap = true

        mMapView?.getMapAsync { mapLibreMap ->
            val latLng = GeoJSONUtils.toLatLng(mCoordinate)
            mMarkerViewManager = mMapView?.getMarkerViewManager(mapLibreMap)

            if (latLng != null && mChildView != null && mMarkerViewManager != null) {
                mMapView?.offscreenAnnotationViewContainer()?.removeView(mChildView)
                disableClippingRecursively(mChildView!!)

                // Use explicit child dimensions for the wrapper so that
                // MarkerViewManager.updateMarkerPosition() can calculate
                // anchor offsets correctly. WRAP_CONTENT doesn't reliably
                // measure reparented React views.
                mWrapperView =
                    MLRNMarkerViewContent(context).apply {
                        layoutParams =
                            FrameLayout.LayoutParams(
                                mChildView!!.width,
                                mChildView!!.height,
                            )
                        addView(mChildView)
                    }
                mWrapperView!!.setLayerType(View.LAYER_TYPE_HARDWARE, null)

                mLastZIndex = ViewGroupManager.getViewZIndex(this@MLRNMarkerView)
                if (mLastZIndex != null) {
                    mWrapperView!!.translationZ = mLastZIndex!!.toFloat()
                }

                val scale = resources.displayMetrics.density
                val pixelOffsetX = (mOffset?.get(0) ?: 0f) * scale
                val pixelOffsetY = (mOffset?.get(1) ?: 0f) * scale

                mMarkerInfo =
                    mMarkerViewManager!!.addMarker(
                        view = mWrapperView!!,
                        latLng = latLng,
                        anchorX = mAnchor?.get(0) ?: 0f,
                        anchorY = mAnchor?.get(1) ?: 0f,
                        offsetX = pixelOffsetX,
                        offsetY = pixelOffsetY,
                    )
            }
        }
    }

    override fun removeFromMap(mapView: MLRNMapView) {
        if (mMarkerInfo != null && mMarkerViewManager != null) {
            mMarkerViewManager!!.removeMarker(mMarkerInfo!!)
            mMarkerInfo = null
            mMarkerViewManager = null
        }
        mChildView?.removeOnLayoutChangeListener(this)
        mWrapperView?.removeAllViews()
        mWrapperView = null
        if (mChildView != null && !mAddedToMap) {
            mMapView?.offscreenAnnotationViewContainer()?.removeView(mChildView)
        }
        mAddedToMap = false
    }

    override fun onLayoutChange(
        v: View,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
        oldLeft: Int,
        oldTop: Int,
        oldRight: Int,
        oldBottom: Int,
    ) {
        if (left == 0 && top == 0 && right == 0 && bottom == 0) return

        val width = right - left
        val height = bottom - top

        if (!mAddedToMap) {
            tryAddToMarkerViewManager()
            return
        }

        val currentZIndex = ViewGroupManager.getViewZIndex(this@MLRNMarkerView)
        if (currentZIndex != mLastZIndex) {
            mLastZIndex = currentZIndex
            if (currentZIndex != null) {
                mWrapperView?.translationZ = currentZIndex.toFloat()
            }
        }

        if (width == mLastWidth && height == mLastHeight) return

        mLastWidth = width
        mLastHeight = height
        mChildView?.layoutParams?.let { params ->
            params.width = width
            params.height = height
        }

        // Keep wrapper dimensions in sync so anchor offsets are correct
        mWrapperView?.layoutParams?.let { params ->
            params.width = width
            params.height = height
        }
        // Ensure updated layout params are applied before updating markers
        mWrapperView?.requestLayout()
        mMarkerViewManager?.updateMarkers()
    }
}
