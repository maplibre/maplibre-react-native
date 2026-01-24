package org.maplibre.reactnative.components.images

import android.content.Context
import android.graphics.Bitmap
import android.graphics.drawable.BitmapDrawable
import androidx.core.content.res.ResourcesCompat
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.Style
import org.maplibre.reactnative.R
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.events.ImageMissingEvent
import org.maplibre.reactnative.utils.DownloadMapImageTask
import org.maplibre.reactnative.utils.ImageEntry
import org.maplibre.android.utils.BitmapUtils
import org.maplibre.reactnative.utils.ResourceUtils

class MLRNImages(context: Context, private val manager: MLRNImagesManager) :
    AbstractMapFeature(context) {

    companion object {
        private var imagePlaceholder: Bitmap? = null

        /**
         * Determines if a string value represents a URL/path (remote image) or a native asset name.
         * - URLs start with http://, https://, file://, or /
         * - Native assets are simple names like "pin" or "marker"
         */
        fun isRemoteImage(uri: String): Boolean {
            return uri.startsWith("http://") ||
                    uri.startsWith("https://") ||
                    uri.startsWith("file://") ||
                    uri.startsWith("asset://") ||
                    uri.startsWith("data:") ||
                    uri.startsWith("/")
        }
    }

    private val currentImages = mutableSetOf<String>()
    private val images = mutableMapOf<String, ImageEntry>()
    private var sendMissingImageEvents = false
    private var map: MapLibreMap? = null

    init {
        if (imagePlaceholder == null) {
            imagePlaceholder = BitmapUtils.getBitmapFromDrawable(
                ResourcesCompat.getDrawable(context.resources, R.drawable.empty_drawable, null)
            )
        }
    }

    /**
     * Set unified images.
     * ImageEntry.uri can be:
     * - A native asset name (simple name like "pin")
     * - A URL (starts with http/https/file/asset/data or /)
     */
    fun setImages(imagesList: List<Map.Entry<String, ImageEntry>>, context: Context) {
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

    fun setHasOnImageMissing(value: Boolean) {
        sendMissingImageEvents = value
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
        // Wait for style before adding the source to the map
        // only then we can pre-load required images / placeholders into the style
        mapView.getStyle { style ->
            val mapInstance = mapView.mapLibreMap
            map = mapInstance
            processImages(images, mapInstance, context)
        }
    }

    /**
     * Process unified images - separates native assets from remote images
     * and adds them to the style appropriately.
     */
    private fun processImages(
        imagesToProcess: Map<String, ImageEntry>,
        mapInstance: MapLibreMap,
        context: Context
    ) {
        if (imagesToProcess.isEmpty()) return

        val style = mapInstance.style ?: return
        val remoteImages = mutableListOf<Map.Entry<String, ImageEntry>>()

        for ((imageName, entry) in imagesToProcess) {
            if (hasImage(imageName, mapInstance)) continue

            if (isRemoteImage(entry.uri)) {
                // It's a remote image - add placeholder and queue for download
                style.addImage(imageName, imagePlaceholder!!)
                remoteImages.add(java.util.AbstractMap.SimpleEntry(imageName, entry))
                currentImages.add(imageName)
            } else {
                // It's a native asset name - load from drawable resources
                val drawable = ResourceUtils.getDrawableByName(context, entry.uri) as? BitmapDrawable
                if (drawable != null) {
                    style.addImage(imageName, drawable)
                    currentImages.add(imageName)
                }
            }
        }

        // Download remote images asynchronously
        if (remoteImages.isNotEmpty()) {
            val task = DownloadMapImageTask(context, mapInstance, null)
            @Suppress("UNCHECKED_CAST")
            task.execute(*remoteImages.toTypedArray())
        }
    }

    fun addMissingImageToStyle(id: String, mapInstance: MapLibreMap): Boolean {
        val entry = images[id] ?: return false
        val style = mapInstance.style ?: return false

        if (isRemoteImage(entry.uri)) {
            // Add placeholder and download
            style.addImage(id, imagePlaceholder!!)
            val task = DownloadMapImageTask(context, mapInstance, null)
            @Suppress("UNCHECKED_CAST")
            task.execute(java.util.AbstractMap.SimpleEntry(id, entry))
        } else {
            // Load native asset
            val drawable = ResourceUtils.getDrawableByName(context, entry.uri) as? BitmapDrawable
            if (drawable != null) {
                style.addImage(id, drawable)
            } else {
                return false
            }
        }
        currentImages.add(id)
        return true
    }

    fun sendImageMissingEvent(id: String, mapInstance: MapLibreMap) {
        if (sendMissingImageEvents) {
            manager.handleEvent(ImageMissingEvent.makeImageMissingEvent(this, id))
        }
    }

    private fun hasImage(imageId: String, mapInstance: MapLibreMap): Boolean {
        val style = mapInstance.style
        return style?.getImage(imageId) != null
    }
}
