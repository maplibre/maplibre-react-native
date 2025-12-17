package org.maplibre.reactnative.events

import android.graphics.PointF
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import org.maplibre.android.geometry.LatLng
import org.maplibre.reactnative.utils.GeoJSONUtils

class MapPressEvent(
    surfaceId: Int,
    viewId: Int,
    private val internalEventName: String,
    private val latLng: LatLng,
    private val screenPoint: PointF,

    ) : Event<MapPressEvent>(surfaceId, viewId) {
    override fun getEventName() = internalEventName

    override fun getEventData(): WritableMap {
        return Arguments.createMap().apply {
            putArray("lngLat", GeoJSONUtils.fromLatLng(latLng))
            putArray("point", Arguments.createArray().apply {
                pushDouble(screenPoint.x.toDouble())
                pushDouble(screenPoint.y.toDouble())
            })
        }
    }
}
