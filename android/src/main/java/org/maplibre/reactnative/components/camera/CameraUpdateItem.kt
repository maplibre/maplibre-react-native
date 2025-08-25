package org.maplibre.reactnative.components.camera

import org.maplibre.android.camera.CameraUpdate
import org.maplibre.android.constants.MapLibreConstants
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.MapLibreMap.CancelableCallback
import org.maplibre.reactnative.components.camera.constants.CameraMode
import java.lang.ref.WeakReference
import java.util.concurrent.ExecutionException
import java.util.concurrent.RunnableFuture
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException

class CameraUpdateItem(
    map: MapLibreMap?,
    private val mCameraUpdate: CameraUpdate,
    val duration: Int,
    private val mCallback: CancelableCallback?,
    @param:CameraMode.Mode private val mCameraMode: Int
) : RunnableFuture<Void?> {
    private var isCameraActionFinished = false
    private var isCameraActionCancelled = false

    private val mMap: WeakReference<MapLibreMap?>

    init {
        mMap = WeakReference<MapLibreMap?>(map)
    }

    override fun run() {
        val callback: CancelableCallback = object : CancelableCallback {
            override fun onCancel() {
                handleCallbackResponse(true)
            }

            override fun onFinish() {
                handleCallbackResponse(false)
            }
        }

        val map = mMap.get()
        if (map == null) {
            isCameraActionCancelled = true
            return
        }

        // animateCamera / easeCamera only allows positive duration
        if (this.duration == 0 || mCameraMode == CameraMode.NONE) {
            map.moveCamera(mCameraUpdate, callback)
            return
        }

        // On iOS a duration of -1 means default or dynamic duration (based on flight-path length)
        // On Android we can fallback to MapLibre's default duration as there is no such API
        val duration =
            if (this.duration < 0) MapLibreConstants.ANIMATION_DURATION else this.duration

        if (mCameraMode == CameraMode.FLIGHT) {
            map.animateCamera(mCameraUpdate, duration, callback)
        } else if (mCameraMode == CameraMode.LINEAR) {
            map.easeCamera(mCameraUpdate, duration, false, callback)
        } else if (mCameraMode == CameraMode.EASE) {
            map.easeCamera(mCameraUpdate, duration, true, callback)
        }
    }

    override fun cancel(mayInterruptIfRunning: Boolean): Boolean {
        return false
    }

    override fun isCancelled(): Boolean {
        return isCameraActionCancelled
    }

    override fun isDone(): Boolean {
        return isCameraActionFinished
    }

    @Throws(InterruptedException::class, ExecutionException::class)
    override fun get(): Void? {
        return null
    }

    @Throws(InterruptedException::class, ExecutionException::class, TimeoutException::class)
    override fun get(timeout: Long, unit: TimeUnit): Void? {
        return null
    }

    private fun handleCallbackResponse(isCancel: Boolean) {
        if (mCallback == null) {
            return
        }

        isCameraActionCancelled = isCancel
        isCameraActionFinished = !isCancel

        if (isCancel) {
            mCallback.onCancel()
        } else {
            mCallback.onFinish()
        }
    }
}
