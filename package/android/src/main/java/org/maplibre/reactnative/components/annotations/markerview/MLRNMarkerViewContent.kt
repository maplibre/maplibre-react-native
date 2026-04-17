package org.maplibre.reactnative.components.annotations.markerview

import android.content.Context
import android.view.ViewGroup
import com.facebook.react.views.view.ReactViewGroup

/**
 * Based on rnmapbox/maps implementation:
 * https://github.com/rnmapbox/maps/blob/512c50865f322fa89e0d20066b4a0fb10f080cb5/android/src/main/java/com/rnmapbox/rnmbx/components/annotation/RNMBXMarkerViewContent.kt
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
     * Returns the authoritative content size from the first child view.
     * The child is laid out by React Native before this wrapper is added to the map,
     * so its dimensions are reliable even before this view's own layout pass runs.
     */
    fun getContentSize(): Pair<Float, Float> {
        val child = getChildAt(0) ?: return Pair(width.toFloat(), height.toFloat())
        val w = if (child.width > 0) child.width else width
        val h = if (child.height > 0) child.height else height
        return Pair(w.toFloat(), h.toFloat())
    }
}

private fun ViewGroup.allowRenderingOutside() {
    clipChildren = false
    clipToPadding = false
}
