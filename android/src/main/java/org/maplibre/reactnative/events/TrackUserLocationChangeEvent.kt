package org.maplibre.reactnative.events

import android.view.View
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import org.maplibre.reactnative.events.constants.EventKeys
import org.maplibre.reactnative.events.constants.EventTypes
import org.maplibre.reactnative.location.TrackUserLocationMode

class TrackUserLocationChangeEvent(
    surfaceId: Int,
    viewId: Int,
    private val trackUserLocationMode: Int
) :
    Event<TrackUserLocationChangeEvent>(surfaceId, viewId) {
    override fun getEventName() = "onTrackUserLocationChange"

    override fun getEventData(): WritableMap? {
        return Arguments.createMap().apply {
            putString("trackUserLocation", TrackUserLocationMode.toString(trackUserLocationMode))
        }
    }
}
