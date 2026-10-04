package org.maplibre.reactnative.components.camera

import android.content.Context
import com.facebook.react.bridge.ReadableMap
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.camera.CameraUpdateFactory.newCameraPosition
import org.maplibre.android.camera.CameraUpdateFactory.newLatLngBounds
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.geometry.LatLngBounds
import org.maplibre.android.maps.MapLibreMap.CancelableCallback
import org.maplibre.reactnative.components.camera.constants.CameraEasing
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.utils.GeoJSONUtils

class CameraStop {
    var center: LatLng? = null

    var bounds: LatLngBounds? = null

    var paddingTop = 0
    var paddingRight = 0
    var paddingBottom = 0
    var paddingLeft = 0

    var zoom: Double? = null
    var bearing: Double? = null
    var pitch: Double? = null

    var duration = 0
    var easing = CameraEasing.NONE

    var callback: CancelableCallback? = null

    fun setPadding(
        paddingLeft: Int,
        paddingRight: Int,
        paddingTop: Int,
        paddingBottom: Int,
    ) {
        this.paddingLeft = paddingLeft
        this.paddingRight = paddingRight
        this.paddingTop = paddingTop
        this.paddingBottom = paddingBottom
    }

    fun toCameraUpdate(mapView: MLRNMapView): CameraUpdateItem {
        val map = mapView.mapLibreMap
        val currentCamera = map!!.cameraPosition
        val builder = CameraPosition.Builder(currentCamera)

        // Adding map padding to the camera padding to mimic MLN iOS behavior
        val contentInset = mapView.contentInset

        val paddingLeft: Int = contentInset[0].toInt() + paddingLeft
        val paddingTop: Int = contentInset[1].toInt() + paddingTop
        val paddingRight: Int = contentInset[2].toInt() + paddingRight
        val paddingBottom: Int = contentInset[3].toInt() + paddingBottom

        val cameraPadding = intArrayOf(paddingLeft, paddingTop, paddingRight, paddingBottom)
        val cameraPaddingClipped: IntArray =
            getClippedCameraPadding(
                cameraPadding,
                mapView.width,
                mapView.height,
            )

        var hasSetZoom = false

        if (center != null) {
            builder.target(center)
            builder.padding(
                cameraPaddingClipped[0].toDouble(),
                cameraPaddingClipped[1].toDouble(),
                cameraPaddingClipped[2].toDouble(),
                cameraPaddingClipped[3].toDouble(),
            )
        } else if (bounds != null) {
            val tilt = (if (pitch != null) pitch else currentCamera.tilt)!!
            val bearing = (if (bearing != null) bearing else currentCamera.bearing)!!

            val boundsCamera =
                map.getCameraForLatLngBounds(bounds!!, cameraPaddingClipped, bearing, tilt)
            if (boundsCamera != null) {
                builder.target(boundsCamera.target)
                builder.zoom(boundsCamera.zoom)
                builder.padding(boundsCamera.padding)
            } else {
                val update =
                    newLatLngBounds(
                        bounds!!,
                        cameraPaddingClipped[0],
                        cameraPaddingClipped[1],
                        cameraPaddingClipped[2],
                        cameraPaddingClipped[3],
                    )
                return CameraUpdateItem(map, update, duration, easing, callback)
            }

            hasSetZoom = true
        }

        if (zoom != null && !hasSetZoom) {
            builder.zoom(zoom!!)
        }

        if (bearing != null) {
            builder.bearing(bearing!!)
        }

        if (pitch != null) {
            builder.tilt(pitch!!)
        }

        return CameraUpdateItem(
            map,
            newCameraPosition(builder.build()),
            duration,
            easing,
            callback,
        )
    }

    companion object {
        fun fromReadableMap(
            context: Context,
            readableMap: ReadableMap,
            callback: CancelableCallback?,
        ): CameraStop {
            val stop = CameraStop()

            if (readableMap.hasKey("center")) {
                stop.center = GeoJSONUtils.toLatLng(readableMap.getArray("center"))
            } else if (readableMap.hasKey("bounds")) {
                stop.bounds = GeoJSONUtils.toLatLngBounds(readableMap.getArray("bounds"))
            }

            var paddingTop: Int = getPaddingByKey(readableMap, "top")
            var paddingRight: Int = getPaddingByKey(readableMap, "right")
            var paddingBottom: Int = getPaddingByKey(readableMap, "bottom")
            var paddingLeft: Int = getPaddingByKey(readableMap, "left")

            val density = context.resources.displayMetrics.density
            paddingTop = (paddingTop * density).toInt()
            paddingRight = (paddingRight * density).toInt()
            paddingBottom = (paddingBottom * density).toInt()
            paddingLeft = (paddingLeft * density).toInt()

            stop.setPadding(
                paddingLeft,
                paddingRight,
                paddingTop,
                paddingBottom,
            )

            if (readableMap.hasKey("zoom")) {
                stop.zoom = readableMap.getDouble("zoom")
            }

            if (readableMap.hasKey("bearing")) {
                stop.bearing = readableMap.getDouble("bearing")
            }

            if (readableMap.hasKey("pitch")) {
                stop.pitch = readableMap.getDouble("pitch")
            }

            if (readableMap.hasKey("duration")) {
                stop.duration = readableMap.getInt("duration")
            }

            if (readableMap.hasKey("easing")) {
                stop.easing = CameraEasing.fromString(readableMap.getString("easing"))
            }

            stop.callback = callback

            return stop
        }

        private fun getPaddingByKey(
            map: ReadableMap?,
            key: String,
        ): Int {
            val paddingMap = map?.getMap("padding")
            return if (paddingMap != null && paddingMap.hasKey(key)) {
                paddingMap.getInt(key)
            } else {
                0
            }
        }
    }
}

internal fun getClippedCameraPadding(
    padding: IntArray,
    mapWidth: Int,
    mapHeight: Int,
): IntArray =
    getClippedCameraPadding(
        DoubleArray(padding.size) { padding[it].toDouble() },
        mapWidth,
        mapHeight,
    ).map { it.toInt() }.toIntArray()

internal fun getClippedCameraPadding(
    padding: DoubleArray,
    mapWidth: Int,
    mapHeight: Int,
): DoubleArray {
    require(padding.size == 4) { "Camera padding must contain left, top, right, and bottom values" }

    val result = padding.copyOf()
    clipPaddingPair(result, 1, 3, mapHeight)
    clipPaddingPair(result, 0, 2, mapWidth)
    return result
}

private fun clipPaddingPair(
    padding: DoubleArray,
    firstIndex: Int,
    secondIndex: Int,
    availableSize: Int,
) {
    if (availableSize <= 0) {
        return
    }

    val first = padding[firstIndex]
    val second = padding[secondIndex]
    val total = first + second
    if (total < availableSize || total <= 0) {
        return
    }

    val extra = total - availableSize + 1.0
    padding[firstIndex] = first - (first * extra) / total
    padding[secondIndex] = second - (second * extra) / total
}
