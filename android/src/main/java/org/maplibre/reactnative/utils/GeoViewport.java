package org.maplibre.reactnative.utils;

import android.graphics.PointF;

import org.maplibre.android.geometry.LatLng;
import org.maplibre.android.geometry.LatLngBounds;
import org.maplibre.android.geometry.VisibleRegion;

/**
 * Ported from https://github.com/mapbox/geo-viewport/blob/master/index.js
 * This port only assumes we will have 512 vector tile sizes
 */

public class GeoViewport {
    private static SphericalMercator sphericalMercator = new SphericalMercator();

    public static VisibleRegion getRegion(LatLng centerCoord, int zoomLevel, int viewportWidth, int viewportHeight) {
        PointF px = sphericalMercator.getPX(centerCoord, zoomLevel);

        LatLng tl = sphericalMercator.getLatLng(new PointF(
                px.x - (viewportWidth / 2),
                px.y - (viewportHeight / 2)
        ), zoomLevel);

        LatLng br = sphericalMercator.getLatLng(new PointF(
                px.x + (viewportWidth / 2),
                px.y + (viewportHeight / 2)
        ), zoomLevel);

        LatLng farLeft = tl;
        LatLng farRight = new LatLng(tl.getLatitude(), br.getLongitude());
        LatLng nearLeft = new LatLng(br.getLatitude(), tl.getLongitude());
        LatLng nearRight = br;

        return new VisibleRegion(farLeft, farRight, nearLeft, nearRight, null);
    }
}
