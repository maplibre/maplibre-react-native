package org.maplibre.reactnative.components.mapview

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import org.maplibre.android.geometry.LatLng
import org.maplibre.reactnative.NativeMapViewModuleSpec
import org.maplibre.reactnative.utils.ConvertUtils
import org.maplibre.reactnative.utils.ExpressionParser
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
        reactTag: ReactTag, promise: Promise, fn: (MLRNMapView) -> Unit
    ) {
        reactTagResolver.withViewResolved(reactTag.toInt(), promise, fn)
    }

    override fun getCenter(reactTag: Double, promise: Promise) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getCenter())
        }
    }

    override fun getZoom(reactTag: Double, promise: Promise) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getZoom())
        }
    }

    override fun getBearing(reactTag: Double, promise: Promise) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getBearing())
        }
    }

    override fun getPitch(reactTag: Double, promise: Promise) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getPitch())
        }
    }

    override fun getBounds(reactTag: Double, promise: Promise) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getBounds())
        }
    }

    override fun getViewState(reactTag: Double, promise: Promise) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getViewState())
        }
    }

    override fun project(
        reactTag: Double, coordinate: ReadableMap, promise: Promise
    ) {
        withViewportOnUIThread(reactTag, promise) { mapView ->
            promise.resolve(
                mapView.project(
                    LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude"))
                )
            )
        }
    }

    override fun unproject(
        reactTag: Double, point: ReadableMap, promise: Promise
    ) {
        withViewportOnUIThread(reactTag, promise) { mapView ->
            promise.resolve(mapView.unproject(ConvertUtils.toPointF(point)))
        }
    }

    override fun queryRenderedFeaturesAtPoint(
        reactTag: Double,
        point: ReadableMap,
        layers: ReadableArray,
        filter: ReadableArray?,
        promise: Promise
    ) {
        withViewportOnUIThread(reactTag, promise) { mapView ->
            promise.resolve(
                mapView.queryRenderedFeaturesAtPoint(
                    ConvertUtils.toPointF(point), layers, ExpressionParser.from(filter),
                )
            )
        }
    }

    override fun queryRenderedFeaturesInRect(
        reactTag: Double,
        bbox: ReadableArray?,
        layers: ReadableArray?,
        filter: ReadableArray?,
        promise: Promise
    ) {
        withViewportOnUIThread(reactTag, promise) { mapView ->
            promise.resolve(
                mapView.queryRenderedFeaturesInRect(
                    ConvertUtils.toRectF(bbox), layers, ExpressionParser.from(filter),
                )
            )
        }
    }

    override fun setSourceVisibility(
        reactTag: Double,
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
        reactTag: Double, writeToDisk: Boolean, promise: Promise
    ) {
        withViewportOnUIThread(reactTag, promise) {
            it.takeSnap(writeToDisk) { payload ->
                promise.resolve(payload)
            }
        }
    }

    override fun showAttribution(
        reactTag: Double, promise: Promise
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.showAttribution())
        }
    }
}
