package org.maplibre.reactnative.components.mapview

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import org.maplibre.android.maps.MapLibreMapOptions

@ReactModule(name = MLRNAndroidTextureMapViewManager.REACT_CLASS)
class MLRNAndroidTextureMapViewManager(
    context: ReactApplicationContext,
) : MLRNMapViewManager(context) {
    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(themedReactContext: ThemedReactContext): MLRNAndroidTextureMapView {
        val options = MapLibreMapOptions.createFromAttributes(themedReactContext)
        options.textureMode(true)

        return MLRNAndroidTextureMapView(themedReactContext, options)
    }

    companion object {
        const val LOG_TAG: String = "MLRNAndroidTextureMapViewManager"
        const val REACT_CLASS: String = "MLRNAndroidTextureMapView"
    }
}
