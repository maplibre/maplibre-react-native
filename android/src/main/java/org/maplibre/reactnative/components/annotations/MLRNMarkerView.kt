package org.maplibre.reactnative.components.annotations

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

    override fun addView(childView: View, childPosition: Int) {
        mChildView = childView
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

    fun setAllowOverlap(allowOverlap: Boolean) {
        // Not implemented for Android MarkerView
    }

    fun setIsSelected(isSelected: Boolean) {
        // Not implemented for Android MarkerView
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

        val mlrnMarkerView: MLRNMarkerView = this

        mMapView?.getMapAsync { mapLibreMap ->
            val latLng = GeoJSONUtils.toLatLng(mCoordinate)
            mMarkerViewManager = mMapView?.getMarkerViewManager(mapLibreMap)
            if (latLng != null && mChildView != null) {
                mMarkerView = MarkerView(latLng, mChildView!!)
            }
            mMarkerView?.setOnPositionUpdateListener(mlrnMarkerView)
            mChildView?.addOnLayoutChangeListener(mlrnMarkerView)
            if (mMarkerView != null) {
                mMarkerViewManager?.addMarker(mMarkerView!!)
            }
        }
    }

    override fun onUpdate(pointF: PointF): PointF {
        if (mAnchor != null && mChildView != null) {
            return PointF(
                pointF.x - mChildView!!.width * mAnchor!![0],
                pointF.y - mChildView!!.height * mAnchor!![1]
            )
        }
        return pointF
    }

    override fun removeFromMap(mapView: MLRNMapView) {
        if (mMarkerView != null) {
            mMarkerViewManager?.removeMarker(mMarkerView!!)
            mChildView?.removeOnLayoutChangeListener(this)
            mMarkerView!!.setOnPositionUpdateListener(null)
            mMarkerView = null
            mMarkerViewManager = null
        }
    }

    override fun onLayoutChange(v: View, left: Int, top: Int, right: Int, bottom: Int, oldLeft: Int, oldTop: Int,
                               oldRight: Int, oldBottom: Int) {
        if (left != oldLeft || right != oldRight || top != oldTop || bottom != oldBottom) {
            refresh()
        }
    }
}
