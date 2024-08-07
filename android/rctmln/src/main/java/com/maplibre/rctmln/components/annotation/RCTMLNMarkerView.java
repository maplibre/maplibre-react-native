package com.maplibre.rctmln.components.annotation;

import android.content.Context;
import android.graphics.PointF;
import android.view.View;

import androidx.annotation.NonNull;

import org.maplibre.geojson.Point;
import org.maplibre.android.maps.MapLibreMap;
import org.maplibre.android.maps.OnMapReadyCallback;
import com.maplibre.rctmln.components.AbstractMapFeature;
import com.maplibre.rctmln.components.mapview.RCTMLNMapView;
import com.maplibre.rctmln.utils.GeoJSONUtils;

public class RCTMLNMarkerView extends AbstractMapFeature implements MarkerView.OnPositionUpdateListener, View.OnLayoutChangeListener {
    private RCTMLNMarkerViewManager mManager;
    private RCTMLNMapView mMapView;

    private View mChildView;

    private MarkerViewManager mMarkerViewManager;

    private MarkerView mMarkerView;
    private Point mCoordinate;
    private Float[] mAnchor;


    public RCTMLNMarkerView(Context context, RCTMLNMarkerViewManager manager) {
        super(context);
        mManager = manager;
    }

    @Override
    public void addView(View childView, int childPosition) {
        mChildView = childView;
    }

    public void setCoordinate(Point point) {
        mCoordinate = point;

        if (mMarkerView != null) {
            mMarkerView.setLatLng(GeoJSONUtils.toLatLng(point));
        }
    }

    public void setAnchor(float x, float y) {
        mAnchor = new Float[]{x, y};
        refresh();
    }

    public void refresh() {
        // this will cause position to be recalculated
        if (mMarkerView != null) {
            mMarkerView.setLatLng(GeoJSONUtils.toLatLng(mCoordinate));
        }
    }

    @Override
    public void addToMap(RCTMLNMapView mapView) {
        mMapView = mapView;

        final RCTMLNMarkerView rctmlnMarkerView = this;

        mMapView.getMapAsync(
            new OnMapReadyCallback() {
                @Override
                public void onMapReady(@NonNull MapLibreMap mapLibreMap) {
                    mMarkerViewManager = mMapView.getMarkerViewManager(mapLibreMap);

                    if (mChildView != null) {
                        mMarkerView = new MarkerView(GeoJSONUtils.toLatLng(mCoordinate), mChildView);
                        mMarkerView.setOnPositionUpdateListener(rctmlnMarkerView);
                        mChildView.addOnLayoutChangeListener(rctmlnMarkerView);
                        mMarkerViewManager.addMarker(mMarkerView);
                    }
                }
            }
        );
    }

    @Override
    public PointF onUpdate(PointF pointF) {
        if (mAnchor != null) {
            return new PointF(
                    pointF.x - mChildView.getWidth() * mAnchor[0],
                    pointF.y - mChildView.getHeight() * mAnchor[1]
                    );
        }
        return pointF;
    }

    @Override
    public void removeFromMap(RCTMLNMapView mapView) {
        if (mMarkerView != null) {
            mMarkerViewManager.removeMarker(mMarkerView);
            mChildView.removeOnLayoutChangeListener(this);
            mMarkerView.setOnPositionUpdateListener(null);
            mMarkerView = null;
            mMarkerViewManager = null;
        }
    }

    @Override
    public void onLayoutChange(View v, int left, int top, int right, int bottom, int oldLeft, int oldTop,
                               int oldRight, int oldBottom) {
        if (left != oldLeft || right != oldRight || top != oldTop || bottom != oldBottom) {
            refresh();
        }
    }
}

