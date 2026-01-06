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
    }

    private val context: Context = reactContext.applicationContext
    private var progressEventThrottle = 300.0

    override fun getName(): String = NAME

    override fun createPack(options: ReadableMap, promise: Promise) {
        val name = ConvertUtils.getString("name", options, "")
        val offlineManager = OfflineManager.getInstance(context)
        val latLngBounds = getBoundsFromOptions(options)

        val definition = makeDefinition(latLngBounds, options)
        val metadataBytes = getMetadataBytes(ConvertUtils.getString("metadata", options, "")) ?: ByteArray(0)

        offlineManager.createOfflineRegion(
            definition,
            metadataBytes,
            object : OfflineManager.CreateOfflineRegionCallback {
                override fun onCreate(offlineRegion: OfflineRegion) {
                    promise.resolve(fromOfflineRegion(offlineRegion))
                    setOfflineRegionObserver(name ?: "", offlineRegion)
                }

                override fun onError(error: String) {
                    emitOnError(makeErrorPayload(name ?: "", error))
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

    override fun getPackStatus(id: String, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                val region = getRegionById(id, offlineRegions)

                if (region == null) {
                    promise.resolve(null)
                    Log.w(NAME, "getPackStatus - Unknown offline region")
                    return
                }

                val metadata = try {
                    region.metadata?.let { JSONObject(String(it)) }
                } catch (e: JSONException) {
                    null
                }

                region.getStatus(object : OfflineRegion.OfflineRegionStatusCallback {
                    override fun onStatus(status: OfflineRegionStatus?) {
                        if (status != null) {
                            promise.resolve(makeRegionStatus(name, status, metadata))
                        } else {
                            promise.reject("getPackStatus", "Status is null")
                        }
                    }

                    override fun onError(error: String?) {
                        promise.reject("getPackStatus", error ?: "Unknown error")
                    }
                })
            }

            override fun onError(error: String) {
                promise.reject("getPackStatus", error)
            }
        })
    }

    override fun setPackObserver(id: String, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                val region = getRegionById(id, offlineRegions)
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

    override fun invalidatePack(id: String, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                val region = getRegionById(id, offlineRegions)

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

    override fun deletePack(id: String, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                val region = getRegionById(id, offlineRegions)

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

    override fun pausePackDownload(id: String, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                val offlineRegion = getRegionById(id, offlineRegions)

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

    override fun resumePackDownload(id: String, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                val offlineRegion = getRegionById(id, offlineRegions)

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
            options.getDouble("minZoom"),
            options.getDouble("maxZoom"),
            context.resources.displayMetrics.density
        )
    }

    private fun getMetadataBytes(metadata: String?): ByteArray? {
        if (metadata.isNullOrEmpty()) {
            return null
        }

        return try {
            // Parse metadata JSON, add UUID if not present, and re-serialize
            val metadataJson = try {
                JSONObject(metadata)
            } catch (e: JSONException) {
                JSONObject()
            }

            if (!metadataJson.has("id")) {
                metadataJson.put("id", java.util.UUID.randomUUID().toString())
            }

            metadataJson.toString().toByteArray(Charsets.UTF_8)
        } catch (e: UnsupportedEncodingException) {
            Log.w(NAME, e.localizedMessage ?: "Unknown encoding error")
            null
        }
    }

    private fun setOfflineRegionObserver(name: String, region: OfflineRegion) {
        val metadata = try {
            region.metadata?.let { JSONObject(String(it)) }
        } catch (e: JSONException) {
            null
        }

        region.setObserver(object : OfflineRegion.OfflineRegionObserver {
            var prevStatus: OfflineRegionStatus? = null
            var timestamp = System.currentTimeMillis()

            override fun onStatusChanged(status: OfflineRegionStatus) {
                if (shouldSendUpdate(System.currentTimeMillis(), status)) {
                    emitOnProgress(makeRegionStatus(name, status, metadata))
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

    private fun makeRegionStatus(regionName: String, status: OfflineRegionStatus, metadata: JSONObject? = null): WritableMap {
        val map = Arguments.createMap()

        var state = "inactive"
        var percentage = 0.0

        if (status.isComplete) {
            state = "complete"
            percentage = 100.0
        } else if (status.downloadState == ACTIVE_REGION_DOWNLOAD_STATE) {
            state = "active"
            percentage = if (status.requiredResourceCount >= 0) {
                100.0 * status.completedResourceCount / status.requiredResourceCount
            } else {
                0.0
            }
        } else {
            percentage = if (status.requiredResourceCount >= 0) {
                100.0 * status.completedResourceCount / status.requiredResourceCount
            } else {
                0.0
            }
        }

        map.putString("name", regionName)
        map.putString("id", metadata?.optString("id", "") ?: "")
        map.putString("state", state)
        map.putDouble("percentage", percentage)
        map.putInt("completedResourceCount", status.completedResourceCount.toInt())
        map.putInt("completedResourceSize", status.completedResourceSize.toInt())
        map.putInt("completedTileSize", status.completedTileSize.toInt())
        map.putInt("completedTileCount", status.completedTileCount.toInt())
        map.putInt("requiredResourceCount", status.requiredResourceCount.toInt())

        return map
    }

    private fun getBoundsFromOptions(options: ReadableMap): LatLngBounds {
        val featureCollectionJSONStr = ConvertUtils.getString("bounds", options, "{}") ?: "{}"
        val featureCollection = FeatureCollection.fromJson(featureCollectionJSONStr)
        return GeoJSONUtils.toLatLngBounds(featureCollection)
    }

    private fun fromOfflineRegion(region: OfflineRegion): WritableMap {
        val map = Arguments.createMap()
        region.definition.bounds?.let { bounds ->
            map.putArray("bounds", GeoJSONUtils.fromLatLngBounds(bounds))
        }
        map.putString("metadata", String(region.metadata))
        return map
    }

    private fun getRegionById(id: String?, offlineRegions: Array<OfflineRegion>?): OfflineRegion? {
        if (id.isNullOrEmpty() || offlineRegions == null) {
            return null
        }

        for (region in offlineRegions) {
            try {
                val byteMetadata = region.metadata
                if (byteMetadata != null) {
                    val metadata = JSONObject(String(byteMetadata))
                    if (metadata.has("id") && id == metadata.getString("id")) {
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
