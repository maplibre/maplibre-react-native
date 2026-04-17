package org.maplibre.reactnative.components.camera

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import org.maplibre.reactnative.NativeCameraModuleSpec
import org.maplibre.reactnative.utils.ReactTag
import org.maplibre.reactnative.utils.ReactTagResolver

class MLRNCameraModule(
    context: ReactApplicationContext,
    private val reactTagResolver: ReactTagResolver,
) : NativeCameraModuleSpec(context) {
    companion object {
        const val NAME = "MLRNCameraModule"
    }

    private fun withViewportOnUIThread(
        reactTag: ReactTag,
        reject: Promise,
        fn: (MLRNCamera) -> Unit,
    ) {
        reactTagResolver.withViewResolved(reactTag.toInt(), reject, fn)
    }

    override fun setStop(
        reactTag: ReactTag,
        stop: ReadableMap,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            it.handleImperativeStop(stop)
            promise.resolve(null)
        }
    }
}
