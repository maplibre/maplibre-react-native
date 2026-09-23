package org.maplibre.reactnative.components.sources.geojsonsource

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.google.gson.JsonObject
import org.maplibre.reactnative.NativeGeoJSONSourceModuleSpec
import org.maplibre.reactnative.utils.ConvertUtils
import org.maplibre.reactnative.utils.ExpressionParser
import org.maplibre.reactnative.utils.ReactTag
import org.maplibre.reactnative.utils.ReactTagResolver

@ReactModule(name = NativeGeoJSONSourceModuleSpec.NAME)
class MLRNGeoJSONSourceModule(
    reactContext: ReactApplicationContext,
    private val reactTagResolver: ReactTagResolver,
) : NativeGeoJSONSourceModuleSpec(reactContext) {
    companion object {
        const val NAME = "MLRNGeoJSONSourceModule"
    }

    private fun withViewportOnUIThread(
        reactTag: ReactTag,
        promise: Promise,
        fn: (MLRNGeoJSONSource) -> Unit,
    ) {
        reactTagResolver.withViewResolved(reactTag.toInt(), promise, fn)
    }

    override fun getData(
        reactTag: Double,
        filter: ReadableArray?,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { shapeSource ->
            promise.resolve(
                shapeSource.getData(
                    ExpressionParser.from(filter),
                ),
            )
        }
    }

    override fun getClusterExpansionZoom(
        reactTag: Double,
        clusterId: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getClusterExpansionZoom(clusterId.toInt()))
        }
    }

    override fun getClusterLeaves(
        reactTag: Double,
        clusterId: Double,
        limit: Double,
        offset: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getClusterLeaves(clusterId.toInt(), limit.toInt(), offset.toInt()))
        }
    }

    override fun getClusterChildren(
        reactTag: Double,
        clusterId: Double,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) {
            promise.resolve(it.getClusterChildren(clusterId.toInt()))
        }
    }

    override fun setFeatureState(
        reactTag: Double,
        featureId: String,
        state: ReadableMap,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { shapeSource ->
            val jsonState = ConvertUtils.toJsonObject(state) ?: JsonObject()

            if (shapeSource.setFeatureState(featureId, jsonState)) {
                promise.resolve(null)
            } else {
                promise.reject(
                    "source_not_attached",
                    "Source is not attached to a map, feature state was not set",
                )
            }
        }
    }

    override fun getFeatureState(
        reactTag: Double,
        featureId: String,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { shapeSource ->
            promise.resolve(
                shapeSource.getFeatureState(featureId)?.let { ConvertUtils.toWritableMap(it) },
            )
        }
    }

    override fun removeFeatureState(
        reactTag: Double,
        featureId: String?,
        key: String?,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { shapeSource ->
            if (shapeSource.removeFeatureState(featureId, key)) {
                promise.resolve(null)
            } else {
                promise.reject(
                    "source_not_attached",
                    "Source is not attached to a map, feature state was not removed",
                )
            }
        }
    }
}
