package org.maplibre.reactnative.events

import android.graphics.PointF
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import org.maplibre.android.geometry.LatLng
import org.maplibre.reactnative.utils.GeoJSONUtils

class PointAnnotationEvent(
    surfaceId: Int,
    viewId: Int,
    private val internalEventName: String,
    private val annotationId: String?,
    private val latLng: LatLng,
    private val screenPoint: PointF,
) : Event<PointAnnotationEvent>(surfaceId, viewId) {
    override fun getEventName() = internalEventName

    override fun getEventData(): WritableMap =
        Arguments.createMap().apply {
            putString("id", annotationId ?: "")
            putArray("lngLat", GeoJSONUtils.fromLatLng(latLng))
            putArray(
                "point",
                Arguments.createArray().apply {
                    pushDouble(screenPoint.x.toDouble())
                    pushDouble(screenPoint.y.toDouble())
                },
            )
        }
}
