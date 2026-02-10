package org.maplibre.reactnative.components.annotations.markerview

import android.content.Context
import android.view.MotionEvent
import android.view.ViewGroup
import com.facebook.react.views.view.ReactViewGroup

/**
 * Custom ReactViewGroup that allows content to render outside its bounds (#642).
 * This is used as a wrapper for Marker content to prevent clipping.
 *
 * Based on rnmapbox/maps implementation:
 * https://github.com/rnmapbox/maps/blob/main/android/src/main/java/com/rnmapbox/rnmbx/components/annotation/RNMBXMarkerViewContent.kt
 */
class MLRNMarkerViewContent(
    context: Context,
) : ReactViewGroup(context) {
    init {
        allowRenderingOutside()
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        configureParentClipping()
    }

    private fun configureParentClipping() {
        val parent = parent
        if (parent is ViewGroup) {
            parent.allowRenderingOutside()
        }
    }

    /**
     * Prevent the parent (MapView) from intercepting touch events before it gets a chance.
     * dispatchTouchEvent fires earlier than onInterceptTouchEvent in the Android touch dispatch
     * chain, ensuring the disallow flag is set before the MapView's onInterceptTouchEvent runs.
     * This fixes onPress not firing reliably on real devices (#557, #1018).
     */
    override fun dispatchTouchEvent(event: MotionEvent): Boolean {
        parent?.requestDisallowInterceptTouchEvent(true)
        return super.dispatchTouchEvent(event)
    }

    override fun onInterceptTouchEvent(event: MotionEvent): Boolean {
        parent?.requestDisallowInterceptTouchEvent(true)
        return super.onInterceptTouchEvent(event)
    }
}

/**
 * Extension function to disable all forms of clipping on a ViewGroup
 */
private fun ViewGroup.allowRenderingOutside() {
    clipChildren = false
    clipToPadding = false
}
