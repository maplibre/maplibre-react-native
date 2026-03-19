package org.maplibre.reactnative.components.camera

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.MLRNCameraManagerDelegate
import com.facebook.react.viewmanagers.MLRNCameraManagerInterface
import org.maplibre.reactnative.location.TrackUserLocationMode
import org.maplibre.reactnative.utils.GeoJSONUtils

@ReactModule(name = MLRNCameraManager.REACT_CLASS)
class MLRNCameraManager(
    private val context: ReactApplicationContext,
) : ViewGroupManager<MLRNCamera>(),
    MLRNCameraManagerInterface<MLRNCamera> {
    private val delegate: MLRNCameraManagerDelegate<MLRNCamera, MLRNCameraManager> =
        MLRNCameraManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<MLRNCamera> = delegate

    companion object {
        const val REACT_CLASS: String = "MLRNCamera"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): MLRNCamera = MLRNCamera(reactContext)

    @ReactProp(name = "stop")
    override fun setStop(
        camera: MLRNCamera,
        value: ReadableMap?,
    ) {
        camera.setStop(value)
    }

    @ReactProp(name = "initialViewState")
    override fun setInitialViewState(
        camera: MLRNCamera,
        value: ReadableMap?,
    ) {
        if (value != null && !camera.hasInitialViewState()) {
            val stop = CameraStop.fromReadableMap(context, value, null)
            camera.setInitialViewState(stop)
        }
    }

    @ReactProp(name = "minZoom")
    override fun setMinZoom(
        camera: MLRNCamera,
        value: Double,
    ) {
        camera.setMinZoomLevel(value)
    }

    @ReactProp(name = "maxZoom")
    override fun setMaxZoom(
        camera: MLRNCamera,
        value: Double,
    ) {
        camera.setMaxZoomLevel(value)
    }

    @ReactProp(name = "maxBounds")
    override fun setMaxBounds(
        camera: MLRNCamera,
        value: ReadableArray?,
    ) {
        camera.setMaxBounds(GeoJSONUtils.toLatLngBounds(value))
    }

    @ReactProp(name = "trackUserLocation")
    override fun setTrackUserLocation(
        camera: MLRNCamera,
        value: String?,
    ) {
        camera.setTrackUserLocation(TrackUserLocationMode.fromString(value))
    }
}
