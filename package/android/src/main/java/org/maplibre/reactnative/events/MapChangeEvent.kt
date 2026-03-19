package org.maplibre.reactnative.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class MapChangeEvent(
    surfaceId: Int,
    viewId: Int,
    private val internalEventName: String,
    private val eventData: WritableMap = Arguments.createMap(),
) : Event<MapChangeEvent>(surfaceId, viewId) {
    override fun getEventName() = internalEventName

    override fun getEventData(): WritableMap = eventData
}
