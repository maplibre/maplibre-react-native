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
        promise: Promise
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getClusterLeaves(clusterId.toInt(), limit.toInt(), offset.toInt()))
        }
    }

    override fun getClusterChildren(
        reactTag: Double,
        clusterId: Double,
        promise: Promise
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getClusterChildren(clusterId.toInt()))
        }
    }
}
