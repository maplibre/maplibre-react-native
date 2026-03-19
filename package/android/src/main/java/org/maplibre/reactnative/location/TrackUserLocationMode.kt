package org.maplibre.reactnative.location

import org.maplibre.android.location.modes.CameraMode

object TrackUserLocationMode {
    const val NONE: Int = 0
    const val DEFAULT: Int = 1
    const val HEADING: Int = 2
    const val COURSE: Int = 3

    @CameraMode.Mode
    fun getCameraMode(mode: Int): Int =
        when (mode) {
            DEFAULT -> CameraMode.TRACKING
            HEADING -> CameraMode.TRACKING_COMPASS
            COURSE -> CameraMode.TRACKING_GPS
            else -> CameraMode.NONE
        }

    fun isUserGesture(reason: Int): Boolean {
        return reason == 1 || reason == 2 // user gesture or animation
    }

    fun toString(value: Int): String? =
        when (value) {
            DEFAULT -> "default"
            HEADING -> "heading"
            COURSE -> "course"
            else -> null
        }

    fun fromString(value: String?): Int =
        when (value) {
            "default" -> DEFAULT
            "heading" -> HEADING
            "course" -> COURSE
            else -> NONE
        }
}
