package org.maplibre.reactnative.components.annotations.markerview

import org.maplibre.android.maps.MapView
import org.maplibre.android.maps.MapLibreMap
import java.lang.reflect.InvocationTargetException
import java.lang.reflect.Method

/**
 * Subclass of MarkerViewManager implementing removeViews and restoreViews
 */
class MarkerViewManager(private val mapView: MapView, map: MapLibreMap) : org.maplibre.android.plugins.markerview.MarkerViewManager(mapView, map) {
    private val markers = mutableListOf<MarkerView>()
    private var markerUpdate: Method? = null

    init {
        try {
            // Accessing the 'update' method on the superclass of MarkerView
            markerUpdate = MarkerView::class.java.superclass?.getDeclaredMethod("update")
            markerUpdate?.isAccessible = true
        } catch (e: NoSuchMethodException) {
            println(e.toString())
        }
    }

    fun addMarker(markerView: MarkerView) {
        super.addMarker(markerView)
        markers.add(markerView)
    }

    fun removeMarker(markerView: MarkerView) {
        super.removeMarker(markerView)
        markers.remove(markerView)
    }

    fun removeViews() {
        for (marker in markers) {
            mapView.removeView(marker.getView())
        }
    }

    fun restoreViews() {
        for (marker in markers) {
            mapView.addView(marker.getView())
        }
    }

    fun updateMarkers() {

        try {
            markers.forEach { marker ->
                markerUpdate?.invoke(marker)
            }
        } 
        catch (e: IllegalArgumentException) {
            println(e.toString())
        }
        catch (e: IllegalAccessException) {
            println(e.toString())
        }
        catch (e: InvocationTargetException) {
            println(e.toString())
        }
    }

}