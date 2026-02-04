package org.maplibre.reactnative.components

import android.view.ViewGroup
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.common.UIManagerType
import com.facebook.react.uimanager.events.EventDispatcher
import org.maplibre.reactnative.events.IEvent

abstract class AbstractEventEmitter<T : ViewGroup>(
    private val reactContext: ReactApplicationContext,
) : ViewGroupManager<T>() {
    private val mRateLimitedEvents: MutableMap<String?, Long?> = HashMap()
    private var mEventDispatcher: EventDispatcher? = null

    fun handleEvent(event: IEvent) {
        val eventCacheKey = getEventCacheKey(event)

        // fail safe to protect bridge from being spammed
        if (shouldDropEvent(eventCacheKey, event)) {
            return
        }

        mRateLimitedEvents.put(eventCacheKey, System.currentTimeMillis())
        mEventDispatcher!!.dispatchEvent(
            AbstractEvent(
                event.getID(),
                event.getKey(),
                event.canCoalesce(),
                event.toJSON(),
            ),
        )
    }

    override fun addEventEmitters(
        context: ThemedReactContext,
        view: T,
    ) {
        mEventDispatcher =
            UIManagerHelper.getUIManager(context, UIManagerType.Companion.FABRIC)!!.eventDispatcher
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String?, Any?>? {
        val events = customEvents()

        if (events == null) {
            return null
        }

        val exportedEvents: MutableMap<String?, Any?> = HashMap<String?, Any?>()

        for (event in events.entries) {
            exportedEvents.put(
                event.key,
                MapBuilder.of<String?, String?>("registrationName", event.value!!),
            )
        }

        return exportedEvents
    }

    abstract fun customEvents(): Map<String, String>?

    private fun shouldDropEvent(
        cacheKey: String?,
        event: IEvent,
    ): Boolean {
        val lastEventTimestamp = mRateLimitedEvents.get(cacheKey)
        return lastEventTimestamp != null && (event.getTimestamp() - lastEventTimestamp) <= BRIDGE_TIMEOUT_MS
    }

    private fun getEventCacheKey(event: IEvent): String = String.format("%s-%s", event.getKey(), event.getType())

    companion object {
        private const val BRIDGE_TIMEOUT_MS = 10.0
    }
}
