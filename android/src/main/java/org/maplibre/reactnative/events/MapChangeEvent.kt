package org.maplibre.reactnative.events

import android.view.View
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import org.maplibre.reactnative.events.constants.EventKeys

class MapChangeEvent @JvmOverloads constructor(
    view: View?,
    eventType: String?,
    private val mPayload: WritableMap = Arguments.createMap()
) : AbstractEvent(view, eventType) {
    override fun getKey(): String {
        return EventKeys.MAP_ONCHANGE
    }

    override fun getPayload(): WritableMap {
        // TODO
        val payloadClone = Arguments.createMap()
        payloadClone.merge(mPayload)
        return payloadClone
    }

    override fun canCoalesce(): Boolean {
        // Make sure EventDispatcher never merges EventKeys.MAP_ONCHANGE events.
        // This event name is used to emit events with different
        // org.maplibre.reactnative.events.constants.EventTypes which are dispatched separately on
        // the JS side
        return false
    }
}
