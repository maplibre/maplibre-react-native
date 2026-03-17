package org.maplibre.reactnative.components.camera

import android.Manifest
import android.content.Context
import android.location.Location
import android.util.AttributeSet
import androidx.annotation.RequiresPermission
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcher
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.camera.CameraUpdateFactory.newCameraPosition
import org.maplibre.android.geometry.LatLngBounds
import org.maplibre.android.location.OnCameraTrackingChangedListener
import org.maplibre.android.location.permissions.PermissionsManager
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.MapLibreMap.CancelableCallback
import org.maplibre.android.maps.Style
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.camera.constants.CameraEasing
import org.maplibre.reactnative.components.location.LocationComponentManager
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.location.LocationManager
import org.maplibre.reactnative.location.LocationManager.OnUserLocationChange
import org.maplibre.reactnative.location.TrackUserLocationMode
import org.maplibre.reactnative.location.TrackUserLocationState
import org.maplibre.reactnative.location.UserLocation

class MLRNCamera(
    context: Context,
) : AbstractMapFeature(
        context,
    ) {
    @Suppress("UNUSED_PARAMETER")
    constructor(context: Context, attrs: AttributeSet?) : this(context)

    @Suppress("UNUSED_PARAMETER")
    constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : this(context)

    private var mapView: MLRNMapView? = null
    private var hasSentFirstRegion = false
    private val updateQueue = CameraUpdateQueue()

    private var stop: CameraStop? = null

    private var initialViewState: CameraStop? = null

    private var minZoom: Double? = null
    private var maxZoom: Double? = null

    private var maxBounds: LatLngBounds? = null

    private var trackUserLocation = TrackUserLocationMode.NONE
    private var userTrackingState = TrackUserLocationState.POSSIBLE

    private var locationComponentManager: LocationComponentManager? = null

    private val locationManager: LocationManager = LocationManager.getInstance(context)
    private val userLocation = UserLocation()

    private val locationChangeListener: OnUserLocationChange =
        object : OnUserLocationChange {
            override fun onLocationChange(location: Location) {
                if (mapView!!.mapLibreMap == null ||
                    locationComponentManager == null ||
                    !locationComponentManager!!.hasLocationComponent() ||
                    trackUserLocation == TrackUserLocationMode.NONE
                ) {
                    return
                }

                userLocation.setCurrentLocation(location)
            }
        }

    val eventDispatcher: EventDispatcher?
        get() {
            val reactContext = context as ReactContext

            return UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
        }

    val surfaceId: Int
        get() {
            val reactContext = context as ReactContext

            return UIManagerHelper.getSurfaceId(reactContext)
        }

    private val cameraCallback: CancelableCallback =
        object : CancelableCallback {
            override fun onCancel() {
                if (!hasSentFirstRegion) {
                    mapView!!.sendRegionChangeEvent(false)
                    hasSentFirstRegion = true
                }
            }

            override fun onFinish() {
                if (!hasSentFirstRegion) {
                    mapView!!.sendRegionChangeEvent(false)
                    hasSentFirstRegion = true
                }
            }
        }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    override fun addToMap(mapView: MLRNMapView) {
        this@MLRNCamera.mapView = mapView

        setInitialCamera()
        updateMaxMinZoom()
        updateMaxBounds()

        if (stop != null) {
            updateCamera()
        }

        if (trackUserLocation != TrackUserLocationMode.NONE) {
            enableLocation()
        }
    }

    override fun removeFromMap(mapView: MLRNMapView) {}

    fun handleImperativeStop(stop: ReadableMap?) {
        val mapView = this.mapView ?: return
        val stop =
            CameraStop.fromReadableMap(context, stop ?: Arguments.createMap(), cameraCallback)

        updateQueue.offer(stop)
        updateQueue.execute(mapView)
    }

    fun setStop(stop: ReadableMap?) {
        this.stop =
            CameraStop.fromReadableMap(context, stop ?: Arguments.createMap(), cameraCallback)

        if (mapView != null) {
            updateCamera()
        }
    }

    fun setInitialViewState(stop: CameraStop?) {
        initialViewState = stop
    }

    fun hasInitialViewState(): Boolean = initialViewState != null

    fun setMaxBounds(bounds: LatLngBounds?) {
        maxBounds = bounds
        updateMaxBounds()
    }

    private fun updateMaxMinZoom() {
        val map = maplibreMap
        if (map != null) {
            val minZoom = minZoom
            if (minZoom != null) {
                map.setMinZoomPreference(minZoom)
            }

            val maxZoom = maxZoom
            if (maxZoom != null) {
                map.setMaxZoomPreference(maxZoom)
            }
        }
    }

    private fun updateMaxBounds() {
        val map = maplibreMap
        if (map != null && maxBounds != null) {
            map.setLatLngBoundsForCameraTarget(maxBounds)
        }
    }

    private fun setInitialCamera() {
        if (initialViewState != null) {
            initialViewState!!.duration = 0
            initialViewState!!.easing = CameraEasing.NONE
            val item = initialViewState!!.toCameraUpdate(mapView!!)

            item.run()
        }
    }

    private fun updateCamera() {
        updateQueue.offer(stop)
        updateQueue.execute(mapView!!)
    }

    private fun updateUserTrackingMode(trackUserLocationMode: Int) {
        userLocation.trackingMode = trackUserLocationMode

        val event = OnTrackUserLocationChangeEvent(surfaceId, id, trackUserLocationMode)
        eventDispatcher?.dispatchEvent(event)
    }

    private fun updateUserLocation() {
        if (trackUserLocation == TrackUserLocationMode.NONE || userLocation.trackingMode == TrackUserLocationMode.NONE) {
            return
        }

        if (userTrackingState == TrackUserLocationState.POSSIBLE) {
            updateUserLocationSignificantly()
        } else if (userTrackingState == TrackUserLocationState.CHANGED) {
            updateUserLocationIncrementally()
        }
    }

    private fun getUserLocationUpdateCameraPosition(zoomLevel: Double): CameraPosition {
        val center = userLocation.coordinate

        return CameraPosition
            .Builder()
            .target(center)
            .bearing(
                directionForUserLocationUpdate,
            ).tilt(stop?.pitch ?: 0.0)
            .zoom(zoomLevel)
            .build()
    }

    private val directionForUserLocationUpdate: Double
        get() {
            // NOTE: The direction of this is used for map rotation only, not location layer rotation
            val currentCamera = mapView!!.cameraPosition
            var direction = currentCamera.bearing

            val userTrackingMode = userLocation.trackingMode
            if (userTrackingMode == TrackUserLocationMode.HEADING || userTrackingMode == TrackUserLocationMode.COURSE) {
                direction = userLocation.bearing
            } else if (stop?.bearing != null) {
                direction = stop?.bearing ?: direction
            }

            return direction
        }

    private fun updateUserLocationSignificantly() {
        userTrackingState = TrackUserLocationState.BEGAN

        val cameraUpdate =
            newCameraPosition(getUserLocationUpdateCameraPosition(mapView!!.mapLibreMap!!.cameraPosition.zoom))
        val cameraCallback: CancelableCallback =
            object : CancelableCallback {
                override fun onCancel() {
                    userTrackingState = TrackUserLocationState.CHANGED
                }

                override fun onFinish() {
                    userTrackingState = TrackUserLocationState.CHANGED
                }
            }

        mapView!!.moveCamera(cameraUpdate, cameraCallback)
    }

    private fun updateUserLocationIncrementally() {
        userTrackingState = TrackUserLocationState.BEGAN

        val cameraPosition = mapView!!.cameraPosition
        val cameraUpdate =
            newCameraPosition(getUserLocationUpdateCameraPosition(cameraPosition.zoom))

        val callback: CancelableCallback =
            object : CancelableCallback {
                override fun onCancel() {
                    userTrackingState = TrackUserLocationState.CHANGED
                }

                override fun onFinish() {
                    userTrackingState = TrackUserLocationState.CHANGED
                }
            }

        mapView!!.moveCamera(cameraUpdate, callback)
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    private fun enableLocation() {
        if (!PermissionsManager.areLocationPermissionsGranted(context)) {
            return
        }

        if (!locationManager.isActive()) {
            locationManager.enable()
        }

        mapView!!.mapLibreMap!!.getStyle { style ->
            enableLocationComponent(
                style,
            )
        }
    }

    private fun enableLocationComponent(style: Style) {
        updateUserLocation()
        updateLocationLayer(style)

        val lastKnownLocation = locationManager.lastKnownLocation
        locationManager.addLocationListener(locationChangeListener)

        if (lastKnownLocation != null) {
            locationChangeListener.onLocationChange(lastKnownLocation)

            postDelayed({ mapView!!.sendRegionDidChangeEvent() }, 200)
        }
    }

    private fun updateLocationLayer(style: Style) {
        if (locationComponentManager == null) {
            locationComponentManager = mapView!!.locationComponentManager
        }

        locationComponentManager!!.update(style)
        locationComponentManager!!.setFollowUserLocation(trackUserLocation != TrackUserLocationMode.NONE)

        if (trackUserLocation != TrackUserLocationMode.NONE) {
            locationComponentManager!!.setCameraMode(
                TrackUserLocationMode.getCameraMode(
                    trackUserLocation,
                ),
            )
            locationComponentManager!!.addOnCameraTrackingChangedListener(
                object :
                    OnCameraTrackingChangedListener {
                    override fun onCameraTrackingChanged(currentMode: Int) {
                        val userTrackingMode =
                            when (currentMode) {
                                org.maplibre.android.location.modes.CameraMode.NONE -> TrackUserLocationMode.NONE
                                org.maplibre.android.location.modes.CameraMode.TRACKING -> TrackUserLocationMode.DEFAULT
                                org.maplibre.android.location.modes.CameraMode.TRACKING_COMPASS -> TrackUserLocationMode.HEADING
                                org.maplibre.android.location.modes.CameraMode.TRACKING_GPS -> TrackUserLocationMode.COURSE
                                else -> TrackUserLocationMode.NONE
                            }

                        updateUserTrackingMode(userTrackingMode)
                    }

                    override fun onCameraTrackingDismissed() {
                    }
                },
            )
        } else {
            locationComponentManager!!.setCameraMode(org.maplibre.android.location.modes.CameraMode.NONE)
        }
    }

    fun setMinZoomLevel(zoomLevel: Double) {
        minZoom = zoomLevel
        updateMaxMinZoom()
    }

    fun setMaxZoomLevel(zoomLevel: Double) {
        maxZoom = zoomLevel
        updateMaxMinZoom()
    }

    fun setTrackUserLocation(trackUserLocationMode: Int) {
        val oldTrackingMode = trackUserLocation
        trackUserLocation = trackUserLocationMode
        updateUserTrackingMode(trackUserLocationMode)

        when (trackUserLocation) {
            TrackUserLocationMode.NONE -> {
                userTrackingState = TrackUserLocationState.POSSIBLE
            }

            TrackUserLocationMode.DEFAULT, TrackUserLocationMode.COURSE, TrackUserLocationMode.HEADING -> {
                if (oldTrackingMode ==
                    TrackUserLocationMode.NONE
                ) {
                    userTrackingState = TrackUserLocationState.POSSIBLE
                }
            }
        }

        if (maplibreMap != null) {
            updateLocationLayer(maplibreMap!!.style!!)
        }
    }

    private val maplibreMap: MapLibreMap?
        get() {
            if (mapView == null) {
                return null
            }
            return mapView!!.mapLibreMap
        }

    inner class OnTrackUserLocationChangeEvent(
        surfaceId: Int,
        viewId: Int,
        private val trackUserLocationMode: Int,
    ) : Event<OnTrackUserLocationChangeEvent>(surfaceId, viewId) {
        override fun getEventName() = "onTrackUserLocationChange"

        override fun getEventData(): WritableMap =
            Arguments.createMap().apply {
                putString(
                    "trackUserLocation",
                    TrackUserLocationMode.toString(trackUserLocationMode),
                )
            }
    }
}
