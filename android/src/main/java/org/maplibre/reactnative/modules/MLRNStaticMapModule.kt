package org.maplibre.reactnative.modules

import android.graphics.Bitmap
import android.util.Log
import android.util.TypedValue
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.maps.Style
import org.maplibre.android.snapshotter.MapSnapshot
import org.maplibre.android.snapshotter.MapSnapshotter
import org.maplibre.reactnative.NativeStaticMapModuleSpec
import org.maplibre.reactnative.utils.BitmapUtils
import org.maplibre.reactnative.utils.ConvertUtils
import org.maplibre.reactnative.utils.GeoJSONUtils
import java.util.UUID

class MLRNStaticMapModule(
    private val reactContext: ReactApplicationContext,
) : NativeStaticMapModuleSpec(reactContext) {
    companion object {
        const val NAME = "MLRNStaticMapModule"
    }

    override fun getName() = NAME

    // Prevent garbage collection
    private val snapshotterMap: MutableMap<String, MapSnapshotter> = HashMap()

    override fun createImage(
        readableMap: ReadableMap,
        promise: Promise,
    ) {
        org.maplibre.android.storage.FileSource
            .getInstance(reactContext)
            .activate()

        reactContext.runOnUiQueueThread {
            val snapshotterID = UUID.randomUUID().toString()
            val snapshotter = MapSnapshotter(reactContext, getOptions(readableMap))
            snapshotterMap[snapshotterID] = snapshotter
            snapshotter.start(
                object : MapSnapshotter.SnapshotReadyCallback {
                    override fun onSnapshotReady(snapshot: MapSnapshot) {
                        val bitmap: Bitmap = snapshot.bitmap
                        val result: String? =
                            if (readableMap.getString("output") == "file") {
                                BitmapUtils.createTempFile(
                                    reactContext,
                                    bitmap,
                                )
                            } else if (readableMap.getString("output") == "base64") {
                                BitmapUtils.createBase64(bitmap)
                            } else {
                                null
                            }

                        if (result == null) {
                            promise.reject(
                                NAME,
                                "Could not generate snapshot, please check Android logs for more info.",
                            )
                            return
                        }

                        promise.resolve(result)
                        snapshotterMap.remove(snapshotterID)
                    }
                },
            ) { error ->
                Log.w(NAME, error)
                snapshotterMap.remove(snapshotterID)
            }
        }
    }

    private fun getOptions(readableMap: ReadableMap): MapSnapshotter.Options {
        val options: MapSnapshotter.Options =
            MapSnapshotter.Options(
                readableMap.getDouble("width").toInt(),
                readableMap.getDouble("height").toInt(),
            )

        val showLogo = if (readableMap.hasKey("logo")) readableMap.getBoolean("logo") else false
        options.withLogo(showLogo)
        readableMap.getString("mapStyle")?.let { mapStyle ->
            options.withStyleBuilder(
                if (ConvertUtils.isJSONValid(mapStyle)) {
                    Style.Builder().fromJson(mapStyle)
                } else {
                    Style.Builder().fromUri(mapStyle)
                },
            )
        }
        options.withPixelRatio(
            TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                1f,
                reactContext.resources.displayMetrics,
            ),
        )

        if (readableMap.hasKey("center")) {
            val center = GeoJSONUtils.toLatLng(readableMap.getArray("center"))
            val cameraPosition: CameraPosition =
                CameraPosition
                    .Builder()
                    .target(center)
                    .tilt(readableMap.getDouble("pitch"))
                    .bearing(readableMap.getDouble("bearing"))
                    .zoom(readableMap.getDouble("zoom"))
                    .build()
            options.withCameraPosition(cameraPosition)
        } else if (readableMap.hasKey("bounds")) {
            options.withRegion(GeoJSONUtils.toLatLngBounds(readableMap.getArray("bounds")))
        }

        return options
    }
}
