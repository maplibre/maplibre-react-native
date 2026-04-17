package org.maplibre.reactnative.components.mapview.helpers

class CameraChangeTracker {
    private var reason: Int = EMPTY
    var isAnimating: Boolean = false

    fun setReason(reason: Int) {
        this.reason = reason
    }

    val isUserInteraction: Boolean
        get() = reason == USER_GESTURE || reason == DEVELOPER_ANIMATION

    val isAnimated: Boolean
        get() = reason == DEVELOPER_ANIMATION || reason == SDK_ANIMATION

    val isEmpty: Boolean
        get() = reason == EMPTY

    companion object {
        const val EMPTY: Int = -1
        const val USER_GESTURE: Int = 1
        const val DEVELOPER_ANIMATION: Int = 2
        const val SDK_ANIMATION: Int = 3
    }
}
