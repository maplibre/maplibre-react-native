package org.maplibre.reactnative.components.camera

import android.content.Context
import com.facebook.react.bridge.ReadableMap
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.camera.CameraUpdateFactory.newCameraPosition
import org.maplibre.android.camera.CameraUpdateFactory.newLatLngBounds
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.geometry.LatLngBounds
import org.maplibre.android.maps.MapLibreMap.CancelableCallback
import org.maplibre.geojson.FeatureCollection
import org.maplibre.reactnative.components.camera.constants.CameraMode
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.utils.GeoJSONUtils
import kotlin.math.roundToInt

class CameraStop {
    private var mBearing: Double? = null
    private var mTilt: Double? = null
    private var mZoom: Double? = null
    private var mLatLng: LatLng? = null

    private var mBounds: LatLngBounds? = null
    private var mPaddingLeft = 0
    private var mPaddingRight = 0
    private var mPaddingBottom = 0
    private var mPaddingTop = 0

    private var mMode = CameraMode.EASE
    private var mDuration = 2000
    private var mCallback: CancelableCallback? = null

    fun setBearing(bearing: Double) {
        mBearing = bearing
    }

    fun setTilt(tilt: Double) {
        mTilt = tilt
    }

    fun setZoom(zoom: Double) {
        mZoom = zoom
    }

    fun setLatLng(latLng: LatLng?) {
        mLatLng = latLng
    }

    fun setDuration(duration: Int) {
        mDuration = duration
    }

    fun setCallback(callback: CancelableCallback?) {
        mCallback = callback
    }

    fun setBounds(bounds: LatLngBounds?) {
        mBounds = bounds
    }

    fun setPadding(paddingLeft: Int, paddingRight: Int, paddingTop: Int, paddingBottom: Int) {
        mPaddingLeft = paddingLeft
        mPaddingRight = paddingRight
        mPaddingTop = paddingTop
        mPaddingBottom = paddingBottom
    }

    fun setMode(@CameraMode.Mode mode: Int) {
        mMode = mode
    }

    fun toCameraUpdate(mapView: MLRNMapView): CameraUpdateItem {
        val map = mapView.mapLibreMap
        val currentCamera = map!!.getCameraPosition()
        val builder = CameraPosition.Builder(currentCamera)

        // Adding map padding to the camera padding to mimic MLN iOS behavior
        val contentInset = mapView.contentInset

        val paddingLeft: Int = contentInset[0].toInt() + mPaddingLeft.toInt()
        val paddingTop: Int = contentInset[1].toInt() + mPaddingTop.toInt()
        val paddingRight: Int = contentInset[2].toInt() + mPaddingRight.toInt()
        val paddingBottom: Int = contentInset[3].toInt() + mPaddingBottom.toInt()

        val cameraPadding = intArrayOf(paddingLeft, paddingTop, paddingRight, paddingBottom)
        val cameraPaddingClipped: IntArray = clippedPadding(cameraPadding, mapView)

        var hasSetZoom = false

        if (mLatLng != null) {
            builder.target(mLatLng)
            builder.padding(
                cameraPaddingClipped[0].toDouble(),
                cameraPaddingClipped[1].toDouble(),
                cameraPaddingClipped[2].toDouble(),
                cameraPaddingClipped[3].toDouble()
            )
        } else if (mBounds != null) {
            val tilt = (if (mTilt != null) mTilt else currentCamera.tilt)!!
            val bearing = (if (mBearing != null) mBearing else currentCamera.bearing)!!

            val boundsCamera =
                map.getCameraForLatLngBounds(mBounds!!, cameraPaddingClipped, bearing, tilt)
            if (boundsCamera != null) {
                builder.target(boundsCamera.target)
                builder.zoom(boundsCamera.zoom)
                builder.padding(boundsCamera.padding)
            } else {
                val update = newLatLngBounds(
                    mBounds!!,
                    cameraPaddingClipped[0],
                    cameraPaddingClipped[1],
                    cameraPaddingClipped[2],
                    cameraPaddingClipped[3]
                )
                return CameraUpdateItem(map, update, mDuration, mCallback, mMode)
            }
            hasSetZoom = true
        }

        if (mBearing != null) {
            builder.bearing(mBearing!!)
        }

        if (mTilt != null) {
            builder.tilt(mTilt!!)
        }

        if (mZoom != null && !hasSetZoom) {
            builder.zoom(mZoom!!)
        }

        return CameraUpdateItem(
            map, newCameraPosition(builder.build()), mDuration, mCallback, mMode
        )
    }

    companion object {
        fun fromReadableMap(
            context: Context, readableMap: ReadableMap, callback: CancelableCallback?
        ): CameraStop {
            val stop = CameraStop()

            if (readableMap.hasKey("pitch")) {
                stop.setTilt(readableMap.getDouble("pitch"))
            }

            if (readableMap.hasKey("heading")) {
                stop.setBearing(readableMap.getDouble("heading"))
            }

            var paddingTop: Int = getPaddingByKey(readableMap, "paddingTop")
            var paddingRight: Int = getPaddingByKey(readableMap, "paddingRight")
            var paddingBottom: Int = getPaddingByKey(readableMap, "paddingBottom")
            var paddingLeft: Int = getPaddingByKey(readableMap, "paddingLeft")

            // scale padding by pixel ratio
            val metrics = context.getResources().getDisplayMetrics()
            paddingTop = paddingTop * metrics.scaledDensity.toInt()
            paddingRight = paddingRight * metrics.scaledDensity.toInt()
            paddingBottom = paddingBottom * metrics.scaledDensity.toInt()
            paddingLeft = paddingLeft * metrics.scaledDensity.toInt()

            stop.setPadding(
                paddingLeft, paddingRight, paddingTop, paddingBottom
            )

            if (readableMap.hasKey("centerCoordinate")) {
                val target = GeoJSONUtils.toPointGeometry(readableMap.getString("centerCoordinate"))
                stop.setLatLng(GeoJSONUtils.toLatLng(target))
            }

            if (readableMap.hasKey("zoom")) {
                stop.setZoom(readableMap.getDouble("zoom"))
            }

            if (readableMap.hasKey("duration")) {
                stop.setDuration(readableMap.getInt("duration"))
            }

            if (readableMap.hasKey("bounds")) {
                val collection = FeatureCollection.fromJson(readableMap.getString("bounds")!!)
                stop.setBounds(GeoJSONUtils.toLatLngBounds(collection))
            }

            if (readableMap.hasKey("mode")) {
                when (readableMap.getInt("mode")) {
                    CameraMode.FLIGHT -> stop.setMode(CameraMode.FLIGHT)
                    CameraMode.LINEAR -> stop.setMode(CameraMode.LINEAR)
                    CameraMode.NONE -> stop.setMode(CameraMode.NONE)
                    else -> stop.setMode(CameraMode.EASE)
                }
            }

            stop.setCallback(callback)
            return stop
        }

        private fun clippedPadding(padding: IntArray, mapView: MLRNMapView): IntArray {
            val mapHeight = mapView.getHeight()
            val mapWidth = mapView.getWidth()

            val left = padding[0]
            val top = padding[1]
            val right = padding[2]
            val bottom = padding[3]

            var resultLeft = left
            var resultTop = top
            var resultRight = right
            var resultBottom = bottom

            if (top + bottom >= mapHeight) {
                val totalPadding = (top + bottom).toDouble()
                val extra =
                    totalPadding - mapHeight + 1.0 // add 1 to compensate for floating point math
                resultTop = (resultTop - (top * extra) / totalPadding).toInt()
                resultBottom = (resultBottom - (bottom * extra) / totalPadding).toInt()
            }

            if (left + right >= mapWidth) {
                val totalPadding = (left + right).toDouble()
                val extra =
                    totalPadding - mapWidth + 1.0 // add 1 to compensate for floating point math
                resultLeft = (resultLeft - (left * extra) / totalPadding).toInt()
                resultRight = (resultRight - (right * extra) / totalPadding).toInt()
            }

            return intArrayOf(resultLeft, resultTop, resultRight, resultBottom)
        }

        private fun getPaddingByKey(map: ReadableMap, key: String): Int {
            return if (map.hasKey(key)) map.getInt(key) else 0
        }
    }
}
