package org.maplibre.reactnative.components.camera

import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.MLRNCameraManagerDelegate
import com.facebook.react.viewmanagers.MLRNCameraManagerInterface
import org.maplibre.geojson.FeatureCollection
import org.maplibre.reactnative.components.AbstractEventEmitter
import org.maplibre.reactnative.utils.GeoJSONUtils


@ReactModule(name = MLRNCameraManager.REACT_CLASS)
class MLRNCameraManager(private val mContext: ReactApplicationContext) :
    AbstractEventEmitter<MLRNCamera>(
        mContext
    ), MLRNCameraManagerInterface<MLRNCamera> {
    private val delegate: MLRNCameraManagerDelegate<MLRNCamera, MLRNCameraManager> =
        MLRNCameraManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<MLRNCamera> = delegate

    companion object {
        const val REACT_CLASS: String = "MLRNCamera"
    }

    override fun getName(): String = REACT_CLASS


    override fun customEvents(): Map<String, String> {
        return HashMap()
    }

    override fun createViewInstance(reactContext: ThemedReactContext): MLRNCamera {
        return MLRNCamera(reactContext, this)
    }

    @ReactProp(name = "stop")
    override fun setStop(camera: MLRNCamera, map: Dynamic) {
        if (!map.isNull) {
            camera.setStop(map.asMap())
        }
    }

    @ReactProp(name = "defaultStop")
    override fun setDefaultStop(camera: MLRNCamera, map: Dynamic) {
        if (!map.isNull) {
            val stop = CameraStop.fromReadableMap(mContext, map.asMap(), null)
            camera.setDefaultStop(stop)
        }
    }

    @ReactProp(name = "maxBounds")
    override fun setMaxBounds(camera: MLRNCamera, value: String?) {
        if (value != null) {
            val collection = FeatureCollection.fromJson(value)
            camera.setMaxBounds(GeoJSONUtils.toLatLngBounds(collection))
        }
    }

    @ReactProp(name = "userTrackingMode")
    override fun setUserTrackingMode(camera: MLRNCamera, userTrackingMode: Int) {
        camera.setUserTrackingMode(userTrackingMode)
        throw AssertionError("Unused code")
    }

    @ReactProp(name = "followZoomLevel")
    override fun setFollowZoomLevel(camera: MLRNCamera, zoomLevel: Double) {
        camera.setZoomLevel(zoomLevel)
    }

    @ReactProp(name = "followUserLocation")
    override fun setFollowUserLocation(camera: MLRNCamera, value: Boolean) {
        camera.setFollowUserLocation(value)
    }

    @ReactProp(name = "followUserMode")
    override fun setFollowUserMode(camera: MLRNCamera, value: String?) {
        camera.setFollowUserMode(value)
    }

    override fun setFollowHeading(camera: MLRNCamera, value: Double) {
        // TODO: Not implemented?
    }

    override fun setFollowPadding(camera: MLRNCamera, value: Dynamic) {
        // TODO: Not implemented?
    }

    @ReactProp(name = "followPitch")
    override fun setFollowPitch(camera: MLRNCamera, value: Double) {
        camera.setFollowPitch(value)
    }

    @ReactProp(name = "zoomLevel")
    override fun setZoomLevel(camera: MLRNCamera, zoomLevel: Double) {
        camera.setZoomLevel(zoomLevel)
    }

    @ReactProp(name = "minZoomLevel")
    override fun setMinZoomLevel(camera: MLRNCamera, value: Double) {
        camera.setMinZoomLevel(value)
    }

    @ReactProp(name = "maxZoomLevel")
    override fun setMaxZoomLevel(camera: MLRNCamera, value: Double) {
        camera.setMaxZoomLevel(value)
    }

    override fun setAnimationDuration(camera: MLRNCamera, value: Double) {
        // iOS only, no-op on Android
    }

    override fun setAnimationMode(camera: MLRNCamera, value: String?) {
        // iOS only, no-op on Android
    }
}
