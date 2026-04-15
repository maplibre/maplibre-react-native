package org.maplibre.reactnative.components.layer.style

import android.content.Context
import com.facebook.react.bridge.ReadableMap
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.reactnative.utils.DownloadMapImageTask
import org.maplibre.reactnative.utils.DownloadMapImageTask.OnAllImagesLoaded
import org.maplibre.reactnative.utils.ImageEntry
import java.util.AbstractMap

class MLRNStyle(
    private val mContext: Context,
    reactStyle: ReadableMap,
    map: MapLibreMap,
) {
    private val mReactStyle: ReadableMap = reactStyle
    private val mMap: MapLibreMap = map

    val allStyleKeys: MutableList<String>
        get() {
            val it = mReactStyle.keySetIterator()
            val keys: MutableList<String> =
                ArrayList()

            while (it.hasNextKey()) {
                val key = it.nextKey()
                keys.add(key)
            }

            return keys
        }

    fun getStyleValueForKey(styleKey: String): MLRNStyleValue {
        val styleValueConfig =
            mReactStyle.getMap(styleKey)
                ?: throw IllegalArgumentException("Style value for key \"$styleKey\" is null")

        return MLRNStyleValue(styleValueConfig)
    }

    fun imageEntry(styleValue: MLRNStyleValue): ImageEntry = ImageEntry(styleValue.imageURI, styleValue.imageScale, false)

    fun addImage(
        styleValue: MLRNStyleValue,
        callback: OnAllImagesLoaded? = null,
    ) {
        if (!styleValue.shouldAddImage()) {
            callback?.onAllImagesLoaded()
            return
        }

        val uriStr = styleValue.imageURI!!
        val images: Array<Map.Entry<String, ImageEntry>> =
            arrayOf(
                AbstractMap.SimpleEntry(uriStr, imageEntry(styleValue)),
            )
        val task = DownloadMapImageTask(mContext, mMap, callback)
        task.execute(*images)
    }
}
