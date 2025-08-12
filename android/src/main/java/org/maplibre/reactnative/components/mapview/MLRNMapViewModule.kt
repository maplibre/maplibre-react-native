package org.maplibre.reactnative.components.mapview

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import org.maplibre.reactnative.NativeMapViewModuleSpec
import org.maplibre.reactnative.utils.ReactTag
import org.maplibre.reactnative.utils.ReactTagResolver

@ReactModule(name = NativeMapViewModuleSpec.NAME)
class MLRNMapViewModule(
    reactContext: ReactApplicationContext, private val reactTagResolver: ReactTagResolver
) : NativeMapViewModuleSpec(reactContext) {
    companion object {
        const val NAME = "MLRNMapViewModule"
    }

    private fun withViewportOnUIThread(
        reactTag: ReactTag?, promise: Promise, fn: (MLRNMapView) -> Unit
    ) {
        if (reactTag == null) {
            promise.reject(Exception("reactTag is null"))
        } else {
            reactTagResolver.withViewResolved(reactTag.toInt(), promise, fn)
        }
    }

    override fun getCenter(reactTag: Double?, promise: Promise) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getCenter())
        }
    }

    override fun getZoom(reactTag: Double?, promise: Promise) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getZoom())
        }
    }

    override fun getVisibleBounds(
        reactTag: Double?, promise: Promise
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getVisibleBounds())
        }
    }

    override fun getPointInView(
        reactTag: Double?, coordinate: ReadableArray?, promise: Promise
    ) {
        TODO("Not yet implemented")
    }

    override fun getCoordinateFromView(
        reactTag: Double?, point: ReadableArray?, promise: Promise
    ) {
        TODO("Not yet implemented")
    }

    override fun queryRenderedFeaturesAtPoint(
        reactTag: Double?,
        point: ReadableArray?,
        layerIds: ReadableArray?,
        filter: ReadableArray?,
        promise: Promise
    ) {
        TODO("Not yet implemented")
    }

    override fun queryRenderedFeaturesInRect(
        reactTag: Double?,
        bbox: ReadableArray?,
        layerIds: ReadableArray?,
        filter: ReadableArray?,
        promise: Promise
    ) {
        TODO("Not yet implemented")
//         withViewportOnUIThread(reactTag, promise) {
//             promise.resolve(it.queryRenderedFeaturesInRect(bbox, layerIds, filter))
        // }
    }

    override fun setSourceVisibility(
        reactTag: Double?,
        visible: Boolean,
        sourceId: String,
        sourceLayerId: String?,
        promise: Promise
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.setSourceVisibility(visible, sourceId, sourceLayerId))
        }
    }


    override fun takeSnap(
        reactTag: Double?, writeToDisk: Boolean, promise: Promise
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.takeSnap(writeToDisk))
        }
    }

    override fun showAttribution(
        reactTag: Double?, promise: Promise
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.showAttribution())
        }
    }
}
