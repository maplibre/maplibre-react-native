package org.maplibre.reactnative.components.images

import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableType
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.MLRNImagesManagerDelegate
import com.facebook.react.viewmanagers.MLRNImagesManagerInterface
import org.maplibre.reactnative.utils.ImageEntry

@ReactModule(name = MLRNImagesManager.REACT_CLASS)
class MLRNImagesManager(
    private val context: ReactApplicationContext,
) : ViewGroupManager<MLRNImages>(),
    MLRNImagesManagerInterface<MLRNImages> {
    companion object {
        const val REACT_CLASS = "MLRNImages"
    }

    private val delegate: MLRNImagesManagerDelegate<MLRNImages, MLRNImagesManager> =
        MLRNImagesManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<MLRNImages> = delegate

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(context: ThemedReactContext): MLRNImages = MLRNImages(context)

    @ReactProp(name = "images")
    override fun setImages(
        view: MLRNImages,
        value: Dynamic,
    ) {
        val readableMap = value.asMap()

        if (readableMap == null) {
            view.setImages(emptyList(), context)
            return
        }

        val imagesList = mutableListOf<Map.Entry<String, ImageEntry>>()
        val iterator = readableMap.keySetIterator()

        while (iterator.hasNextKey()) {
            val imageName = iterator.nextKey()
            val imageEntry: ImageEntry =
                when (readableMap.getType(imageName)) {
                    ReadableType.Map -> {
                        val imageMap = readableMap.getMap(imageName)!!

                        val uri = imageMap.getString("uri")
                        val scale =
                            if (imageMap.hasKey("scale")) imageMap.getDouble("scale") else null
                        val sdf = imageMap.hasKey("sdf") && imageMap.getBoolean("sdf")

                        ImageEntry(uri, scale, sdf)
                    }

                    else -> {
                        continue
                    }
                }

            imagesList.add(java.util.AbstractMap.SimpleEntry(imageName, imageEntry))
        }

        view.setImages(imagesList, context)
    }

    @ReactProp(name = "hasOnImageMissing")
    override fun setHasOnImageMissing(
        images: MLRNImages,
        value: Boolean,
    ) {
        images.setHasOnImageMissing(value)
    }
}
