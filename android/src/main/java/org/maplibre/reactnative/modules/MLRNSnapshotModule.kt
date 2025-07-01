package org.maplibre.reactnative.modules

import android.graphics.Bitmap
import android.util.Log
import android.util.TypedValue
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.maps.Style
import org.maplibre.android.snapshotter.MapSnapshot
import org.maplibre.android.snapshotter.MapSnapshotter
import org.maplibre.geojson.Feature
import org.maplibre.geojson.FeatureCollection
import org.maplibre.geojson.Point
import org.maplibre.reactnative.NativeSnapshotModuleSpec
import org.maplibre.reactnative.utils.BitmapUtils
import org.maplibre.reactnative.utils.GeoJSONUtils
import java.util.UUID

@ReactModule(name = MLRNSnapshotModule.NAME)
class MLRNSnapshotModule(reactContext: ReactApplicationContext) :
    NativeSnapshotModuleSpec(reactContext) {
    companion object {
        const val NAME = "MLRNSnapshotModule"
    }

    override fun getName() = NAME

    private val context: ReactApplicationContext = reactContext

    // Prevent garbage collection
    private val snapshotterMap: MutableMap<String, MapSnapshotter> = HashMap()

    override fun takeSnap(jsOptions: ReadableMap, promise: Promise) {
        org.maplibre.android.storage.FileSource.getInstance(context).activate()

        context.runOnUiQueueThread {
            val snapshotterID = UUID.randomUUID().toString()
            val snapshotter = MapSnapshotter(context, getOptions(jsOptions))
            snapshotterMap[snapshotterID] = snapshotter
            snapshotter.start(object :
                MapSnapshotter.SnapshotReadyCallback {
                override fun onSnapshotReady(snapshot: MapSnapshot) {
                    val bitmap: Bitmap = snapshot.bitmap
                    val result: String? = if (jsOptions.getBoolean("writeToDisk")) {
                        BitmapUtils.createTempFile(
                            context, bitmap
                        )
                    } else {
                        BitmapUtils.createBase64(bitmap)
                    }

                    if (result == null) {
                        promise.reject(
                            NAME,
                            "Could not generate snapshot, please check Android logs for more info."
                        )
                        return
                    }

                    promise.resolve(result)
                    snapshotterMap.remove(snapshotterID)
                }
            }) { error ->
                Log.w(NAME, error)
                snapshotterMap.remove(snapshotterID)
            }
        }
    }

    private fun getOptions(jsOptions: ReadableMap): MapSnapshotter.Options {
        val options: MapSnapshotter.Options =
            MapSnapshotter.Options(
                jsOptions.getDouble("width").toInt(), jsOptions.getDouble("height").toInt()
            )

        options.withLogo(jsOptions.getBoolean("withLogo"))
        jsOptions.getString("styleURL")?.let { styleUrl ->
            options.withStyleBuilder(
                Style.Builder().fromUri(styleUrl)
            )
        }
        options.withPixelRatio(
            TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                1f,
                context.resources.displayMetrics
            )
        )

        if (jsOptions.hasKey("bounds")) {
            val bounds = jsOptions.getString("bounds")?.let { boundsStr ->
                FeatureCollection.fromJson(boundsStr)
            }
            bounds?.let {
                options.withRegion(GeoJSONUtils.toLatLngBounds(it))
            }
        } else {
            val centerPoint = jsOptions.getString("centerCoordinate")?.let { coordStr ->
                Feature.fromJson(coordStr)
            }
            val cameraPosition: CameraPosition =
                CameraPosition.Builder()
                    .target(GeoJSONUtils.toLatLng(centerPoint?.geometry() as Point?))
                    .tilt(jsOptions.getDouble("pitch")).bearing(jsOptions.getDouble("heading"))
                    .zoom(jsOptions.getDouble("zoomLevel")).build()
            options.withCameraPosition(cameraPosition)
        }

        return options
    }
}
