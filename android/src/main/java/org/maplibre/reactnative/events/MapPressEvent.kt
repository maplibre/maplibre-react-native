package org.maplibre.reactnative.events

import android.graphics.PointF
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import org.maplibre.android.geometry.LatLng

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
            putDouble("longitude", latLng.longitude)
            putDouble("latitude", latLng.latitude)
            putDouble("locationX", screenPoint.x.toDouble())
            putDouble("locationY", screenPoint.y.toDouble())
        }
    }
}
