package org.maplibre.reactnative.components.location

import android.annotation.SuppressLint
import android.content.Context
import org.maplibre.android.location.LocationComponent
import org.maplibre.android.location.LocationComponentActivationOptions
import org.maplibre.android.location.LocationComponentOptions
import org.maplibre.android.location.OnCameraTrackingChangedListener
import org.maplibre.android.location.OnLocationCameraTransitionListener
import org.maplibre.android.location.modes.CameraMode
import org.maplibre.android.location.modes.RenderMode
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.Style
import org.maplibre.reactnative.R
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.location.LocationManager

private const val MAX_CAMERA_PADDING_RETRIES = 1

private data class PendingCameraPadding(
    val generation: Long,
    val padding: DoubleArray,
    val durationMs: Long,
    val onTrackingUnavailable: () -> Unit,
    val failedAttempts: Int = 0,
)

/**
 * The LocationComponent on android implements both location tracking and display of user's current location.
 * LocationComponentManager attempts to separate that, so that Camera can ask for location tracking independent of display of user current location.
 * And NativeUserLocation can ask for display of user's current location - independent of Camera's user tracking.
 */
class LocationComponentManager(
    mapView: MLRNMapView?,
    private val context: Context,
) {
    private var mMapView: MLRNMapView? = null
    private var mMap: MapLibreMap? = null

    private var mLocationManager: LocationManager? = null
    private var mLocationComponent: LocationComponent? = null

    @RenderMode.Mode
    private var mRenderMode: Int = RenderMode.COMPASS

    private var mShowUserLocation = false

    private var mFollowUserLocation = false

    private var mShowingUserLocation = false

    private var mOnCameraTrackingChangedListener: OnCameraTrackingChangedListener? = null

    private var cameraModeTransitionGeneration = 0L
    private var cameraModeTransitionInProgress = false
    private var cameraPaddingGeneration = 0L
    private var pendingCameraPadding: PendingCameraPadding? = null
    private var activeCameraPadding: PendingCameraPadding? = null
    private var cameraPaddingDrainScheduled = false
    private var disposed = false
    private val drainCameraPaddingRunnable =
        Runnable {
            cameraPaddingDrainScheduled = false
            drainPendingCameraPadding()
        }

    init {
        mMapView = mapView
        mMap = mMapView?.mapLibreMap

        mLocationManager = LocationManager.getInstance(context)
    }

    fun showUserLocation(showUserLocation: Boolean) {
        mShowUserLocation = showUserLocation
        stateChanged()
    }

    fun setFollowUserLocation(followUserLocation: Boolean) {
        mFollowUserLocation = followUserLocation
        stateChanged()
    }

    fun setCameraMode(
        @CameraMode.Mode cameraMode: Int,
    ) {
        if (disposed) {
            return
        }

        val component = mLocationComponent ?: return
        val transitionGeneration = ++cameraModeTransitionGeneration
        cameraModeTransitionInProgress = true

        component.setCameraMode(
            cameraMode,
            object : OnLocationCameraTransitionListener {
                override fun onLocationCameraTransitionFinished(cameraMode: Int) {
                    completeCameraModeTransition(transitionGeneration)
                }

                override fun onLocationCameraTransitionCanceled(cameraMode: Int) {
                    completeCameraModeTransition(transitionGeneration)
                }
            },
        )
    }

    fun trySetCameraPaddingWhileTracking(
        padding: DoubleArray,
        durationMs: Long,
        onTrackingUnavailable: () -> Unit,
    ): Boolean {
        if (disposed) {
            return false
        }

        val component = mLocationComponent ?: return false
        val update =
            PendingCameraPadding(
                generation = ++cameraPaddingGeneration,
                padding = padding.copyOf(),
                durationMs = durationMs,
                onTrackingUnavailable = onTrackingUnavailable,
            )
        pendingCameraPadding = update

        if (cameraModeTransitionInProgress) {
            return true
        }

        if (!isCameraTracking(component)) {
            pendingCameraPadding = null
            return false
        }

        drainPendingCameraPadding()
        return true
    }

    fun cancelCameraPaddingAnimation() {
        invalidateCameraPaddingUpdates()

        val component = mLocationComponent
        if (component?.isLocationComponentActivated == true) {
            component.cancelPaddingWhileTrackingAnimation()
        }
    }

    fun onCameraIdle() {
        if (pendingCameraPadding != null) {
            scheduleCameraPaddingDrain()
        }
    }

    fun setRenderMode(
        @RenderMode.Mode renderMode: Int,
    ) {
        mRenderMode = renderMode
        if (mShowingUserLocation) {
            mLocationComponent?.renderMode = renderMode
        }
    }

    fun setPreferredFramesPerSecond(preferredFramesPerSecond: Int) {
        if (preferredFramesPerSecond <= 0) {
            return
        }

        mLocationComponent?.setMaxAnimationFps(preferredFramesPerSecond)
    }

    fun addOnCameraTrackingChangedListener(onCameraTrackingChangedListener: OnCameraTrackingChangedListener?) {
        mOnCameraTrackingChangedListener?.let {
            mLocationComponent?.removeOnCameraTrackingChangedListener(
                it,
            )
        }

        mOnCameraTrackingChangedListener = onCameraTrackingChangedListener

        mOnCameraTrackingChangedListener?.let { mLocationComponent?.addOnCameraTrackingChangedListener(it) }
    }

    @SuppressLint("MissingPermission")
    private fun stateChanged() {
        mLocationComponent?.setLocationComponentEnabled((mFollowUserLocation || mShowUserLocation))

        if (mShowingUserLocation != mShowUserLocation) {
            updateShowUserLocation(mShowUserLocation)
        }

        if (mFollowUserLocation) {
            if (!mShowUserLocation) {
                mLocationComponent?.renderMode = RenderMode.GPS
            } else {
                mLocationComponent?.renderMode = mRenderMode
            }
            mLocationComponent?.onStart()
        } else {
            setCameraMode(CameraMode.NONE)
        }
    }

    fun hasLocationComponent(): Boolean = (mLocationComponent != null)

    fun update(style: Style) {
        update(mShowUserLocation, style)
    }

    fun update(
        displayUserLocation: Boolean,
        style: Style,
    ) {
        val tintColor = mMapView?.tintColor

        if (mLocationComponent == null || tintColor != null) {
            mLocationComponent = mMap?.locationComponent

            val locationComponentActivationOptions: LocationComponentActivationOptions =
                LocationComponentActivationOptions
                    .builder(context, style)
                    .locationComponentOptions(options(displayUserLocation))
                    .build()
            mLocationComponent?.activateLocationComponent(locationComponentActivationOptions)
            mLocationComponent?.locationEngine = mLocationManager!!.engine
            mShowingUserLocation = displayUserLocation
        }

        updateShowUserLocation(displayUserLocation)
        drainPendingCameraPadding()
    }

    private fun completeCameraModeTransition(generation: Long) {
        if (disposed || generation != cameraModeTransitionGeneration) {
            return
        }

        cameraModeTransitionInProgress = false
        scheduleCameraPaddingDrain()
    }

    private fun drainPendingCameraPadding() {
        if (disposed || cameraModeTransitionInProgress) {
            return
        }

        val update = pendingCameraPadding ?: return
        pendingCameraPadding = null
        if (update.generation != cameraPaddingGeneration) {
            return
        }

        val component = mLocationComponent
        if (component != null && isCameraTracking(component)) {
            startCameraPadding(component, update)
        } else {
            update.onTrackingUnavailable()
        }
    }

    private fun startCameraPadding(
        component: LocationComponent,
        update: PendingCameraPadding,
    ) {
        activeCameraPadding = update
        var terminalCallbackReceived = false
        val callback =
            object : MapLibreMap.CancelableCallback {
                override fun onCancel() {
                    if (terminalCallbackReceived) {
                        return
                    }

                    terminalCallbackReceived = true
                    if (disposed || update.generation != cameraPaddingGeneration || activeCameraPadding?.generation != update.generation) {
                        return
                    }

                    activeCameraPadding = null
                    pendingCameraPadding = update.copy(failedAttempts = update.failedAttempts + 1)
                    if (update.failedAttempts < MAX_CAMERA_PADDING_RETRIES) {
                        scheduleCameraPaddingDrain()
                    }
                }

                override fun onFinish() {
                    if (terminalCallbackReceived) {
                        return
                    }

                    terminalCallbackReceived = true
                    if (update.generation != cameraPaddingGeneration || activeCameraPadding?.generation != update.generation) {
                        return
                    }

                    activeCameraPadding = null
                    if (pendingCameraPadding?.generation == cameraPaddingGeneration) {
                        scheduleCameraPaddingDrain()
                    }
                }
            }

        component.paddingWhileTracking(update.padding, update.durationMs, callback)
    }

    private fun scheduleCameraPaddingDrain() {
        if (disposed || cameraPaddingDrainScheduled) {
            return
        }

        val mapView = mMapView ?: return
        cameraPaddingDrainScheduled = true
        mapView.postOnAnimation(drainCameraPaddingRunnable)
    }

    private fun invalidateCameraPaddingUpdates() {
        ++cameraPaddingGeneration
        pendingCameraPadding = null
        activeCameraPadding = null

        if (cameraPaddingDrainScheduled) {
            mMapView?.removeCallbacks(drainCameraPaddingRunnable)
            cameraPaddingDrainScheduled = false
        }
    }

    fun dispose() {
        if (disposed) {
            return
        }

        disposed = true
        ++cameraModeTransitionGeneration
        cameraModeTransitionInProgress = false
        invalidateCameraPaddingUpdates()

        val component = mLocationComponent
        if (component?.isLocationComponentActivated == true) {
            component.cancelPaddingWhileTrackingAnimation()
        }
        mOnCameraTrackingChangedListener?.let { component?.removeOnCameraTrackingChangedListener(it) }

        mOnCameraTrackingChangedListener = null
        mLocationComponent = null
        mLocationManager = null
        mMap = null
        mMapView = null
    }

    private fun isCameraTracking(component: LocationComponent): Boolean =
        component.isLocationComponentActivated && component.isLocationComponentEnabled && component.cameraMode != CameraMode.NONE

    private fun updateShowUserLocation(displayUserLocation: Boolean) {
        if (mShowingUserLocation != displayUserLocation) {
            mLocationComponent?.applyStyle(options(displayUserLocation))
            mShowingUserLocation = displayUserLocation
        }
    }

    fun options(displayUserLocation: Boolean): LocationComponentOptions {
        var builder: LocationComponentOptions.Builder = LocationComponentOptions.builder(context)
        val tintColor = mMapView?.tintColor
        if (!displayUserLocation) {
            builder =
                builder
                    .padding(mMap?.getPadding())
                    .backgroundDrawable(R.drawable.empty)
                    .backgroundDrawableStale(R.drawable.empty)
                    .bearingDrawable(R.drawable.empty)
                    .foregroundDrawable(R.drawable.empty)
                    .foregroundDrawableStale(R.drawable.empty)
                    .gpsDrawable(R.drawable.empty)
                    .accuracyAlpha(0.0f)
        } else if (tintColor != null) {
            builder =
                builder
                    .enableStaleState(false)
                    .bearingTintColor(tintColor)
                    .foregroundTintColor(tintColor)
                    .accuracyColor(tintColor)
        }
        return builder.build()
    }
}
