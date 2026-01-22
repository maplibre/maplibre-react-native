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
import org.maplibre.reactnative.NativeOfflineModuleSpec
import org.maplibre.reactnative.utils.GeoJSONUtils
import java.util.UUID

class MLRNOfflineModule(reactContext: ReactApplicationContext) :
    NativeOfflineModuleSpec(reactContext) {

    companion object {
        const val NAME = "MLRNOfflineModule"

        const val MIGRATION_KEY = "migrationVersion"
        const val MIGRATION_VERSION = 1
    }

    private val context: Context = reactContext.applicationContext
    private var progressEventThrottle = 300.0

    override fun initialize() {
        Handler(Looper.getMainLooper()).post {
            runMigrations()
        }
    }

    override fun getName(): String = NAME

    override fun createPack(options: ReadableMap, promise: Promise) {
        val offlineManager = OfflineManager.getInstance(context)

        val packId = UUID.randomUUID().toString()
        val latLngBounds = getBoundsFromOptions(options)
        val definition = makeDefinition(latLngBounds, options)

        val metadataJson = JSONObject()
        metadataJson.put(MIGRATION_KEY, MIGRATION_VERSION)
        metadataJson.put("id", packId)

        val metadataString = options.getString("metadata")
        if (metadataString != null && metadataString.isNotEmpty()) {
            metadataJson.put("metadata", metadataString)
        } else {
            metadataJson.put("metadata", "{}")
        }

        val metadataBytes = metadataJson.toString().toByteArray(Charsets.UTF_8)

        offlineManager.createOfflineRegion(
            definition, metadataBytes, object : OfflineManager.CreateOfflineRegionCallback {
                override fun onCreate(offlineRegion: OfflineRegion) {
                    val pack = fromOfflineRegion(offlineRegion)
                    promise.resolve(pack)
                    setOfflineRegionObserver(packId, offlineRegion)
                }

                override fun onError(error: String) {
                    emitOnError(makeErrorPayload(packId, error))
                    Log.e(NAME, "createPack error: $error")
                }
            })
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

            override fun onError(message: String) {
                promise.reject("invalidateAmbientCache", message)
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

            override fun onError(message: String) {
                promise.reject("clearAmbientCache", message)
            }
        })
    }

    override fun setMaximumAmbientCacheSize(size: Double, promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)
        offlineManager.setMaximumAmbientCacheSize(
            size.toLong(), object : OfflineManager.FileSourceCallback {
                override fun onSuccess() {
                    promise.resolve(null)
                }

                override fun onError(message: String) {
                    promise.reject("setMaximumAmbientCacheSize", message)
                }
            })
    }

    override fun resetDatabase(promise: Promise) {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)
        offlineManager.resetDatabase(object : OfflineManager.FileSourceCallback {
            override fun onSuccess() {
                promise.resolve(null)
            }

            override fun onError(message: String) {
                promise.reject("resetDatabase", message)
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

                region.getStatus(object : OfflineRegion.OfflineRegionStatusCallback {
                    override fun onStatus(status: OfflineRegionStatus?) {
                        if (status != null) {
                            promise.resolve(makeRegionStatus(id, status))
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

                if (hasRegion) {
                    setOfflineRegionObserver(id, region)
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

                region.setDownloadState(OfflineRegion.STATE_INACTIVE)
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
                    offlineRegion.setDownloadState(OfflineRegion.STATE_INACTIVE)
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

                offlineRegion.setDownloadState(OfflineRegion.STATE_ACTIVE)
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
            path, object : OfflineManager.MergeOfflineRegionsCallback {
                override fun onMerge(offlineRegions: Array<OfflineRegion>?) {
                    promise.resolve(null)
                }

                override fun onError(error: String) {
                    promise.reject("mergeOfflineRegions", error)
                }
            })
    }

    override fun setTileCountLimit(limit: Double) {
        val offlineManager = OfflineManager.getInstance(context)
        offlineManager.setOfflineMapboxTileCountLimit(limit.toLong())
    }

    override fun setProgressEventThrottle(throttleValue: Double) {
        progressEventThrottle = throttleValue
    }

    private fun makeDefinition(
        latLngBounds: LatLngBounds, options: ReadableMap
    ): OfflineTilePyramidRegionDefinition {
        return OfflineTilePyramidRegionDefinition(
            options.getString("mapStyle"),
            latLngBounds,
            options.getDouble("minZoom"),
            options.getDouble("maxZoom"),
            context.resources.displayMetrics.density
        )
    }

    private fun parseRegionMetadata(region: OfflineRegion): JSONObject {
        return try {
            JSONObject(String(region.metadata))
        } catch (e: JSONException) {
            Log.w(NAME, "Failed to parse pack metadata: ${e.localizedMessage}")
            JSONObject()
        }
    }

    private fun runMigrations() {
        activateFileSource()
        val offlineManager = OfflineManager.getInstance(context)

        offlineManager.listOfflineRegions(object : OfflineManager.ListOfflineRegionsCallback {
            override fun onList(offlineRegions: Array<OfflineRegion>?) {
                if (offlineRegions == null) {
                    Log.e(NAME, "No packs found for migration")

                    return
                }

                val regionsToMigrate = mutableListOf<OfflineRegion>()
                for (region in offlineRegions) {
                    val metadata = parseRegionMetadata(region)
                    if (!metadata.has(MIGRATION_KEY) || metadata.getInt(MIGRATION_KEY) != MIGRATION_VERSION) {
                        regionsToMigrate.add(region)
                    }
                }

                if (regionsToMigrate.isEmpty()) {
                    Log.d(NAME, "No packs need migration")

                    return
                }

                Log.d(NAME, "Migrating ${regionsToMigrate.size} pack(s)")

                for (region in regionsToMigrate) {
                    migrateRegion(region)
                }
            }

            override fun onError(error: String) {
                Log.e(NAME, "Failed to list packs for migration: $error")
            }
        })
    }

    private fun migrateRegion(region: OfflineRegion) {
        val oldMetadata = parseRegionMetadata(region)

        val newMetadata = JSONObject()
        newMetadata.put(MIGRATION_KEY, MIGRATION_VERSION)
        newMetadata.put("id", UUID.randomUUID().toString())
        newMetadata.put("metadata", oldMetadata.toString())

        region.updateMetadata(
            newMetadata.toString().toByteArray(Charsets.UTF_8),
            object : OfflineRegion.OfflineRegionUpdateMetadataCallback {
                override fun onUpdate(metadata: ByteArray) {
                    val id = newMetadata.optString("id", "unknown")
                    Log.d(NAME, "Successfully migrated pack: $id")
                }

                override fun onError(error: String) {
                    Log.e(NAME, "Failed to migrate pack: $error")
                }
            })
    }

    private fun setOfflineRegionObserver(id: String, region: OfflineRegion) {
        region.setObserver(object : OfflineRegion.OfflineRegionObserver {
            var prevStatus: OfflineRegionStatus? = null
            var timestamp = System.currentTimeMillis()

            override fun onStatusChanged(status: OfflineRegionStatus) {
                if (shouldSendUpdate(System.currentTimeMillis(), status)) {
                    emitOnProgress(makeRegionStatus(id, status))
                    timestamp = System.currentTimeMillis()
                }
                prevStatus = status
            }

            override fun onError(error: OfflineRegionError) {
                emitOnError(makeErrorPayload(id, error.message))
            }

            override fun mapboxTileCountLimitExceeded(limit: Long) {
                val message = "Mapbox tile limit exceeded $limit"
                emitOnError(makeErrorPayload(id, message))
            }

            private fun shouldSendUpdate(
                currentTimestamp: Long, curStatus: OfflineRegionStatus
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

        region.setDownloadState(OfflineRegion.STATE_ACTIVE)
    }

    private fun makeErrorPayload(id: String, message: String): WritableMap {
        val payload = WritableNativeMap()
        payload.putString("id", id)
        payload.putString("message", message)

        return payload
    }

    private fun makeRegionStatus(
        id: String, status: OfflineRegionStatus
    ): WritableMap {
        val map = Arguments.createMap()

        var state = "inactive"
        var percentage: Double

        if (status.isComplete) {
            state = "complete"
            percentage = 100.0
        } else {
            percentage = if (status.requiredResourceCount >= 0) {
                100.0 * status.completedResourceCount / status.requiredResourceCount
            } else {
                0.0
            }

            if (status.downloadState == OfflineRegion.STATE_ACTIVE) {
                state = "active"
            }
        }

        map.putString("id", id)
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
        val boundsArray = options.getArray("bounds")
        val bounds = GeoJSONUtils.toLatLngBounds(boundsArray)
            ?: throw IllegalArgumentException("bounds must be an array of 4 numbers [west, south, east, north]")

        return bounds
    }

    private fun fromOfflineRegion(region: OfflineRegion): WritableMap {
        val map = Arguments.createMap()

        val metadata = parseRegionMetadata(region)

        map.putString("id", metadata.optString("id", ""))
        map.putString("metadata", metadata.optString("metadata", "{}"))

        region.definition.bounds?.let { bounds ->
            map.putArray("bounds", GeoJSONUtils.fromLatLngBounds(bounds))
        }

        return map
    }

    private fun getRegionById(id: String?, offlineRegions: Array<OfflineRegion>?): OfflineRegion? {
        if (id.isNullOrEmpty() || offlineRegions == null) {
            return null
        }

        for (region in offlineRegions) {
            val metadata = parseRegionMetadata(region)
            if (metadata.has("id") && id == metadata.optString("id")) {
                return region
            }
        }

        return null
    }

    private fun activateFileSource() {
        val fileSource = FileSource.getInstance(context)
        fileSource.activate()
    }
}
