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
        reactApplicationContext.runOnUiQueueThread { MapLibre.getInstance(reactApplicationContext) }
    }

    private fun withViewportOnUIThread(
        reactTag: ReactTag,
        promise: Promise,
        fn: (MLRNMapView) -> Unit,
    ) {
        reactTagResolver.withViewResolved(reactTag.toInt(), promise, fn)
    }

    override fun getCenter(
        reactTag: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getCenter())
        }
    }

    override fun getZoom(
        reactTag: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getZoom())
        }
    }

    override fun getBearing(
        reactTag: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getBearing())
        }
    }

    override fun getPitch(
        reactTag: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getPitch())
        }
    }

    override fun getBounds(
        reactTag: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getBounds())
        }
    }

    override fun getViewState(
        reactTag: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getViewState())
        }
    }

    override fun project(
        reactTag: Double,
        lngLat: ReadableArray,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { mapView ->
            promise.resolve(
                mapView.project(
                    GeoJSONUtils.toLatLng(lngLat)!!,
                ),
            )
        }
    }

    override fun unproject(
        reactTag: Double,
        pixelPoint: ReadableArray,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { mapView ->
            promise.resolve(mapView.unproject(ConvertUtils.toPointF(pixelPoint)))
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
