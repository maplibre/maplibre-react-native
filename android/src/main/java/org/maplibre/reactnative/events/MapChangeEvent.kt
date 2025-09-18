package org.maplibre.reactnative.events

import android.view.View
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import org.maplibre.reactnative.events.constants.EventKeys

class MapChangeEvent(
    surfaceId: Int,
    viewId: Int,
    private val eventName: String,
    private val eventData: WritableMap = Arguments.createMap()
) : Event<MapChangeEvent>(surfaceId, viewId) {
    override fun getEventName() = eventName

    override fun getEventData(): WritableMap {
        return eventData
    }
}
