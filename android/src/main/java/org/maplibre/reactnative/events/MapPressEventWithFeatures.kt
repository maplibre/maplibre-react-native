package org.maplibre.reactnative.events

import android.graphics.PointF
import com.facebook.react.bridge.WritableMap
import org.maplibre.android.geometry.LatLng
import org.maplibre.geojson.Feature
import org.maplibre.reactnative.utils.GeoJSONUtils

class MapPressEventWithFeatures(
    surfaceId: Int,
    viewId: Int,
    internalEventName: String,
    latLng: LatLng,
    screenPoint: PointF,
    private val features: List<Feature>
) : MapPressEvent(surfaceId, viewId, internalEventName, latLng, screenPoint) {

    override fun getEventData(): WritableMap {
        return super.getEventData().apply {
            putArray("features", GeoJSONUtils.fromFeatureList(features))
        }
    }
}

