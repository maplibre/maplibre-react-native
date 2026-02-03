package org.maplibre.reactnative.components.annotations.markerview

import android.content.Context
import android.view.MotionEvent
import android.view.ViewGroup
import com.facebook.react.views.view.ReactViewGroup

/**
 * Custom ReactViewGroup that allows content to render outside its bounds (#642).
 * This is used as a wrapper for MarkerView content to prevent clipping.
 *
 * Based on rnmapbox/maps implementation:
 * https://github.com/rnmapbox/maps/blob/main/android/src/main/java/com/rnmapbox/rnmbx/components/annotation/RNMBXMarkerViewContent.kt
 */
class MLRNMarkerViewContent(context: Context) : ReactViewGroup(context) {

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
     * Request that the parent (MapView) not intercept touch events when touching marker content.
     * This allows TouchableOpacity, Pressable, etc. to receive touch events properly (#557, #1018).
     */
    override fun onInterceptTouchEvent(event: MotionEvent): Boolean {
        // Request that parent (MapView) doesn't intercept this touch sequence
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
