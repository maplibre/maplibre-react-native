package org.maplibre.reactnative.components.sources.tilesources.vectorsource

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.google.gson.JsonObject
import org.maplibre.reactnative.NativeVectorSourceModuleSpec
import org.maplibre.reactnative.utils.ConvertUtils
import org.maplibre.reactnative.utils.ExpressionParser
import org.maplibre.reactnative.utils.ReactTag
import org.maplibre.reactnative.utils.ReactTagResolver

@ReactModule(name = NativeVectorSourceModuleSpec.NAME)
class MLRNVectorSourceModule(
    reactContext: ReactApplicationContext,
    private val reactTagResolver: ReactTagResolver,
) : NativeVectorSourceModuleSpec(reactContext) {
    companion object {
        const val NAME = "MLRNVectorSourceModule"
    }

    private fun withViewportOnUIThread(
        reactTag: ReactTag,
        promise: Promise,
        fn: (MLRNVectorSource) -> Unit,
    ) {
        reactTagResolver.withViewResolved(reactTag.toInt(), promise, fn)
    }

    override fun querySourceFeatures(
        reactTag: Double,
        sourceLayer: String,
        filter: ReadableArray,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { vectorSource ->
            promise.resolve(
                vectorSource.querySourceFeatures(
                    mutableListOf(sourceLayer),
                    ExpressionParser.from(filter),
                ),
            )
        }
    }

    override fun setFeatureState(
        reactTag: Double,
        sourceLayer: String,
        featureId: String,
        state: ReadableMap,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { vectorSource ->
            val jsonState = ConvertUtils.toJsonObject(state) ?: JsonObject()

            if (vectorSource.setFeatureState(sourceLayer, featureId, jsonState)) {
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
        sourceLayer: String,
        featureId: String,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { vectorSource ->
            promise.resolve(
                vectorSource.getFeatureState(sourceLayer, featureId)?.let {
                    ConvertUtils.toWritableMap(it)
                },
            )
        }
    }

    override fun removeFeatureState(
        reactTag: Double,
        sourceLayer: String,
        featureId: String?,
        key: String?,
        promise: Promise,
    ) {
        withViewportOnUIThread(reactTag, promise) { vectorSource ->
            if (vectorSource.removeFeatureState(sourceLayer, featureId, key)) {
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
