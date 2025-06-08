package org.maplibre.reactnative.components.camera

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import org.maplibre.reactnative.NativeCameraModuleSpec
import org.maplibre.reactnative.utils.ViewRefTag
import org.maplibre.reactnative.utils.ViewTagResolver


class MLRNCameraModule(context: ReactApplicationContext, private val viewTagResolver: ViewTagResolver) :
    NativeCameraModuleSpec(context) {
    companion object {
        const val NAME = "MLRNCameraModule"
    }

    private fun withViewportOnUIThread(
        viewRef: ViewRefTag?,
        reject: Promise,
        fn: (MLRNCamera) -> Unit
    ) {
        if (viewRef == null) {
            reject.reject(Exception("viewRef is null"))
        } else {
            viewTagResolver.withViewResolved(viewRef.toInt(), reject, fn)
        }
    }


    override fun setCamera(viewRef: ViewRefTag?, stop: ReadableArray, promise: Promise) {
        withViewportOnUIThread(viewRef, promise) {
            for (index in 0 until stop.size()) {
                it.setStop(stop.getMap(index)!!)
            }

            promise.resolve(null)
        }
    }
}