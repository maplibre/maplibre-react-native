package org.maplibre.reactnative.components.camera.constants

import androidx.annotation.IntDef

object CameraMode {
    const val FLIGHT: Int = 1
    const val EASE: Int = 2
    const val LINEAR: Int = 3
    const val NONE: Int = 4

    @IntDef(FLIGHT, EASE, LINEAR, NONE)
    @Retention(AnnotationRetention.SOURCE)
    annotation class Mode
}
