package org.maplibre.reactnative.events

import android.view.View
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import org.maplibre.reactnative.events.constants.EventKeys
import org.maplibre.reactnative.events.constants.EventTypes
import org.maplibre.reactnative.location.TrackUserLocationMode

class MapUserTrackingModeEvent(view: View?, private val mUserTrackingMode: Int) :
    AbstractEvent(view, EventTypes.MAP_USER_TRACKING_MODE_CHANGE) {
    override fun getKey(): String {
        return EventKeys.MAP_USER_TRACKING_MODE_CHANGE
    }

    override fun getPayload(): WritableMap {
        val payload = Arguments.createMap()
        payload.putBoolean("followUserLocation", mUserTrackingMode != TrackUserLocationMode.NONE)
        payload.putString("followUserMode", TrackUserLocationMode.toString(mUserTrackingMode))

        return payload
    }
}
