package org.maplibre.reactnative.components.mapview

import android.graphics.RectF
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import org.maplibre.android.MapLibre
import org.maplibre.reactnative.NativeMapViewModuleSpec
import org.maplibre.reactnative.utils.ConvertUtils
import org.maplibre.reactnative.utils.ExpressionParser
import org.maplibre.reactnative.utils.GeoJSONUtils
import org.maplibre.reactnative.utils.ReactTag
import org.maplibre.reactnative.utils.ReactTagResolver

@ReactModule(name = NativeMapViewModuleSpec.NAME)
class MLRNMapViewModule(
    reactContext: ReactApplicationContext,
    private val reactTagResolver: ReactTagResolver,
) : NativeMapViewModuleSpec(reactContext) {
    companion object {
        const val NAME = "MLRNMapViewModule"
    }

    override fun initialize() {
        reactApplicationContext.runOnUiQueueThread {
            MapLibre.getInstance(reactApplicationContext.applicationContext)
        }
    }

    private fun withViewportOnUIThread(
        reactTag: ReactTag,
        promise: Promise,
        fn: (MLRNMapView) -> Unit,
    ) {
        reactTagResolver.withViewResolved(reactTag.toInt(), promise, fn)
    }

    private fun rejectMapNotReady(promise: Promise, value: Any?): Boolean {
        if (value == null) {
            promise.reject("E_MAP_NOT_READY", "Map is not ready for imperative viewport read")
            return true
        }
        return false
    }

    override fun getCenter(
        reactTag: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            val center = it.getCenter()
            if (!rejectMapNotReady(promise, center)) {
                promise.resolve(center)
            }
        }
    }

    override fun getZoom(
        reactTag: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            val zoom = it.getZoom()
            if (!rejectMapNotReady(promise, zoom)) {
                promise.resolve(zoom)
            }
        }
    }

    override fun getBearing(
        reactTag: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            val bearing = it.getBearing()
            if (!rejectMapNotReady(promise, bearing)) {
                promise.resolve(bearing)
            }
        }
    }

    override fun getPitch(
        reactTag: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            val pitch = it.getPitch()
            if (!rejectMapNotReady(promise, pitch)) {
                promise.resolve(pitch)
            }
        }
    }

    override fun getBounds(
        reactTag: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            val bounds = it.getBounds()
            if (!rejectMapNotReady(promise, bounds)) {
                promise.resolve(bounds)
            }
        }
    }

    override fun getViewState(
        reactTag: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            val viewState = it.getViewState()
            if (!rejectMapNotReady(promise, viewState)) {
                promise.resolve(viewState)
            }
        }
    }

    override fun project(
        reactTag: Double,
        lngLat: ReadableArray,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { mapView ->
            val projected = mapView.project(
                GeoJSONUtils.toLatLng(lngLat)!!,
            )
            if (!rejectMapNotReady(promise, projected)) {
                promise.resolve(projected)
            }
        }
    }

    override fun unproject(
        reactTag: Double,
        pixelPoint: ReadableArray,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { mapView ->
            val unprojected = mapView.unproject(ConvertUtils.toPointF(pixelPoint))
            if (!rejectMapNotReady(promise, unprojected)) {
                promise.resolve(unprojected)
            }
        }
    }

    override fun queryRenderedFeaturesWithPoint(
        reactTag: Double,
        pixelPoint: ReadableArray,
        layers: ReadableArray?,
        filter: ReadableArray?,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { mapView ->
            promise.resolve(
                mapView.queryRenderedFeaturesWithPoint(
                    ConvertUtils.toPointF(pixelPoint),
                    layers,
                    ExpressionParser.from(filter),
                ),
            )
        }
    }

    override fun queryRenderedFeaturesWithBounds(
        reactTag: Double,
        pixelPointBounds: ReadableArray?,
        layers: ReadableArray?,
        filter: ReadableArray?,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { mapView ->
            val rect =
                if (pixelPointBounds == null) {
                    null
                } else {
                    val topLeft = pixelPointBounds.getArray(0)
                    val bottomRight = pixelPointBounds.getArray(1)

                    RectF(
                        topLeft!!.getDouble(0).toFloat(),
                        topLeft.getDouble(1).toFloat(),
                        bottomRight!!.getDouble(0).toFloat(),
                        bottomRight.getDouble(1).toFloat(),
                    )
                }

            promise.resolve(
                mapView.queryRenderedFeaturesWithRect(
                    rect,
                    layers,
                    ExpressionParser.from(filter),
                ),
            )
        }
    }

    override fun setSourceVisibility(
        reactTag: Double,
        visible: Boolean,
        sourceId: String,
        sourceLayerId: String?,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            it.setSourceVisibility(visible, sourceId, sourceLayerId)
            promise.resolve(null)
        }
    }

    override fun createStaticMapImage(
        reactTag: Double,
        output: String,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            it.takeSnap(output == "file") { payload ->
                promise.resolve(payload)
            }
        }
    }

    override fun showAttribution(
        reactTag: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            it.showAttribution()
            promise.resolve(null)
        }
    }
}
