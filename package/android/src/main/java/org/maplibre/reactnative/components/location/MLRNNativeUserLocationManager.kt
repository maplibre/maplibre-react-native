package org.maplibre.reactnative.components.location

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.MLRNNativeUserLocationManagerDelegate
import com.facebook.react.viewmanagers.MLRNNativeUserLocationManagerInterface
import org.maplibre.android.location.modes.RenderMode

@ReactModule(name = MLRNNativeUserLocationManager.REACT_CLASS)
class MLRNNativeUserLocationManager :
    ViewGroupManager<MLRNNativeUserLocation>(),
    MLRNNativeUserLocationManagerInterface<MLRNNativeUserLocation> {
    private val delegate: MLRNNativeUserLocationManagerDelegate<MLRNNativeUserLocation, MLRNNativeUserLocationManager> =
        MLRNNativeUserLocationManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<MLRNNativeUserLocation> = delegate

    companion object {
        const val REACT_CLASS: String = "MLRNNativeUserLocation"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(context: ThemedReactContext): MLRNNativeUserLocation = MLRNNativeUserLocation(context)

    @ReactProp(name = "mode")
    override fun setMode(
        userLocation: MLRNNativeUserLocation,
        mode: String?,
    ) {
        if ("heading".equals(mode, ignoreCase = true)) {
            userLocation.setRenderMode(RenderMode.COMPASS)
        } else if ("course".equals(mode, ignoreCase = true)) {
            userLocation.setRenderMode(RenderMode.GPS)
        } else {
            userLocation.setRenderMode(RenderMode.NORMAL)
        }
    }

    @ReactProp(name = "androidPreferredFramesPerSecond")
    override fun setAndroidPreferredFramesPerSecond(
        userLocation: MLRNNativeUserLocation,
        preferredFramesPerSecond: Int,
    ) {
        userLocation.setPreferredFramesPerSecond(preferredFramesPerSecond)
    }
}
