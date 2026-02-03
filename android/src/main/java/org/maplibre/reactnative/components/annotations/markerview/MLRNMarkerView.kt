package org.maplibre.reactnative.components.annotations.markerview

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.PointF
import android.view.View
import android.widget.FrameLayout
import com.facebook.react.uimanager.ViewGroupManager
import org.maplibre.geojson.Point
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.utils.GeoJSONUtils

@SuppressLint("ViewConstructor")
class MLRNMarkerView(context: Context) : AbstractMapFeature(context), org.maplibre.android.plugins.markerview.MarkerView.OnPositionUpdateListener, View.OnLayoutChangeListener {
    private var mMapView: MLRNMapView? = null
    private var mChildView: View? = null
    private var mMarkerViewManager: MarkerViewManager? = null
    private var mMarkerView: MarkerView? = null
    private var mCoordinate: Point? = null
    private var mAnchor: FloatArray? = null
    private var mOffset: FloatArray? = null
    private var mAddedToMap = false
    private var mLastWidth = 0
    private var mLastHeight = 0
    private var mLastZIndex: Int? = null
    // Cached anchor offset in pixels (recalculated when dimensions or anchor change)
    private var mCachedAnchorOffsetX = 0f
    private var mCachedAnchorOffsetY = 0f
    // Cached pixel offset (recalculated when offset prop changes)
    private var mCachedPixelOffsetX = 0f
    private var mCachedPixelOffsetY = 0f

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
        // Remove from wherever it currently is (offscreen container or MarkerView's parent)
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

        val latLng = GeoJSONUtils.toLatLng(point)
        if (latLng != null) {
            mMarkerView?.setLatLng(latLng)
        }
    }

    fun setAnchor(x: Float, y: Float) {
        mAnchor = floatArrayOf(x, y)
        updateCachedAnchorOffset()
        this.refresh()
    }

    fun setOffset(x: Float, y: Float) {
        mOffset = floatArrayOf(x, y)
        updateCachedPixelOffset()
        this.refresh()
    }

    private fun updateCachedAnchorOffset() {
        if (mAnchor != null && mLastWidth > 0 && mLastHeight > 0) {
            mCachedAnchorOffsetX = mLastWidth * mAnchor!![0]
            mCachedAnchorOffsetY = mLastHeight * mAnchor!![1]
        } else {
            mCachedAnchorOffsetX = 0f
            mCachedAnchorOffsetY = 0f
        }
    }

    private fun updateCachedPixelOffset() {
        if (mOffset != null) {
            val scale = resources.displayMetrics.density
            mCachedPixelOffsetX = mOffset!![0] * scale
            mCachedPixelOffsetY = mOffset!![1] * scale
        } else {
            mCachedPixelOffsetX = 0f
            mCachedPixelOffsetY = 0f
        }
    }

    fun updateZIndex(zIndex: Float) {
        // Apply zIndex as translationZ on the child view for proper stacking order
        // This is called from the ViewManager when zIndex prop changes
        mChildView?.translationZ = zIndex
    }

    fun refresh() {
        // this will cause position to be recalculated
        val latLng = GeoJSONUtils.toLatLng(mCoordinate)
        if (latLng != null) {
            mMarkerView?.setLatLng(latLng)
        }
    }

    override fun addToMap(mapView: MLRNMapView) {
        mMapView = mapView

        // If child was added before we had mMapView, add it to offscreen container now
        if (mChildView != null && !mChildView!!.isAttachedToWindow) {
            mMapView?.offscreenAnnotationViewContainer()?.addView(mChildView)
        }

        // The child view needs to complete layout in the offscreen container
        // before we can pass it to the MarkerView plugin. We'll do this in
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
        val mlrnMarkerView: MLRNMarkerView = this

        mMapView?.getMapAsync { mapLibreMap ->
            val latLng = GeoJSONUtils.toLatLng(mCoordinate)
            mMarkerViewManager = mMapView?.getMarkerViewManager(mapLibreMap)
            if (latLng != null && mChildView != null) {
                // Capture the measured dimensions before removing from offscreen container
                val measuredWidth = mChildView!!.width
                val measuredHeight = mChildView!!.height

                // Track dimensions to avoid unnecessary refreshes on layout change
                mLastWidth = measuredWidth
                mLastHeight = measuredHeight

                // Update cached offsets with new dimensions
                updateCachedAnchorOffset()
                updateCachedPixelOffset()

                // Remove from offscreen container before MarkerView plugin adds it to MapView
                mMapView?.offscreenAnnotationViewContainer()?.removeView(mChildView)

                // Set explicit layout params with measured dimensions to prevent
                // the view from expanding to fill parent when added to MapView
                mChildView!!.layoutParams = FrameLayout.LayoutParams(measuredWidth, measuredHeight)

                // Enable hardware acceleration for smoother position updates during map movement
                mChildView!!.setLayerType(View.LAYER_TYPE_HARDWARE, null)

                // Apply zIndex as translationZ for proper stacking order
                // React Native stores zIndex in ViewGroupManager's hash map on the MLRNMarkerView itself
                // (where the style={{zIndex: N}} prop is applied)
                mLastZIndex = ViewGroupManager.getViewZIndex(this@MLRNMarkerView)
                if (mLastZIndex != null) {
                    mChildView!!.translationZ = mLastZIndex!!.toFloat()
                }

                mMarkerView = MarkerView(latLng, mChildView!!)
            }
            mMarkerView?.setOnPositionUpdateListener(mlrnMarkerView)
            if (mMarkerView != null) {
                mMarkerViewManager?.addMarker(mMarkerView!!)
            }
        }
    }

    override fun onUpdate(pointF: PointF): PointF {
        // Use cached offsets for maximum performance during map movement
        // These are recalculated only when anchor, offset, or dimensions change
        return PointF(
            pointF.x - mCachedAnchorOffsetX + mCachedPixelOffsetX,
            pointF.y - mCachedAnchorOffsetY + mCachedPixelOffsetY
        )
    }

    override fun removeFromMap(mapView: MLRNMapView) {
        if (mMarkerView != null) {
            mMarkerViewManager?.removeMarker(mMarkerView!!)
            mMarkerView!!.setOnPositionUpdateListener(null)
            mMarkerView = null
            mMarkerViewManager = null
        }
        mChildView?.removeOnLayoutChangeListener(this)
        // Also remove from offscreen container if still there
        if (mChildView != null && !mAddedToMap) {
            mMapView?.offscreenAnnotationViewContainer()?.removeView(mChildView)
        }
        mAddedToMap = false
    }

    override fun onLayoutChange(v: View, left: Int, top: Int, right: Int, bottom: Int, oldLeft: Int, oldTop: Int,
                               oldRight: Int, oldBottom: Int) {
        if (left == 0 && top == 0 && right == 0 && bottom == 0) {
            return
        }

        val width = right - left
        val height = bottom - top

        // If not yet added to MarkerView plugin, try now that we have dimensions
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

        // Only process dimension changes for layout params and position refresh
        // This prevents unnecessary position recalculations that can cause visual shifting
        val dimensionsChanged = width != mLastWidth || height != mLastHeight
        if (!dimensionsChanged) {
            return
        }

        mLastWidth = width
        mLastHeight = height

        // Update cached anchor offset since it depends on dimensions
        updateCachedAnchorOffset()

        // Update layout params to match new dimensions
        mChildView?.layoutParams?.let { params ->
            params.width = width
            params.height = height
        }

        // Refresh position since anchor offset depends on dimensions
        refresh()
    }
}
