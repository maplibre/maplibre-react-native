package org.maplibre.reactnative.components.images

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import org.maplibre.reactnative.components.AbstractEventEmitter
import org.maplibre.reactnative.events.constants.EventKeys
import org.maplibre.reactnative.utils.ImageEntry

class MLRNImagesManager(private val reactContext: ReactApplicationContext) :
    AbstractEventEmitter<MLRNImages>(reactContext) {

    companion object {
        const val REACT_CLASS = "MLRNImages"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(context: ThemedReactContext): MLRNImages {
        return MLRNImages(context, this)
    }

    /**
     * Set unified images prop.
     * Values can be:
     * - String: Native asset name (simple name like "pin") or URL (starts with http/https/file//)
     * - Map: { uri: string, scale?: number, sdf?: boolean }
     */
    @ReactProp(name = "images")
    fun setImages(images: MLRNImages, map: ReadableMap?) {
        if (map == null) return

        val imagesList = mutableListOf<Map.Entry<String, ImageEntry>>()
        val iterator = map.keySetIterator()

        while (iterator.hasNextKey()) {
            val imageName = iterator.nextKey()
            val imageEntry: ImageEntry = when (map.getType(imageName)) {
                ReadableType.Map -> {
                    // It's a remote image with uri/scale/sdf
                    val imageMap = map.getMap(imageName)!!
                    val uri = imageMap.getString("uri") ?: ""
                    val hasScale = imageMap.hasKey("scale") && imageMap.getType("scale") == ReadableType.Number
                    val scale = if (hasScale) imageMap.getDouble("scale") else ImageEntry.defaultScale
                    val hasSdf = imageMap.hasKey("sdf") && imageMap.getType("sdf") == ReadableType.Boolean
                    val sdf = hasSdf && imageMap.getBoolean("sdf")
                    ImageEntry(uri, scale).apply { this.sdf = sdf }
                }
                ReadableType.String -> {
                    // It's either a native asset name or a URL string
                    val stringValue = map.getString(imageName) ?: ""
                    ImageEntry(stringValue)
                }
                else -> continue
            }
            imagesList.add(java.util.AbstractMap.SimpleEntry(imageName, imageEntry))
        }

        images.setImages(imagesList, reactContext)
    }

    @ReactProp(name = "hasOnImageMissing")
    fun setHasOnImageMissing(images: MLRNImages, value: Boolean) {
        images.setHasOnImageMissing(value)
    }

    override fun customEvents(): Map<String, String> {
        return MapBuilder.builder<String, String>()
            .put(EventKeys.IMAGES_MISSING, "onImageMissing")
            .build()
    }
}
