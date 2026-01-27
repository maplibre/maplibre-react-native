package org.maplibre.reactnative.components.images

import android.content.Context
import android.graphics.Bitmap
import androidx.core.content.res.ResourcesCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcher
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.utils.BitmapUtils
import org.maplibre.reactnative.R
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.utils.DownloadMapImageTask
import org.maplibre.reactnative.utils.ImageEntry

class MLRNImages(
    context: Context,
) : AbstractMapFeature(context) {
    companion object {
        private var imagePlaceholder: Bitmap? = null
    }

    private val currentImages = mutableSetOf<String>()
    private val images = mutableMapOf<String, ImageEntry>()
    private var map: MapLibreMap? = null

    init {
        if (imagePlaceholder == null) {
            imagePlaceholder =
                BitmapUtils.getBitmapFromDrawable(
                    ResourcesCompat.getDrawable(context.resources, R.drawable.empty_drawable, null),
                )
        }
    }

    /**
     * Set unified images.
     * ImageEntry.uri can be:
     * - A native asset name (simple name like "pin")
     * - A URL (starts with http/https/file/asset/data or /)
     */
    fun setImages(
        imagesList: List<Map.Entry<String, ImageEntry>>,
        context: Context,
    ) {
        val newImages = mutableMapOf<String, ImageEntry>()

        for (entry in imagesList) {
            val key = entry.key
            val value = entry.value
            val oldValue = images.put(key, value)
            if (oldValue == null) {
                newImages[key] = value
            }
        }

        map?.let { mapInstance ->
            if (mapInstance.style != null) {
                processImages(newImages, mapInstance, context)
            }
        }
    }

    override fun removeFromMap(mapView: MLRNMapView) {
        removeImages(mapView)
        map = null
        images.clear()
        currentImages.clear()
    }

    private fun removeImages(mapView: MLRNMapView) {
        mapView.getStyle { style ->
            for (imageName in images.keys) {
                style.removeImage(imageName)
            }
        }
    }

    override fun addToMap(mapView: MLRNMapView) {
        // Wait for style before adding the source to the map.
        // Only then we can pre-load required images/placeholders into the style.
        mapView.getStyle { _ ->
            val mapInstance = mapView.mapLibreMap
            map = mapInstance
            map?.let {
                processImages(images, it, context)
            }
        }
    }

    private fun processImages(
        imagesToProcess: Map<String, ImageEntry>,
        mapInstance: MapLibreMap,
        context: Context,
    ) {
        if (imagesToProcess.isEmpty()) return

        val style = mapInstance.style ?: return
        val remoteImages = mutableListOf<Map.Entry<String, ImageEntry>>()

        for ((imageName, entry) in imagesToProcess) {
            if (hasImage(imageName, mapInstance)) continue

            style.addImage(imageName, imagePlaceholder!!)
            remoteImages.add(java.util.AbstractMap.SimpleEntry(imageName, entry))
            currentImages.add(imageName)
        }

        // Download remote images asynchronously
        if (remoteImages.isNotEmpty()) {
            val task = DownloadMapImageTask(context, mapInstance, null)
            task.execute(*remoteImages.toTypedArray())
        }
    }

    fun addMissingImageToStyle(
        id: String,
        mapInstance: MapLibreMap,
    ): Boolean {
        val entry = images[id] ?: return false
        val style = mapInstance.style ?: return false

        style.addImage(id, imagePlaceholder!!)
        val task = DownloadMapImageTask(context, mapInstance, null)
        task.execute(java.util.AbstractMap.SimpleEntry(id, entry))

        currentImages.add(id)
        return true
    }

    val eventDispatcher: EventDispatcher?
        get() {
            val reactContext = context as ReactContext

            return UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
        }

    val surfaceId: Int
        get() {
            val reactContext = context as ReactContext

            return UIManagerHelper.getSurfaceId(reactContext)
        }

    inner class OnImageMissingEvent(
        private val eventData: WritableMap,
    ) : Event<OnImageMissingEvent>(this@MLRNImages.surfaceId, this@MLRNImages.id) {
        override fun getEventName() = "onImageMissing"

        override fun getEventData() = eventData
    }

    fun sendImageMissingEvent(image: String) {
        val writableMap = Arguments.createMap()
        writableMap.putString("image", image)

        eventDispatcher?.dispatchEvent(OnImageMissingEvent(writableMap))
    }

    private fun hasImage(
        imageId: String,
        mapInstance: MapLibreMap,
    ): Boolean {
        val style = mapInstance.style

        return style?.getImage(imageId) != null
    }
}
