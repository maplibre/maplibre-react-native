package org.maplibre.reactnative.components.camera

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import org.maplibre.geojson.FeatureCollection
import org.maplibre.reactnative.components.AbstractEventEmitter
import org.maplibre.reactnative.utils.GeoJSONUtils

class MLRNCameraManager(private val mContext: ReactApplicationContext) :
    AbstractEventEmitter<MLRNCamera?>(
        mContext
    ) {
    override fun customEvents(): Map<String, String> {
        return HashMap()
    }

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createViewInstance(reactContext: ThemedReactContext): MLRNCamera {
        return MLRNCamera(reactContext, this)
    }

    @ReactProp(name = "stop")
    fun setStop(camera: MLRNCamera, map: ReadableMap?) {
        if (map != null) {
            val stop = CameraStop.fromReadableMap(mContext, map, null)
            camera.setStop(stop)
        }
    }

    @ReactProp(name = "defaultStop")
    fun setDefaultStop(camera: MLRNCamera, map: ReadableMap?) {
        if (map != null) {
            val stop = CameraStop.fromReadableMap(mContext, map, null)
            camera.setDefaultStop(stop)
        }
    }

    @ReactProp(name = "maxBounds")
    fun setMaxBounds(camera: MLRNCamera, value: String?) {
        if (value != null) {
            val collection = FeatureCollection.fromJson(value)
            camera.setMaxBounds(GeoJSONUtils.toLatLngBounds(collection))
        }
    }


    @ReactProp(name = "userTrackingMode")
    fun setUserTrackingMode(camera: MLRNCamera, userTrackingMode: Int) {
        camera.setUserTrackingMode(userTrackingMode)
        throw AssertionError("Unused code")
    }

    @ReactProp(name = "followZoomLevel")
    fun setZoomLevel(camera: MLRNCamera, zoomLevel: Double) {
        camera.setZoomLevel(zoomLevel)
    }

    @ReactProp(name = "followUserLocation")
    fun setFollowUserLocation(camera: MLRNCamera, value: Boolean) {
        camera.setFollowUserLocation(value)
    }

    @ReactProp(name = "followUserMode")
    fun setFollowUserMode(camera: MLRNCamera, value: String?) {
        camera.setFollowUserMode(value)
    }

    @ReactProp(name = "minZoomLevel")
    fun setMinZoomLevel(camera: MLRNCamera, value: Double) {
        camera.setMinZoomLevel(value)
    }

    @ReactProp(name = "maxZoomLevel")
    fun setMaxZoomLevel(camera: MLRNCamera, value: Double) {
        camera.setMaxZoomLevel(value)
    }

    @ReactProp(name = "followPitch")
    fun setFollowPitch(camera: MLRNCamera, value: Double) {
        camera.setFollowPitch(value)
    }

    companion object {
        const val REACT_CLASS: String = "MLRNCamera"
    }
}
