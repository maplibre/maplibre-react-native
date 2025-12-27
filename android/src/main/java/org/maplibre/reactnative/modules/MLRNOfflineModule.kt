package org.maplibre.reactnative.modules

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import org.json.JSONException
import org.json.JSONObject
import org.maplibre.android.geometry.LatLngBounds
import org.maplibre.android.offline.OfflineManager
import org.maplibre.android.offline.OfflineRegion
import org.maplibre.android.offline.OfflineRegionError
import org.maplibre.android.offline.OfflineRegionStatus
import org.maplibre.android.offline.OfflineTilePyramidRegionDefinition
import org.maplibre.android.storage.FileSource
import org.maplibre.geojson.FeatureCollection
import org.maplibre.reactnative.NativeOfflineModuleSpec
import org.maplibre.reactnative.utils.ConvertUtils
import org.maplibre.reactnative.utils.GeoJSONUtils
import java.io.UnsupportedEncodingException

class MLRNOfflineModule(reactContext: ReactApplicationContext) :
    NativeOfflineModuleSpec(reactContext) {

    companion object {
        const val NAME = "MLRNOfflineModule"
        const val INACTIVE_REGION_DOWNLOAD_STATE = OfflineRegion.STATE_INACTIVE
        const val ACTIVE_REGION_DOWNLOAD_STATE = OfflineRegion.STATE_ACTIVE
        const val COMPLETE_REGION_DOWNLOAD_STATE = 2
        const val DEFAULT_MIN_ZOOM_LEVEL = 10.0
        const val DEFAULT_MAX_ZOOM_LEVEL = 20.0
    }

    private val context: Context = reactContext.applicationContext
    private var progressEventThrottle = 300.0

    override fun getName(): String = NAME

    override fun createPack(options: ReadableMap, promise: Promise) {
        val name = ConvertUtils.getString("name", options, "")
        val offlineManager = OfflineManager.getInstance(context)
        val latLngBounds = getBoundsFromOptions(options)

        val definition = makeDefinition(latLngBounds, options)
        val metadataBytes = getMetadataBytes(ConvertUtils.getString("metadata", options, ""))

        offlineManager.createOfflineRegion(
            definition,
            metadataBytes,
            object : OfflineManager.CreateOfflineRegionCallback {
                override fun onCreate(offlineRegion: OfflineRegion) {
                    promise.resolve(fromOfflineRegion(offlineRegion))
                    setOfflineRegionObserver(name, offlineRegion)
                }

                override fun onError(error: String) {
                    emitOnError(makeErrorPayload(name, error))
                }
            }
        )
    }

    override fun getPacks(promise: Promise) {
        activateFileSource()

        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                val payload = Arguments.createArray()
                offlineRegions?.forEach { region ->
                    payload.pushMap(fromOfflineRegion(region))
                }
                promise.resolve(payload)
            }

            override fun onError(error: String) {
                promise.reject("getRegions", error)
            }
        })
    }

    override fun invalidateAmbientCache(promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)
        offlineManager.invalidateAmbientCache(object : OfflineManager.FileSourceCallback {
            override fun onSuccess() {
                promise.resolve(null)
            }

            override fun onError(error: String) {
                promise.reject("invalidateAmbientCache", error)
            }
        })
    }

    override fun clearAmbientCache(promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)
        offlineManager.clearAmbientCache(object : OfflineManager.FileSourceCallback {
            override fun onSuccess() {
                promise.resolve(null)
            }

            override fun onError(error: String) {
                promise.reject("clearAmbientCache", error)
            }
        })
    }

    override fun setMaximumAmbientCacheSize(size: Double, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)
        offlineManager.setMaximumAmbientCacheSize(
            size.toLong(),
            object : OfflineManager.FileSourceCallback {
                override fun onSuccess() {
                    promise.resolve(null)
                }

                override fun onError(error: String) {
                    promise.reject("setMaximumAmbientCacheSize", error)
                }
            }
        )
    }

    override fun resetDatabase(promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)
        offlineManager.resetDatabase(object : OfflineManager.FileSourceCallback {
            override fun onSuccess() {
                promise.resolve(null)
            }

            override fun onError(error: String) {
                promise.reject("resetDatabase", error)
            }
        })
    }

    override fun getPackStatus(name: String, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                val region = getRegionByName(name, offlineRegions)

                if (region == null) {
                    promise.resolve(null)
                    Log.w(NAME, "getPackStatus - Unknown offline region")
                    return
                }

                region.getStatus(object : OfflineRegion.OfflineRegionStatusCallback {
                    override fun onStatus(status: OfflineRegionStatus) {
                        promise.resolve(makeRegionStatus(name, status))
                    }

                    override fun onError(error: String) {
                        promise.reject("getPackStatus", error)
                    }
                })
            }

            override fun onError(error: String) {
                promise.reject("getPackStatus", error)
            }
        })
    }

    override fun setPackObserver(name: String, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                val region = getRegionByName(name, offlineRegions)
                val hasRegion = region != null

                if (hasRegion && region != null) {
                    setOfflineRegionObserver(name, region)
                }

                promise.resolve(hasRegion)
            }

            override fun onError(error: String) {
                promise.reject("setPackObserver", error)
            }
        })
    }

    override fun invalidatePack(name: String, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                val region = getRegionByName(name, offlineRegions)

                if (region == null) {
                    promise.resolve(null)
                    Log.w(NAME, "invalidateRegion - Unknown offline region")
                    return
                }

                region.invalidate(object : OfflineRegion.OfflineRegionInvalidateCallback {
                    override fun onInvalidate() {
                        promise.resolve(null)
                    }

                    override fun onError(error: String) {
                        promise.reject("invalidateRegion", error)
                    }
                })
            }

            override fun onError(error: String) {
                promise.reject("invalidateRegion", error)
            }
        })
    }

    override fun deletePack(name: String, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                val region = getRegionByName(name, offlineRegions)

                if (region == null) {
                    promise.resolve(null)
                    Log.w(NAME, "deleteRegion - Unknown offline region")
                    return
                }

                // stop download before deleting
                region.setDownloadState(INACTIVE_REGION_DOWNLOAD_STATE)

                region.delete(object : OfflineRegion.OfflineRegionDeleteCallback {
                    override fun onDelete() {
                        promise.resolve(null)
                    }

                    override fun onError(error: String) {
                        promise.reject("deleteRegion", error)
                    }
                })
            }

            override fun onError(error: String) {
                promise.reject("deleteRegion", error)
            }
        })
    }

    override fun pausePackDownload(name: String, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                val offlineRegion = getRegionByName(name, offlineRegions)

                if (offlineRegion == null) {
                    promise.reject("pauseRegionDownload", "Unknown offline region")
                    return
                }

                Handler(Looper.getMainLooper()).post {
                    offlineRegion.setDownloadState(INACTIVE_REGION_DOWNLOAD_STATE)
                    promise.resolve(null)
                }
            }

            override fun onError(error: String) {
                promise.reject("pauseRegionDownload", error)
            }
        })
    }

    override fun resumePackDownload(name: String, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                val offlineRegion = getRegionByName(name, offlineRegions)

                if (offlineRegion == null) {
                    promise.reject("resumeRegionDownload", "Unknown offline region")
                    return
                }

                offlineRegion.setDownloadState(ACTIVE_REGION_DOWNLOAD_STATE)
                promise.resolve(null)
            }

            override fun onError(error: String) {
                promise.reject("resumeRegionDownload", error)
            }
        })
    }

    override fun mergeOfflineRegions(path: String, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.mergeOfflineRegions(
            path,
            object : OfflineManager.MergeOfflineRegionsCallback {
                override fun onMerge(offlineRegions: Array<OfflineRegion>?) {
                    promise.resolve(null)
                }

                override fun onError(error: String) {
                    promise.reject("mergeOfflineRegions", error)
                }
            }
        )
    }

    override fun setTileCountLimit(limit: Double) {
        val offlineManager = OfflineManager.getInstance(context)
        offlineManager.setOfflineMapboxTileCountLimit(limit.toLong())
    }

    override fun setProgressEventThrottle(throttleValue: Double) {
        progressEventThrottle = throttleValue
    }

    private fun makeDefinition(
        latLngBounds: LatLngBounds,
        options: ReadableMap
    ): OfflineTilePyramidRegionDefinition {
        return OfflineTilePyramidRegionDefinition(
            ConvertUtils.getString("styleURL", options, MLRNModule.DEFAULT_STYLE_URL),
            latLngBounds,
            ConvertUtils.getDouble("minZoom", options, DEFAULT_MIN_ZOOM_LEVEL),
            ConvertUtils.getDouble("maxZoom", options, DEFAULT_MAX_ZOOM_LEVEL),
            context.resources.displayMetrics.density
        )
    }

    private fun getMetadataBytes(metadata: String?): ByteArray? {
        if (metadata.isNullOrEmpty()) {
            return null
        }

        return try {
            metadata.toByteArray(Charsets.UTF_8)
        } catch (e: UnsupportedEncodingException) {
            Log.w(NAME, e.localizedMessage ?: "Unknown encoding error")
            null
        }
    }

    private fun setOfflineRegionObserver(name: String, region: OfflineRegion) {
        region.setObserver(object : OfflineRegion.OfflineRegionObserver {
            var prevStatus: OfflineRegionStatus? = null
            var timestamp = System.currentTimeMillis()

            override fun onStatusChanged(status: OfflineRegionStatus) {
                if (shouldSendUpdate(System.currentTimeMillis(), status)) {
                    emitOnProgress(makeRegionStatus(name, status))
                    timestamp = System.currentTimeMillis()
                }
                prevStatus = status
            }

            override fun onError(error: OfflineRegionError) {
                emitOnError(makeErrorPayload(name, error.message))
            }

            override fun mapboxTileCountLimitExceeded(limit: Long) {
                val message = "Mapbox tile limit exceeded $limit"
                emitOnError(makeErrorPayload(name, message))
            }

            private fun shouldSendUpdate(
                currentTimestamp: Long,
                curStatus: OfflineRegionStatus
            ): Boolean {
                val prev = prevStatus ?: return false

                if (prev.downloadState != curStatus.downloadState) {
                    return true
                }

                if (currentTimestamp - timestamp > progressEventThrottle) {
                    return true
                }

                return false
            }
        })

        region.setDownloadState(ACTIVE_REGION_DOWNLOAD_STATE)
    }

    private fun makeErrorPayload(regionName: String, message: String): WritableMap {
        val payload = WritableNativeMap()
        payload.putString("message", message)
        payload.putString("name", regionName)
        return payload
    }

    private fun makeRegionStatus(regionName: String, status: OfflineRegionStatus): WritableMap {
        val map = Arguments.createMap()

        var downloadState = status.downloadState
        var percentage = 0.0

        if (status.isComplete) {
            downloadState = COMPLETE_REGION_DOWNLOAD_STATE
            percentage = 100.0
        } else {
            percentage = if (status.requiredResourceCount >= 0) {
                100.0 * status.completedResourceCount / status.requiredResourceCount
            } else {
                0.0
            }
        }

        map.putString("name", regionName)
        map.putInt("state", downloadState)
        map.putDouble("percentage", percentage)
        map.putInt("completedResourceCount", status.completedResourceCount.toInt())
        map.putInt("completedResourceSize", status.completedResourceSize.toInt())
        map.putInt("completedTileSize", status.completedTileSize.toInt())
        map.putInt("completedTileCount", status.completedTileCount.toInt())
        map.putInt("requiredResourceCount", status.requiredResourceCount.toInt())

        return map
    }

    private fun getBoundsFromOptions(options: ReadableMap): LatLngBounds {
        val featureCollectionJSONStr = ConvertUtils.getString("bounds", options, "{}")
        val featureCollection = FeatureCollection.fromJson(featureCollectionJSONStr)
        return GeoJSONUtils.toLatLngBounds(featureCollection)
    }

    private fun fromOfflineRegion(region: OfflineRegion): WritableMap {
        val map = Arguments.createMap()
        map.putArray("bounds", GeoJSONUtils.fromLatLngBounds(region.definition.bounds))
        map.putString("metadata", String(region.metadata))
        return map
    }

    private fun getRegionByName(name: String?, offlineRegions: Array<OfflineRegion>?): OfflineRegion? {
        if (name.isNullOrEmpty() || offlineRegions == null) {
            return null
        }

        for (region in offlineRegions) {
            try {
                val byteMetadata = region.metadata
                if (byteMetadata != null) {
                    val metadata = JSONObject(String(byteMetadata))
                    if (name == metadata.getString("name")) {
                        return region
                    }
                }
            } catch (e: JSONException) {
                Log.w(NAME, e.localizedMessage ?: "JSON parsing error")
            }
        }

        return null
    }

    private fun activateFileSource() {
        val fileSource = FileSource.getInstance(context)
        fileSource.activate()
    }
}
