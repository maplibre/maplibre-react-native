package org.maplibre.reactnative.components.camera.constants

import androidx.annotation.IntDef

object CameraEasing {
    const val NONE: Int = 0
    const val LINEAR: Int = 1
    const val EASE: Int = 2
    const val FLY: Int = 3

    @IntDef(NONE, LINEAR, EASE, FLY)
    @Retention(AnnotationRetention.SOURCE)
    annotation class Easing

    fun fromString(value: String?): Int =
        when (value) {
            "none" -> NONE
            "linear" -> LINEAR
            "ease" -> EASE
            "fly" -> FLY
            else -> NONE
        }
}
