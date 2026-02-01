package org.maplibre.reactnative.components.annotations.markerview

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.PointF
import android.view.View
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
        this.refresh()
    }

    fun setOffset(x: Float, y: Float) {
        mOffset = floatArrayOf(x, y)
        this.refresh()
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
                // Remove from offscreen container before MarkerView plugin adds it to MapView
                mMapView?.offscreenAnnotationViewContainer()?.removeView(mChildView)
                mMarkerView = MarkerView(latLng, mChildView!!)
            }
            mMarkerView?.setOnPositionUpdateListener(mlrnMarkerView)
            if (mMarkerView != null) {
                mMarkerViewManager?.addMarker(mMarkerView!!)
            }
        }
    }

    override fun onUpdate(pointF: PointF): PointF {
        var x = pointF.x
        var y = pointF.y

        // Apply anchor offset (anchor is a percentage of view dimensions)
        if (mAnchor != null && mChildView != null) {
            x -= mChildView!!.width * mAnchor!![0]
            y -= mChildView!!.height * mAnchor!![1]
        }

        // Apply pixel offset
        if (mOffset != null) {
            val scale = resources.displayMetrics.density
            x += mOffset!![0] * scale
            y += mOffset!![1] * scale
        }

        return PointF(x, y)
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
        if (left != oldLeft || right != oldRight || top != oldTop || bottom != oldBottom) {
            // If not yet added to MarkerView plugin, try now that we have dimensions
            if (!mAddedToMap) {
                tryAddToMarkerViewManager()
            } else {
                refresh()
            }
        }
    }
}
