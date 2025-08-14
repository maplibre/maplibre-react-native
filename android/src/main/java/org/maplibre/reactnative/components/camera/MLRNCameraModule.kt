package org.maplibre.reactnative.components.camera

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import org.maplibre.reactnative.NativeCameraModuleSpec
import org.maplibre.reactnative.utils.ReactTag
import org.maplibre.reactnative.utils.ReactTagResolver


class MLRNCameraModule(context: ReactApplicationContext, private val reactTagResolver: ReactTagResolver) :
    NativeCameraModuleSpec(context) {
    companion object {
        const val NAME = "MLRNCameraModule"
    }

    private fun withViewportOnUIThread(
        reactTag: ReactTag?,
        reject: Promise,
        fn: (MLRNCamera) -> Unit
    ) {
        if (reactTag == null) {
            reject.reject(Exception("reactTag is null"))
        } else {
            reactTagResolver.withViewResolved(reactTag.toInt(), reject, fn)
        }
    }


    override fun setCamera(reactTag: ReactTag?, stop: ReadableArray, promise: Promise) {
        withViewportOnUIThread(reactTag, promise) {
            for (index in 0 until stop.size()) {
                it.setStop(stop.getMap(index)!!)
            }

            promise.resolve(null)
        }
    }
}