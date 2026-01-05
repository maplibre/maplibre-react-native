package org.maplibre.reactnative.components.annotations;

import android.annotation.SuppressLint
import android.content.Context;
import android.graphics.PointF;
import android.graphics.Bitmap;
import android.view.View;

import org.maplibre.geojson.Point;
import org.maplibre.android.geometry.LatLng;
import org.maplibre.android.plugins.annotation.Symbol;
import org.maplibre.android.plugins.annotation.SymbolOptions;
import org.maplibre.android.maps.MapLibreMap;

import org.maplibre.reactnative.components.AbstractMapFeature;
import org.maplibre.reactnative.components.mapview.MLRNMapView;
import org.maplibre.reactnative.events.PointAnnotationClickEvent;
import org.maplibre.reactnative.events.PointAnnotationDragEvent;
import org.maplibre.reactnative.events.constants.EventTypes;
import org.maplibre.reactnative.utils.GeoJSONUtils;
import org.maplibre.reactnative.utils.BitmapUtils;

@SuppressLint("ViewConstructor")
class MLRNPointAnnotation(private val mContext: Context, private val mManager: MLRNPointAnnotationManager) : AbstractMapFeature(mContext), View.OnLayoutChangeListener {
    private var mAnnotation: Symbol? = null
    private var mMap: MapLibreMap? = null
    private var mMapView: MLRNMapView? = null

    private val mHasChildren = false

    private var mCoordinate: Point? = null

    private var mID: String? = null
    private val mTitle: String? = null
    private val mSnippet: String? = null

    private var mAnchor: FloatArray? = null
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

    override fun addView(childView: View, childPosition: Int) {
        if (childView is MLRNCallout) {
            mCalloutView = childView;
        } else {
            mChildView = childView;
        }
        childView.addOnLayoutChangeListener(this);
        mMapView?.offscreenAnnotationViewContainer()?.addView(childView)
    }

    override fun removeView(childView: View) {
        if (mChildView != null) {
            mMap?.getStyle { style ->
                mChildBitmapId?.let { style.removeImage(it) }
                mChildView = null;
                mCalloutView = null;
                mChildBitmap = null;
                mChildBitmapId = null;
                updateOptions();
            };
        }
        mMapView?.offscreenAnnotationViewContainer()?.removeView(childView)
    }

    override fun addToMap(mapView: MLRNMapView) {
        mMapView = mapView;
        mMap = mapView.mapLibreMap;
        makeMarker();

        if (mChildView != null) {
            if (!mChildView!!.isAttachedToWindow) {
                mMapView?.offscreenAnnotationViewContainer()?.addView(mChildView);
            }
            addBitmapToStyle(mChildBitmap, mChildBitmapId);
            updateOptions();
        }
        if (mCalloutView != null) {
            if (!mCalloutView!!.isAttachedToWindow) {
                mMapView?.offscreenAnnotationViewContainer()?.addView(mCalloutView);
            }
            addBitmapToStyle(mCalloutBitmap, mCalloutBitmapId);
        }
    }

    override fun removeFromMap(mapView: MLRNMapView) {
        val map = if (mMapView != null) mMapView else mapView;
        if (map == null) {
            return;
        }

        if (mAnnotation != null) {
            map.getSymbolManager().delete(mAnnotation);
        }
        if (mChildView != null) {
            map.offscreenAnnotationViewContainer()?.removeView(mChildView);
        }
        if (mCalloutView != null) {
            map.offscreenAnnotationViewContainer()?.removeView(mCalloutView);
        }
    }

    override fun onLayoutChange(v: View, left: Int, top: Int, right: Int, bottom: Int, oldLeft: Int,
                                oldTop: Int, oldRight: Int, oldBottom: Int) {
        if (left == 0 && top == 0 && right == 0 && bottom == 0) {
            return;
        }
        if (left != oldLeft || right != oldRight || top != oldTop || bottom != oldBottom) {
            refreshBitmap(v, left, top, right, bottom);
        }
    }

    private fun refreshBitmap(v: View, left: Int, top: Int, right: Int, bottom: Int) {
        val bitmap: Bitmap = BitmapUtils.viewToBitmap(v, left, top, right, bottom);
        val bitmapId: String = v.id.toString();
        addBitmapToStyle(bitmap, bitmapId);
        if (v is MLRNCallout) {
            mCalloutBitmap = bitmap;
            mCalloutBitmapId = bitmapId;
        } else {
            mChildBitmap = bitmap;
            mChildBitmapId = bitmapId;
            updateOptions();
        }
    }

    private fun refreshBitmap(v: View) {
        refreshBitmap(v, v.left, v.top, v.right, v.bottom);
    }

    fun getLatLng(): LatLng? {
        return GeoJSONUtils.toLatLng(mCoordinate);
    }

    fun getMapboxID(): Long = mAnnotation?.id ?: -1

    fun getID(): String? = mID;

    fun setID(id: String) {
        mID = id;
    }

    fun getCalloutView(): View? {
        return mCalloutView;
    }

    fun setCoordinate(point: Point) {
        mCoordinate = point;

        if (mAnnotation != null) {
            mAnnotation!!.latLng = GeoJSONUtils.toLatLng(point)!!;
            mMapView?.getSymbolManager()?.update(mAnnotation);
        }
        if (mCalloutSymbol != null) {
            mCalloutSymbol!!.latLng = GeoJSONUtils.toLatLng(point)!!;
            mMapView?.getSymbolManager()?.update(mCalloutSymbol);
        }
    }

    fun setAnchor(x: Float, y: Float) {
        mAnchor = floatArrayOf(x, y)

        if (mAnnotation != null) {
            updateAnchor();
            mMapView?.getSymbolManager()?.update(mAnnotation);
        }
    }

    fun setDraggable(draggable: Boolean) {
        mDraggable = draggable;
        if (mAnnotation != null) {
            mAnnotation!!.isDraggable = draggable;
            mMapView?.getSymbolManager()?.update(mAnnotation);
        }
    }

    fun getMarker(): Symbol? {
        return mAnnotation;
    }

    fun onSelect(shouldSendEvent: Boolean) {
        if (mCalloutView != null) {
            makeCallout();
        }
        if (shouldSendEvent) {
            mManager.handleEvent(makeEvent(true));
        }
    }

    fun onDeselect() {
        mManager.handleEvent(makeEvent(false));
        if (mCalloutSymbol != null) {
            mMapView?.getSymbolManager()?.delete(mCalloutSymbol);
        }
    }

    fun onDragStart() {
        val latLng = mAnnotation?.latLng;
        if (latLng != null) {
            mCoordinate = Point.fromLngLat(latLng.longitude, latLng.latitude);
        }
        mManager.handleEvent(makeDragEvent(EventTypes.ANNOTATION_DRAG_START));
    }

    public fun onDrag() {
        val latLng = mAnnotation?.latLng;
        if (latLng != null) {
            mCoordinate = Point.fromLngLat(latLng.longitude, latLng.latitude);
        }
        mManager.handleEvent(makeDragEvent(EventTypes.ANNOTATION_DRAG));
    }

    public fun onDragEnd() {
        val latLng = mAnnotation?.latLng;
        if (latLng != null) {
            mCoordinate = Point.fromLngLat(latLng.longitude, latLng.latitude);
        }
        mManager.handleEvent(makeDragEvent(EventTypes.ANNOTATION_DRAG_END));
    }

    public fun makeMarker() {
        val options = SymbolOptions()
            .withLatLng(GeoJSONUtils.toLatLng(mCoordinate))
            .withDraggable(mDraggable)
            .withIconSize(1.0f)
            .withSymbolSortKey(10.0f);
        val symbolManager = mMapView?.getSymbolManager();
        if (symbolManager != null) {
            mAnnotation = symbolManager.create(options);
            updateOptions();
        }
    }

    private fun updateOptions() {
        if (mAnnotation != null) {
            updateIconImage();
            updateAnchor();
            mMapView?.getSymbolManager()?.update(mAnnotation);
        }
    }

    private fun updateIconImage() {
        if (mChildView != null) {
            if (mChildBitmapId != null) {
                mAnnotation?.iconImage = mChildBitmapId;
            }
        } else {
            mAnnotation?.iconImage = MARKER_IMAGE_ID;
            mAnnotation?.iconAnchor = "bottom";
        }
    }

    private fun updateAnchor() {
        if (mAnchor != null && mChildView != null && mChildBitmap != null) {
            var w = mChildBitmap!!.width;
            var h = mChildBitmap!!.height;
            val scale = resources.displayMetrics.density;
            w = (w / scale).toInt();
            h = (h / scale).toInt();
            mAnnotation?.iconAnchor = "top-left";
            mAnnotation?.setIconOffset(PointF(w * mAnchor!![0] * -1, h * mAnchor!![1] * -1));
        }
    }

    private fun makeCallout() {
        var yOffset = -28f;
        if (mChildView != null) {
            if (mChildBitmap != null) {
                val scale = resources.displayMetrics.density;
                var h = mChildBitmap!!.height / 2;
                h = (h / scale).toInt();
                yOffset = (h * -1).toFloat();
            }
        }
        val options = SymbolOptions()
            .withLatLng(GeoJSONUtils.toLatLng(mCoordinate))
            .withIconImage(mCalloutBitmapId)
            .withIconSize(1.0f)
            .withIconAnchor("bottom")
            .withIconOffset(floatArrayOf(0f, yOffset).toTypedArray())
            .withSymbolSortKey(11.0f)
            .withDraggable(false);
        val symbolManager = mMapView?.getSymbolManager();
        if (symbolManager != null) {
            mCalloutSymbol = symbolManager.create(options);
        }
    }

    private fun addBitmapToStyle(bitmap: Bitmap?, bitmapId: String?) {
        if (mMap != null && bitmapId != null && bitmap != null) {
            mMap!!.getStyle { style ->
                style.addImage(bitmapId, bitmap);
            }
        }
    }

    private fun makeEvent(isSelect: Boolean): PointAnnotationClickEvent {
        val type = if (isSelect) EventTypes.ANNOTATION_SELECTED else EventTypes.ANNOTATION_DESELECTED;
        val latLng = GeoJSONUtils.toLatLng(mCoordinate);
        val screenPos = getScreenPosition(latLng!!);

        return PointAnnotationClickEvent(this, latLng, screenPos!!, type);
    }

    private fun  makeDragEvent(type: String): PointAnnotationDragEvent {
        val latLng = GeoJSONUtils.toLatLng(mCoordinate);
        val screenPos = getScreenPosition(latLng!!);
        return PointAnnotationDragEvent(this, latLng, screenPos!!, type);
    }

    private fun getDisplayDensity(): Float {
        return mContext.resources.displayMetrics.density;
    }

    private fun getScreenPosition(latLng: LatLng): PointF? {
        val screenPos = mMap?.projection?.toScreenLocation(latLng);
        val density = getDisplayDensity();
        screenPos?.x /= density;
        screenPos?.y /= density;
        return screenPos;
    }

    fun refresh() {
        mChildView?.let { refreshBitmap(it) }
    }
}
