package org.maplibre.reactnative.components.annotations.markerview

import android.annotation.SuppressLint
import android.content.Context
import android.view.View
import android.widget.FrameLayout
import com.facebook.react.uimanager.ViewGroupManager
import org.maplibre.geojson.Point
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.utils.GeoJSONUtils

@SuppressLint("ViewConstructor")
class MLRNMarkerView(context: Context) : AbstractMapFeature(context), View.OnLayoutChangeListener {
    private var mMapView: MLRNMapView? = null
    private var mChildView: View? = null
    private var mMarkerViewManager: MarkerViewManager? = null
    private var mMarkerInfo: MarkerViewManager.MarkerInfo? = null
    private var mCoordinate: Point? = null
    private var mAnchor: FloatArray? = null
    private var mOffset: FloatArray? = null
    private var mAddedToMap = false
    private var mLastWidth = 0
    private var mLastHeight = 0
    private var mLastZIndex: Int? = null

    override fun addView(childView: View, childPosition: Int) {
        // Only accept position 0 - the root container wrapped with collapsable={false} on JS side.
        // This wrapper prevents Fabric from flattening the view hierarchy.
        if (childPosition != 0) {
            return
        }

        mChildView = childView
        childView.addOnLayoutChangeListener(this)
        // Add to offscreen container for proper styling/measurement in Fabric
        // MLRNMarkerView itself is not in the view hierarchy (it's a MapFeature),
        // so we must use the offscreen container attached to MapView
        mMapView?.offscreenAnnotationViewContainer()?.addView(childView)
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
        // Remove from wherever it currently is (offscreen container or MapView)
        (mChildView?.parent as? android.view.ViewGroup)?.removeView(mChildView)
        mChildView = null
    }

    override fun getChildCount(): Int {
        return if (mChildView != null) 1 else 0
    }

    override fun getChildAt(index: Int): View? {
        return if (index == 0) mChildView else null
    }

    fun setLngLat(lngLat: DoubleArray?) {
        if (lngLat == null || lngLat.size < 2) {
            return
        }
        val point = Point.fromLngLat(lngLat[0], lngLat[1])
        mCoordinate = point

        // Update the marker position if already added to the manager
        val latLng = GeoJSONUtils.toLatLng(point)
        if (latLng != null && mMarkerInfo != null && mMarkerViewManager != null) {
            mMarkerViewManager!!.updateMarkerCoordinate(mMarkerInfo!!, latLng)
        }
    }

    fun setAnchor(x: Float, y: Float) {
        mAnchor = floatArrayOf(x, y)

        // Update the marker if already added
        if (mMarkerInfo != null && mMarkerViewManager != null) {
            mMarkerViewManager!!.updateMarkerAnchor(mMarkerInfo!!, x, y)
        }
    }

    fun setOffset(x: Float, y: Float) {
        mOffset = floatArrayOf(x, y)

        // Convert to pixels for the manager
        val scale = resources.displayMetrics.density
        val pixelOffsetX = x * scale
        val pixelOffsetY = y * scale

        // Update the marker if already added
        if (mMarkerInfo != null && mMarkerViewManager != null) {
            mMarkerViewManager!!.updateMarkerOffset(mMarkerInfo!!, pixelOffsetX, pixelOffsetY)
        }
    }

    fun updateZIndex(zIndex: Float) {
        // Apply zIndex as translationZ on the child view for proper stacking order
        mChildView?.translationZ = zIndex
    }

    override fun addToMap(mapView: MLRNMapView) {
        mMapView = mapView

        // If child was added before we had mMapView, add it to offscreen container now
        if (mChildView != null && !mChildView!!.isAttachedToWindow) {
            mMapView?.offscreenAnnotationViewContainer()?.addView(mChildView)
        }

        // The child view needs to complete layout in the offscreen container
        // before we can add it to the MarkerViewManager. We'll do this in
        // onLayoutChange when the view has non-zero dimensions.
        tryAddToMarkerViewManager()
    }

    private fun tryAddToMarkerViewManager() {
        if (mAddedToMap || mMapView == null || mChildView == null) {
            return
        }

        // Wait for the child to have valid dimensions (layout complete)
        if (mChildView!!.width == 0 || mChildView!!.height == 0) {
            return
        }

        mAddedToMap = true

        mMapView?.getMapAsync { mapLibreMap ->
            val latLng = GeoJSONUtils.toLatLng(mCoordinate)
            mMarkerViewManager = mMapView?.getMarkerViewManager(mapLibreMap)

            if (latLng != null && mChildView != null && mMarkerViewManager != null) {
                // Capture the measured dimensions before removing from offscreen container
                val measuredWidth = mChildView!!.width
                val measuredHeight = mChildView!!.height

                // Track dimensions to avoid unnecessary refreshes on layout change
                mLastWidth = measuredWidth
                mLastHeight = measuredHeight

                // Remove from offscreen container before adding to MarkerViewManager
                mMapView?.offscreenAnnotationViewContainer()?.removeView(mChildView)

                // Set explicit layout params with measured dimensions to prevent
                // the view from expanding to fill parent when added to MapView
                mChildView!!.layoutParams = FrameLayout.LayoutParams(measuredWidth, measuredHeight)

                // Enable hardware acceleration for smoother position updates during map movement
                mChildView!!.setLayerType(View.LAYER_TYPE_HARDWARE, null)

                // Apply zIndex as translationZ for proper stacking order
                mLastZIndex = ViewGroupManager.getViewZIndex(this@MLRNMarkerView)
                if (mLastZIndex != null) {
                    mChildView!!.translationZ = mLastZIndex!!.toFloat()
                }

                // Calculate pixel offsets
                val scale = resources.displayMetrics.density
                val pixelOffsetX = (mOffset?.get(0) ?: 0f) * scale
                val pixelOffsetY = (mOffset?.get(1) ?: 0f) * scale

                // Add to the marker view manager
                mMarkerInfo = mMarkerViewManager!!.addMarker(
                    view = mChildView!!,
                    latLng = latLng,
                    anchorX = mAnchor?.get(0) ?: 0f,
                    anchorY = mAnchor?.get(1) ?: 0f,
                    offsetX = pixelOffsetX,
                    offsetY = pixelOffsetY
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
        // Also remove from offscreen container if still there
        if (mChildView != null && !mAddedToMap) {
            mMapView?.offscreenAnnotationViewContainer()?.removeView(mChildView)
        }
        mAddedToMap = false
    }

    override fun onLayoutChange(
        v: View, left: Int, top: Int, right: Int, bottom: Int,
        oldLeft: Int, oldTop: Int, oldRight: Int, oldBottom: Int
    ) {
        if (left == 0 && top == 0 && right == 0 && bottom == 0) {
            return
        }

        val width = right - left
        val height = bottom - top

        // If not yet added to MarkerViewManager, try now that we have dimensions
        if (!mAddedToMap) {
            tryAddToMarkerViewManager()
            return
        }

        // Always check for zIndex changes (zIndex can change without dimension changes)
        val currentZIndex = ViewGroupManager.getViewZIndex(this@MLRNMarkerView)
        if (currentZIndex != mLastZIndex) {
            mLastZIndex = currentZIndex
            if (currentZIndex != null) {
                mChildView?.translationZ = currentZIndex.toFloat()
            }
        }

        // Only process dimension changes for layout params
        val dimensionsChanged = width != mLastWidth || height != mLastHeight
        if (!dimensionsChanged) {
            return
        }

        mLastWidth = width
        mLastHeight = height

        // Update layout params to match new dimensions
        mChildView?.layoutParams?.let { params ->
            params.width = width
            params.height = height
        }

        // Trigger a position update since anchor depends on dimensions
        // The MarkerViewManager will recalculate using current width/height
        mMarkerViewManager?.updateMarkers()
    }
}
