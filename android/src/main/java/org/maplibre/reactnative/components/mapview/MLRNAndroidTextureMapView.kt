package org.maplibre.reactnative.components.mapview

import android.content.Context
import android.util.AttributeSet
import org.maplibre.android.maps.MapLibreMapOptions

class MLRNAndroidTextureMapView(
    context: Context,
    options: MapLibreMapOptions?,
) : MLRNMapView(context, options) {
    constructor(context: Context) : this(context, options = null)

    @Suppress("UNUSED_PARAMETER")
    constructor(context: Context, attrs: AttributeSet?) : this(context, options = null)

    @Suppress("UNUSED_PARAMETER")
    constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : this(
        context,
        options = null,
    )

    companion object {
        const val LOG_TAG: String = "MLRNAndroidTextureMapView"
    }
}
