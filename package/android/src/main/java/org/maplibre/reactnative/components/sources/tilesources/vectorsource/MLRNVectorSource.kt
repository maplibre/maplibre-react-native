package org.maplibre.reactnative.components.sources.tilesources.vectorsource

import android.content.Context
import androidx.annotation.Size
import com.facebook.react.bridge.WritableArray
import com.google.gson.JsonObject
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.sources.VectorSource
import org.maplibre.reactnative.components.sources.tilesources.MLRNPressableTileSource
import org.maplibre.reactnative.utils.GeoJSONUtils

class MLRNVectorSource(
    context: Context,
) : MLRNPressableTileSource<VectorSource>(context) {
    override fun makeSource(): VectorSource {
        validate()

        if (!url.isNullOrEmpty()) {
            return VectorSource(mID, url)
        }

        return VectorSource(mID, buildTileset())
    }

    fun querySourceFeatures(
        @Size(min = 1) layerIDs: MutableList<String>,
        filter: Expression?,
    ): WritableArray? {
        if (source == null) {
            return null
        }

        val features =
            source!!.querySourceFeatures(layerIDs.toTypedArray<String>(), filter)

        return GeoJSONUtils.fromFeatureList(features)
    }

    fun setFeatureState(
        sourceLayerId: String,
        featureId: String,
        state: JsonObject,
    ): Boolean = source?.setFeatureState(sourceLayerId, featureId, state) ?: false

    fun getFeatureState(
        sourceLayerId: String,
        featureId: String,
    ): JsonObject? = source?.getFeatureState(sourceLayerId, featureId)

    fun removeFeatureState(
        sourceLayerId: String,
        featureId: String?,
        key: String?,
    ): Boolean = source?.removeFeatureState(sourceLayerId, featureId, key) ?: false
}
