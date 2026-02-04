package org.maplibre.reactnative.components.annotations.markerview

import android.graphics.PointF
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.MapView

class MarkerViewManager(
    private val mapView: MapView,
    private val map: MapLibreMap,
) {
    data class MarkerInfo(
        val view: View,
        var latLng: LatLng,
        var anchorX: Float = 0f,
        var anchorY: Float = 0f,
        var offsetX: Float = 0f,
        var offsetY: Float = 0f,
    )

    private val markers = mutableListOf<MarkerInfo>()
    private var isDestroyed = false

    fun addMarker(
        view: View,
        latLng: LatLng,
        anchorX: Float = 0f,
        anchorY: Float = 0f,
        offsetX: Float = 0f,
        offsetY: Float = 0f,
    ): MarkerInfo {
        val markerInfo = MarkerInfo(view, latLng, anchorX, anchorY, offsetX, offsetY)
        markers.add(markerInfo)

        if (view is ViewGroup) {
            view.clipChildren = false
            view.clipToPadding = false
            view.clipToOutline = false
        }

        if (view.parent == null) {
            mapView.clipChildren = false
            mapView.clipToPadding = false
            mapView.clipToOutline = false
            mapView.addView(view)
        }

        updateMarkerPosition(markerInfo)

        return markerInfo
    }

    fun removeMarker(markerInfo: MarkerInfo) {
        markers.remove(markerInfo)
        mapView.removeView(markerInfo.view)
    }

    fun removeMarkerByView(view: View) {
        markers.find { it.view == view }?.let { removeMarker(it) }
    }

    fun updateMarkers() {
        if (isDestroyed) return

        for (marker in markers) {
            updateMarkerPosition(marker)
        }
    }

    private fun updateMarkerPosition(marker: MarkerInfo) {
        val view = marker.view
        val screenPos: PointF = map.projection.toScreenLocation(marker.latLng)
        val viewWidth = if (view.width > 0) view.width.toFloat() else view.measuredWidth.toFloat()
        val viewHeight = if (view.height > 0) view.height.toFloat() else view.measuredHeight.toFloat()
        val anchorOffsetX = viewWidth * marker.anchorX
        val anchorOffsetY = viewHeight * marker.anchorY
        view.x = screenPos.x - anchorOffsetX + marker.offsetX
        view.y = screenPos.y - anchorOffsetY + marker.offsetY
    }

    fun findMarkerByView(view: View): MarkerInfo? = markers.find { it.view == view }

    fun updateMarkerCoordinate(
        markerInfo: MarkerInfo,
        latLng: LatLng,
    ) {
        markerInfo.latLng = latLng
        updateMarkerPosition(markerInfo)
    }

    fun updateMarkerAnchor(
        markerInfo: MarkerInfo,
        anchorX: Float,
        anchorY: Float,
    ) {
        markerInfo.anchorX = anchorX
        markerInfo.anchorY = anchorY
        updateMarkerPosition(markerInfo)
    }

    fun updateMarkerOffset(
        markerInfo: MarkerInfo,
        offsetX: Float,
        offsetY: Float,
    ) {
        markerInfo.offsetX = offsetX
        markerInfo.offsetY = offsetY
        updateMarkerPosition(markerInfo)
    }

    fun removeViews() {
        for (marker in markers) {
            mapView.removeView(marker.view)
        }
    }

    fun restoreViews() {
        for (marker in markers) {
            if (marker.view.parent == null) {
                mapView.addView(marker.view)
            }
        }
        updateMarkers()
    }

    fun onDestroy() {
        isDestroyed = true
        for (marker in markers) {
            mapView.removeView(marker.view)
        }
        markers.clear()
    }
}
