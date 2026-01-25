package org.maplibre.reactnative.utils

class ImageEntry(
    @JvmField var uri: String?,
    scale: Double?,
    @JvmField var sdf: Boolean,
) {
    @JvmField
    var scale: Double = scale ?: DEFAULT_SCALE

    companion object {
        const val DEFAULT_SCALE: Double = 1.0
    }
}
