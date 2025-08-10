package org.maplibre.reactnative.components.camera

import android.content.Context
import android.location.Location
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.camera.CameraUpdateFactory.newCameraPosition
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.geometry.LatLngBounds
import org.maplibre.android.location.OnCameraTrackingChangedListener
import org.maplibre.android.location.permissions.PermissionsManager
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.MapLibreMap.CancelableCallback
import org.maplibre.android.maps.Style
import org.maplibre.geojson.Point
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.camera.constants.CameraMode
import org.maplibre.reactnative.components.location.LocationComponentManager
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.events.IEvent
import org.maplibre.reactnative.events.MapChangeEvent
import org.maplibre.reactnative.events.MapUserTrackingModeEvent
import org.maplibre.reactnative.events.constants.EventTypes
import org.maplibre.reactnative.location.LocationManager
import org.maplibre.reactnative.location.LocationManager.OnUserLocationChange
import org.maplibre.reactnative.location.UserLocation
import org.maplibre.reactnative.location.UserLocationVerticalAlignment
import org.maplibre.reactnative.location.UserTrackingMode
import org.maplibre.reactnative.location.UserTrackingState
import org.maplibre.reactnative.utils.GeoJSONUtils

class MLRNCamera(private val mContext: Context, private val mManager: MLRNCameraManager) :
    AbstractMapFeature(
        mContext
    ) {
    private var mMapView: MLRNMapView? = null

    private var hasSentFirstRegion = false

    private var mDefaultStop: CameraStop? = null
    private var mCameraStop: CameraStop? = null
    private val mCameraUpdateQueue = CameraUpdateQueue()

    private var mLocationComponentManager: LocationComponentManager? = null

    private var mUserTrackingMode = 0
    private var mUserTrackingState = UserTrackingState.POSSIBLE
    private val mUserLocationVerticalAlignment = UserLocationVerticalAlignment.CENTER

    private val mLocationManager: LocationManager = LocationManager.getInstance(mContext)
    private val mUserLocation = UserLocation()

    private val mCenterCoordinate: Point? = null

    private val mAnimated = false
    private val mHeading = 0.0
    private var mPitch = 0.0
    private var mZoomLevel = -1.0

    private var mMinZoomLevel = -1.0
    private var mMaxZoomLevel = -1.0

    private var mMaxBounds: LatLngBounds? = null

    private var mFollowUserLocation = false
    private var mFollowUserMode: String? = null


    private val mLocationChangeListener: OnUserLocationChange = object : OnUserLocationChange {
        override fun onLocationChange(nextLocation: Location) {
            if (mMapView!!.mapLibreMap == null || mLocationComponentManager == null || !mLocationComponentManager!!.hasLocationComponent() || (!mFollowUserLocation)) {
                return
            }

            mUserLocation.currentLocation = nextLocation
            sendUserLocationUpdateEvent(nextLocation)
        }
    }

    private val mCameraCallback: CancelableCallback = object : CancelableCallback {
        override fun onCancel() {
            if (!hasSentFirstRegion) {
                mMapView!!.sendRegionChangeEvent(false)
                hasSentFirstRegion = true
            }
        }

        override fun onFinish() {
            if (!hasSentFirstRegion) {
                mMapView!!.sendRegionChangeEvent(false)
                hasSentFirstRegion = true
            }
        }
    }

    override fun addToMap(mapView: MLRNMapView) {
        mMapView = mapView

        setInitialCamera()
        updateMaxMinZoomLevel()
        updateMaxBounds()

        if (mCameraStop != null) {
            updateCamera()
        }

        if (mFollowUserLocation) {
            enableLocation()
        }
    }

    override fun removeFromMap(mapView: MLRNMapView) {
    }

    fun setStop(stop: ReadableMap) {
        mCameraStop = CameraStop.fromReadableMap(mContext, stop, null)
        mCameraStop!!.setCallback(mCameraCallback)

        if (mMapView != null) {
            updateCamera()
        }
    }

    fun setDefaultStop(stop: CameraStop?) {
        mDefaultStop = stop
    }

    fun setFollowPitch(pitch: Double) {
        mPitch = pitch
        updateCameraPositionIfNeeded(true)
    }

    fun setMaxBounds(bounds: LatLngBounds?) {
        mMaxBounds = bounds
        updateMaxBounds()
    }

    private fun updateMaxBounds() {
        val map = maplibreMap
        if (map != null && mMaxBounds != null) {
            map.setLatLngBoundsForCameraTarget(mMaxBounds)
        }
    }

    private fun updateMaxMinZoomLevel() {
        val map = maplibreMap
        if (map != null) {
            if (mMinZoomLevel >= 0.0) {
                map.setMinZoomPreference(mMinZoomLevel)
            }
            if (mMaxZoomLevel >= 0.0) {
                map.setMaxZoomPreference(mMaxZoomLevel)
            }
        }
    }

    private fun setInitialCamera() {
        if (mDefaultStop != null) {
            mDefaultStop!!.setDuration(0)
            mDefaultStop!!.setMode(CameraMode.NONE)
            val item = mDefaultStop!!.toCameraUpdate(mMapView)
            item.run()
        }
    }

    private fun updateCamera() {
        mCameraUpdateQueue.offer(mCameraStop)
        mCameraUpdateQueue.execute(mMapView)
    }

    private fun updateUserTrackingMode(userTrackingMode: Int) {
        mUserLocation.trackingMode = userTrackingMode
        val event: IEvent = MapUserTrackingModeEvent(this, userTrackingMode)
        mManager.handleEvent(event)
    }

    private fun updateUserLocation(isAnimated: Boolean) {
        if ((!mFollowUserLocation) || mUserLocation.trackingMode == UserTrackingMode.NONE) {
            return
        }

        if (mUserTrackingState == UserTrackingState.POSSIBLE) {
            updateUserLocationSignificantly(isAnimated)
        } else if (mUserTrackingState == UserTrackingState.CHANGED) {
            updateUserLocationIncrementally(isAnimated)
        }
    }

    private fun getUserLocationUpdateCameraPosition(zoomLevel: Double): CameraPosition {
        var center = mUserLocation.coordinate

        if (mUserLocationVerticalAlignment != UserLocationVerticalAlignment.CENTER) {
            val region = mMapView!!.getVisibleRegion(center, zoomLevel)

            when (mUserLocationVerticalAlignment) {
                UserLocationVerticalAlignment.TOP -> center = LatLng(
                    region.nearRight!!.latitude, center.longitude
                )

                UserLocationVerticalAlignment.BOTTOM -> center = LatLng(
                    region.farLeft!!.latitude, center.longitude
                )
            }
        }

        return CameraPosition.Builder().target(center).bearing(
            directionForUserLocationUpdate
        ).tilt(mPitch).zoom(zoomLevel).build()
    }

    private val directionForUserLocationUpdate: Double
        get() {
            // NOTE: The direction of this is used for map rotation only, not location layer rotation
            val currentCamera = mMapView!!.cameraPosition
            var direction = currentCamera.bearing

            val userTrackingMode = mUserLocation.trackingMode
            if (userTrackingMode == UserTrackingMode.FollowWithHeading || userTrackingMode == UserTrackingMode.FollowWithCourse) {
                direction = mUserLocation.bearing
            } else if (mHeading != 0.0) {
                direction = mHeading
            }

            return direction
        }

    private fun sendUserLocationUpdateEvent(location: Location?) {
        if (location == null) {
            return
        }
        val event: IEvent = MapChangeEvent(
            this, EventTypes.USER_LOCATION_UPDATED, makeLocationChangePayload(location)
        )
        mManager.handleEvent(event)
    }

    private fun hasSetCenterCoordinate(): Boolean {
        val cameraPosition = mMapView!!.cameraPosition
        val center = cameraPosition.target
        return center!!.latitude != 0.0 && center.longitude != 0.0
    }

    private fun updateUserLocationSignificantly(isAnimated: Boolean) {
        mUserTrackingState = UserTrackingState.BEGAN

        var zoom = mZoomLevel
        if (zoom < 0) {
            val cameraZoom = mMapView!!.mapLibreMap!!.cameraPosition.zoom
            zoom = if (cameraZoom < MINIMUM_ZOOM_LEVEL_FOR_USER_TRACKING) {
                DEFAULT_ZOOM_LEVEL_FOR_USER_TRACKING
            } else {
                cameraZoom
            }
        }
        val cameraUpdate = newCameraPosition(getUserLocationUpdateCameraPosition(zoom))
        val cameraCallback: CancelableCallback = object : CancelableCallback {
            override fun onCancel() {
                mUserTrackingState = UserTrackingState.CHANGED
            }

            override fun onFinish() {
                mUserTrackingState = UserTrackingState.CHANGED
            }
        }

        if (isAnimated && hasSetCenterCoordinate()) {
            mMapView!!.animateCamera(cameraUpdate, cameraCallback)
        } else {
            mMapView!!.moveCamera(cameraUpdate, cameraCallback)
        }
    }

    private fun updateUserLocationIncrementally(isAnimated: Boolean) {
        mUserTrackingState = UserTrackingState.BEGAN

        val cameraPosition = mMapView!!.cameraPosition
        val cameraUpdate =
            newCameraPosition(getUserLocationUpdateCameraPosition(cameraPosition.zoom))

        val callback: CancelableCallback = object : CancelableCallback {
            override fun onCancel() {
                mUserTrackingState = UserTrackingState.CHANGED
            }

            override fun onFinish() {
                mUserTrackingState = UserTrackingState.CHANGED
            }
        }

        if (isAnimated) {
            mMapView!!.easeCamera(cameraUpdate, USER_LOCATION_CAMERA_MOVE_DURATION, true, callback)
        } else {
            mMapView!!.moveCamera(cameraUpdate, callback)
        }
    }

    private fun enableLocation() {
        if (!PermissionsManager.areLocationPermissionsGranted(mContext)) {
            return
        }

        if (!mLocationManager.isActive) {
            mLocationManager.enable()
        }

        mMapView!!.mapLibreMap!!.getStyle { style ->
            enableLocationComponent(
                style
            )
        }
    }

    private fun enableLocationComponent(style: Style) {
        updateUserLocation(false)
        updateLocationLayer(style)

        val lastKnownLocation = mLocationManager.lastKnownLocation
        mLocationManager.addLocationListener(mLocationChangeListener)

        if (lastKnownLocation != null) {
            mLocationChangeListener.onLocationChange(lastKnownLocation)

            postDelayed({ mMapView!!.sendRegionDidChangeEvent() }, 200)
        }
    }

    private fun updateLocationLayer(style: Style) {
        if (mLocationComponentManager == null) {
            mLocationComponentManager = mMapView!!.locationComponentManager
        }

        mLocationComponentManager!!.update(style)
        mLocationComponentManager!!.setFollowUserLocation(mFollowUserLocation)

        if (mFollowUserLocation) {
            mLocationComponentManager!!.setCameraMode(
                UserTrackingMode.getCameraMode(
                    mUserTrackingMode
                )
            )
            mLocationComponentManager!!.addOnCameraTrackingChangedListener(object :
                OnCameraTrackingChangedListener {
                override fun onCameraTrackingChanged(currentMode: Int) {
                    val userTrackingMode = when (currentMode) {
                        org.maplibre.android.location.modes.CameraMode.NONE -> UserTrackingMode.NONE
                        org.maplibre.android.location.modes.CameraMode.TRACKING -> UserTrackingMode.FOLLOW
                        org.maplibre.android.location.modes.CameraMode.TRACKING_COMPASS -> UserTrackingMode.FollowWithHeading
                        org.maplibre.android.location.modes.CameraMode.TRACKING_GPS -> UserTrackingMode.FollowWithCourse
                        else -> UserTrackingMode.NONE
                    }

                    updateUserTrackingMode(userTrackingMode)
                }

                override fun onCameraTrackingDismissed() {
                }
            })
        } else {
            mLocationComponentManager!!.setCameraMode(org.maplibre.android.location.modes.CameraMode.NONE)
        }
    }

    fun setMinZoomLevel(zoomLevel: Double) {
        mMinZoomLevel = zoomLevel
        updateMaxMinZoomLevel()
    }

    fun setMaxZoomLevel(zoomLevel: Double) {
        mMaxZoomLevel = zoomLevel
        updateMaxMinZoomLevel()
    }

    fun setZoomLevel(zoomLevel: Double) {
        mZoomLevel = zoomLevel
        updateCameraPositionIfNeeded(false)
    }

    private fun buildCamera(
        previousPosition: CameraPosition, shouldUpdateTarget: Boolean
    ): CameraPosition {
        val builder =
            CameraPosition.Builder(previousPosition).bearing(mHeading).tilt(mPitch).zoom(mZoomLevel)

        if (shouldUpdateTarget) {
            builder.target(GeoJSONUtils.toLatLng(mCenterCoordinate))
        }

        return builder.build()
    }

    private fun updateCameraPositionIfNeeded(shouldUpdateTarget: Boolean) {
        if (mMapView != null) {
            val prevPosition = mMapView!!.cameraPosition
            val cameraUpdate = newCameraPosition(buildCamera(prevPosition, shouldUpdateTarget))

            if (mAnimated) {
                mMapView!!.easeCamera(cameraUpdate)
            } else {
                mMapView!!.moveCamera(cameraUpdate)
            }
        }
    }

    fun setUserTrackingMode(userTrackingMode: Int) {
        val oldTrackingMode = mUserTrackingMode
        mUserTrackingMode = userTrackingMode
        updateUserTrackingMode(userTrackingMode)

        when (mUserTrackingMode) {
            UserTrackingMode.NONE -> mUserTrackingState = UserTrackingState.POSSIBLE
            UserTrackingMode.FOLLOW, UserTrackingMode.FollowWithCourse, UserTrackingMode.FollowWithHeading -> if (oldTrackingMode == UserTrackingMode.NONE) {
                mUserTrackingState = UserTrackingState.POSSIBLE
            }
        }

        if (maplibreMap != null) {
            updateLocationLayer(maplibreMap!!.style!!)
        }
    }


    fun setFollowUserLocation(value: Boolean) {
        mFollowUserLocation = value
        updatedFollowUserMode()
    }

    fun setFollowUserMode(mode: String?) {
        mFollowUserMode = mode
        updatedFollowUserMode()
    }

    private fun updatedFollowUserMode() {
        if (mFollowUserLocation) {
            setUserTrackingMode(UserTrackingMode.fromString(mFollowUserMode))
        } else {
            setUserTrackingMode(UserTrackingMode.NONE)
        }
    }

    private val maplibreMap: MapLibreMap?
        get() {
            if (mMapView == null) {
                return null
            }
            return mMapView!!.mapLibreMap
        }

    /**
     * Create a payload of the location data per the web api geolocation spec
     * https://dev.w3.org/geo/api/spec-source.html#position
     *
     * @return
     */
    private fun makeLocationChangePayload(location: Location): WritableMap {
        val positionProperties: WritableMap = WritableNativeMap()
        val coords: WritableMap = WritableNativeMap()

        coords.putDouble("longitude", location.longitude)
        coords.putDouble("latitude", location.latitude)
        coords.putDouble("altitude", location.altitude)
        coords.putDouble("accuracy", location.accuracy.toDouble())
        // A better solution will be to pull the heading from the compass engine, 
        // unfortunately the api is not publicly available in the mapbox sdk
        coords.putDouble("heading", location.bearing.toDouble())
        coords.putDouble("course", location.bearing.toDouble())
        coords.putDouble("speed", location.speed.toDouble())

        positionProperties.putMap("coords", coords)
        positionProperties.putDouble("timestamp", location.time.toDouble())
        return positionProperties
    }

    companion object {
        const val USER_LOCATION_CAMERA_MOVE_DURATION: Int = 1000

        const val MINIMUM_ZOOM_LEVEL_FOR_USER_TRACKING: Double = 10.5
        const val DEFAULT_ZOOM_LEVEL_FOR_USER_TRACKING: Double = 14.0
    }
}
