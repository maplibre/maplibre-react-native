package org.maplibre.reactnative.components.sources.tilesources.vectorsource

import android.content.Context
import androidx.annotation.Size
import com.facebook.react.bridge.WritableArray
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.sources.VectorSource
import org.maplibre.reactnative.components.sources.tilesources.MLRNPressableTileSource
import org.maplibre.reactnative.utils.GeoJSONUtils

class MLRNVectorSource(context: Context) :
    MLRNPressableTileSource<VectorSource>(context) {


    override fun makeSource(): VectorSource {
        val configurationUrl = url
        if (configurationUrl != null) {
            return VectorSource(mID, url)
        }
        return VectorSource(mID, buildTileset())
    }

    fun querySourceFeatures(
        @Size(min = 1) layerIDs: MutableList<String>,
        filter: Expression?
    ): WritableArray? {
        if (source == null) {
            return null
        }

        val features =
            source!!.querySourceFeatures(layerIDs.toTypedArray<String>(), filter)

        return GeoJSONUtils.fromFeatureList(features)
    }
}
