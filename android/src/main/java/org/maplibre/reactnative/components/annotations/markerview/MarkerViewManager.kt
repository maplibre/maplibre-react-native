package org.maplibre.reactnative.components.annotations.markerview

import android.graphics.PointF
import android.view.View
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.MapView

/**
 * Native implementation of MarkerViewManager that manages marker views directly
 * without relying on the MapLibre plugin. This provides better control over
 * positioning and updates during map movement.
 */
class MarkerViewManager(
    private val mapView: MapView,
    private val map: MapLibreMap
) {
    /**
     * Data class to hold marker information for position calculation
     */
    data class MarkerInfo(
        val view: View,
        var latLng: LatLng,
        var anchorX: Float = 0f,
        var anchorY: Float = 0f,
        var offsetX: Float = 0f,
        var offsetY: Float = 0f
    )

    private val markers = mutableListOf<MarkerInfo>()
    private var isDestroyed = false

    /**
     * Adds a marker view to be managed
     */
    fun addMarker(
        view: View,
        latLng: LatLng,
        anchorX: Float = 0f,
        anchorY: Float = 0f,
        offsetX: Float = 0f,
        offsetY: Float = 0f
    ): MarkerInfo {
        val markerInfo = MarkerInfo(view, latLng, anchorX, anchorY, offsetX, offsetY)
        markers.add(markerInfo)

        // Add view to MapView if not already attached
        if (view.parent == null) {
            mapView.addView(view)
        }

        // Initial position update
        updateMarkerPosition(markerInfo)

        return markerInfo
    }

    /**
     * Removes a marker view from management
     */
    fun removeMarker(markerInfo: MarkerInfo) {
        markers.remove(markerInfo)
        mapView.removeView(markerInfo.view)
    }

    /**
     * Removes a marker by its view
     */
    fun removeMarkerByView(view: View) {
        markers.find { it.view == view }?.let { removeMarker(it) }
    }

    /**
     * Updates the position of all markers. Called during map movement/rendering.
     */
    fun updateMarkers() {
        if (isDestroyed) return

        for (marker in markers) {
            updateMarkerPosition(marker)
        }
    }

    /**
     * Updates a single marker's screen position based on its geo coordinates
     */
    private fun updateMarkerPosition(marker: MarkerInfo) {
        val view = marker.view

        // Convert lat/lng to screen position
        val screenPos: PointF = map.projection.toScreenLocation(marker.latLng)

        // Calculate final position with anchor and offset
        // Anchor is normalized (0-1), so multiply by view dimensions
        // Use measuredWidth/Height as fallback if view hasn't been laid out yet
        val viewWidth = if (view.width > 0) view.width.toFloat() else view.measuredWidth.toFloat()
        val viewHeight = if (view.height > 0) view.height.toFloat() else view.measuredHeight.toFloat()

        val anchorOffsetX = viewWidth * marker.anchorX
        val anchorOffsetY = viewHeight * marker.anchorY

        // Apply position: screen position - anchor offset + pixel offset
        val x = screenPos.x - anchorOffsetX + marker.offsetX
        val y = screenPos.y - anchorOffsetY + marker.offsetY

        // Use setX/setY for absolute positioning (combines layout position + translation)
        // This ensures correct positioning regardless of the view's layout state
        view.x = x
        view.y = y
    }

    /**
     * Finds a MarkerInfo by its view
     */
    fun findMarkerByView(view: View): MarkerInfo? {
        return markers.find { it.view == view }
    }

    /**
     * Updates the coordinate for a specific marker
     */
    fun updateMarkerCoordinate(markerInfo: MarkerInfo, latLng: LatLng) {
        markerInfo.latLng = latLng
        updateMarkerPosition(markerInfo)
    }

    /**
     * Updates anchor values for a specific marker
     */
    fun updateMarkerAnchor(markerInfo: MarkerInfo, anchorX: Float, anchorY: Float) {
        markerInfo.anchorX = anchorX
        markerInfo.anchorY = anchorY
        updateMarkerPosition(markerInfo)
    }

    /**
     * Updates offset values for a specific marker
     */
    fun updateMarkerOffset(markerInfo: MarkerInfo, offsetX: Float, offsetY: Float) {
        markerInfo.offsetX = offsetX
        markerInfo.offsetY = offsetY
        updateMarkerPosition(markerInfo)
    }

    /**
     * Temporarily removes all marker views from the MapView.
     * Used during layout changes to prevent view hierarchy issues.
     */
    fun removeViews() {
        for (marker in markers) {
            mapView.removeView(marker.view)
        }
    }

    /**
     * Restores all marker views to the MapView after removeViews().
     */
    fun restoreViews() {
        for (marker in markers) {
            if (marker.view.parent == null) {
                mapView.addView(marker.view)
            }
        }
        // Re-position all markers after restore
        updateMarkers()
    }

    /**
     * Cleans up resources
     */
    fun onDestroy() {
        isDestroyed = true
        for (marker in markers) {
            mapView.removeView(marker.view)
        }
        markers.clear()
    }
}
