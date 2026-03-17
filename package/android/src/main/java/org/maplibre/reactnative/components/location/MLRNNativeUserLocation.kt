package org.maplibre.reactnative.components.location

import android.annotation.SuppressLint
import android.content.Context
import org.maplibre.android.location.modes.RenderMode
import org.maplibre.android.location.permissions.PermissionsManager
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.OnMapReadyCallback
import org.maplibre.android.maps.Style
import org.maplibre.android.maps.Style.OnStyleLoaded
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.mapview.MLRNMapView

class MLRNNativeUserLocation(
    context: Context?,
) : AbstractMapFeature(context),
    OnMapReadyCallback,
    OnStyleLoaded {
    private var enabled = true
    private var map: MapLibreMap? = null
    private var mapView: MLRNMapView? = null

    @RenderMode.Mode
    private var mRenderMode = RenderMode.COMPASS
    private var mPreferredFramesPerSecond = 0

    override fun addToMap(mapView: MLRNMapView) {
        enabled = true
        this.mapView = mapView
        mapView.getMapAsync(this)
        setRenderMode(mRenderMode)
        setPreferredFramesPerSecond(mPreferredFramesPerSecond)
    }

    override fun removeFromMap(mapView: MLRNMapView) {
        enabled = false
        if (map != null) map!!.getStyle(this)
    }

    @SuppressLint("MissingPermission")
    override fun onMapReady(mapLibreMap: MapLibreMap) {
        map = mapLibreMap
        mapLibreMap.getStyle(this)
    }

    @SuppressLint("MissingPermission")
    override fun onStyleLoaded(style: Style) {
        val context = getContext()
        if (!PermissionsManager.areLocationPermissionsGranted(context)) {
            return
        }

        val locationComponent = mapView!!.locationComponentManager
        locationComponent.update(style)
        locationComponent.showUserLocation(enabled)
    }

    fun setRenderMode(
        @RenderMode.Mode renderMode: Int,
    ) {
        mRenderMode = renderMode
        if (mapView != null) {
            val locationComponent = mapView!!.locationComponentManager
            locationComponent.setRenderMode(renderMode)
        }
    }

    fun setPreferredFramesPerSecond(framesPerSecond: Int) {
        mPreferredFramesPerSecond = framesPerSecond
        if (mapView != null) {
            val locationComponent = mapView!!.locationComponentManager
            locationComponent.setPreferredFramesPerSecond(framesPerSecond)
        }
    }
}
