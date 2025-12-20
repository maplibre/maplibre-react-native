package org.maplibre.reactnative.components.sources.shapesource

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import org.maplibre.reactnative.NativeShapeSourceModuleSpec
import org.maplibre.reactnative.utils.ExpressionParser
import org.maplibre.reactnative.utils.ReactTag
import org.maplibre.reactnative.utils.ReactTagResolver

@ReactModule(name = NativeShapeSourceModuleSpec.NAME)
class MLRNShapeSourceModule(
    reactContext: ReactApplicationContext, private val reactTagResolver: ReactTagResolver
) : NativeShapeSourceModuleSpec(reactContext) {
    companion object {
        const val NAME = "MLRNShapeSourceModule"
    }

    private fun withViewportOnUIThread(
        reactTag: ReactTag, promise: Promise, fn: (MLRNShapeSource) -> Unit
    ) {
        reactTagResolver.withViewResolved(reactTag.toInt(), promise, fn)
    }

    override fun getData(
        reactTag: Double, filter: ReadableArray?, promise: Promise
    ) {
        withViewportOnUIThread(reactTag, promise) { shapeSource ->
            promise.resolve(
                shapeSource.getData(
                    ExpressionParser.from(filter),
                )
            )
        }
    }

    override fun getClusterExpansionZoom(reactTag: Double, clusterId: Double, promise: Promise) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getClusterExpansionZoom(clusterId.toInt()))
        }
    }

    override fun getClusterLeaves(
        reactTag: Double,
        clusterId: Double,
        limit: Double,
        offset: Double,
        promise: Promise?
    ) {
        TODO("Not yet implemented")
    }

    override fun getClusterChildren(
        reactTag: Double,
        clusterId: Double,
        promise: Promise?
    ) {
        TODO("Not yet implemented")
    }

//    override fun getZoom(reactTag: Double, promise: Promise) {
//        withViewportOnUIThread(reactTag, promise) {
//            promise.resolve(it.getZoom())
//        }
//    }
//
//    override fun getBearing(reactTag: Double, promise: Promise) {
//        withViewportOnUIThread(reactTag, promise) {
//            promise.resolve(it.getBearing())
//        }
//    }
//
//    override fun getPitch(reactTag: Double, promise: Promise) {
//        withViewportOnUIThread(reactTag, promise) {
//            promise.resolve(it.getPitch())
//        }
//    }
//
//    override fun getBounds(reactTag: Double, promise: Promise) {
//        withViewportOnUIThread(reactTag, promise) {
//            promise.resolve(it.getBounds())
//        }
//    }
//
//    override fun getViewState(reactTag: Double, promise: Promise) {
//        withViewportOnUIThread(reactTag, promise) {
//            promise.resolve(it.getViewState())
//        }
//    }
//
//    override fun project(
//        reactTag: Double, coordinate: ReadableMap, promise: Promise
//    ) {
//        withViewportOnUIThread(reactTag, promise) { shapeSource ->
//            promise.resolve(
//                shapeSource.project(
//                    LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude"))
//                )
//            )
//        }
//    }
//
//    override fun unproject(
//        reactTag: Double, point: ReadableMap, promise: Promise
//    ) {
//        withViewportOnUIThread(reactTag, promise) { mapView ->
//            promise.resolve(mapView.unproject(ConvertUtils.toPointF(point)))
//        }
//    }
//
//    override fun queryRenderedFeaturesWithCoordinate(
//        reactTag: Double,
//        coordinate: ReadableMap,
//        layers: ReadableArray?,
//        filter: ReadableArray?,
//        promise: Promise
//    ) {
//        withViewportOnUIThread(reactTag, promise) { mapView ->
//            promise.resolve(
//                mapView.queryRenderedFeaturesWithCoordinate(
//                    LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")),
//                    layers,
//                    ExpressionParser.from(filter),
//                )
//            )
//        }
//    }
//
//    override fun queryRenderedFeaturesWithBounds(
//        reactTag: Double,
//        bounds: ReadableArray?,
//        layers: ReadableArray?,
//        filter: ReadableArray?,
//        promise: Promise
//    ) {
//        withViewportOnUIThread(reactTag, promise) { mapView ->
//            promise.resolve(
//                mapView.queryRenderedFeaturesWithBounds(
//                    if (bounds != null && bounds.size() == 4) LatLngBounds.from(
//                        bounds.getDouble(3),
//                        bounds.getDouble(2),
//                        bounds.getDouble(1),
//                        bounds.getDouble(0)
//                    )
//                    else LatLngBounds.world(),
//                    layers, ExpressionParser.from(filter),
//                )
//            )
//        }
//    }
//
//    override fun setSourceVisibility(
//        reactTag: Double,
//        visible: Boolean,
//        sourceId: String,
//        sourceLayerId: String?,
//        promise: Promise
//    ) {
//        withViewportOnUIThread(reactTag, promise) {
//            promise.resolve(it.setSourceVisibility(visible, sourceId, sourceLayerId))
//        }
//    }
//
//    override fun takeSnap(
//        reactTag: Double, writeToDisk: Boolean, promise: Promise
//    ) {
//        withViewportOnUIThread(reactTag, promise) {
//            it.takeSnap(writeToDisk) { payload ->
//                promise.resolve(payload)
//            }
//        }
//    }
//
//    override fun showAttribution(
//        reactTag: Double, promise: Promise
//    ) {
//        withViewportOnUIThread(reactTag, promise) {
//            promise.resolve(it.showAttribution())
//        }
//    }
}
