package org.maplibre.reactnative.components.sources.shapesource

import android.content.Context
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.EventDispatcher
import com.google.gson.JsonObject
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.sources.GeoJsonOptions
import org.maplibre.android.style.sources.GeoJsonSource
import org.maplibre.geojson.Feature
import org.maplibre.geojson.FeatureCollection
import org.maplibre.geojson.Point
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.components.sources.MLRNSource
import org.maplibre.reactnative.events.MapPressEventWithFeatures
import org.maplibre.reactnative.utils.GeoJSONUtils
import java.net.URI

class MLRNShapeSource(context: Context) : MLRNSource<GeoJsonSource?>(context) {
    private var uri: URI? = null
    private var geoJson: String? = null

    private var maxZoom: Int? = null
    private var buffer: Int? = null
    private var tolerance: Double? = null
    private var lineMetrics: Boolean? = null

    private var cluster: Boolean? = null
    private var clusterRadius: Int? = null
    private var clusterMinPoints: Int? = null
    private var clusterMaxZoom: Int? = null
    private var clusterProperties: MutableList<MutableMap.MutableEntry<String, ClusterPropertyEntry>>? =
        null


    val eventDispatcher: EventDispatcher?
        get() {
            val reactContext = context as ReactContext

            return UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId())
        }

    val surfaceId: Int
        get() {
            val reactContext = context as ReactContext

            return UIManagerHelper.getSurfaceId(reactContext)
        }

    override fun addToMap(mapView: MLRNMapView) {
        // Wait for style before adding the source to the map
        mapView.mapLibreMap!!.getStyle {
            super@MLRNShapeSource.addToMap(mapView)
        }
    }

    override fun makeSource(): GeoJsonSource {
        val options = this.options

        if (geoJson != null) {
            return GeoJsonSource(mID, geoJson, options)
        }

        return GeoJsonSource(mID, uri!!, options)
    }

    fun setURI(url: URI) {
        uri = url

        if (mSource != null && mMapView != null && !mMapView!!.isDestroyed) {
            mSource!!.setUri(uri!!)
        }
    }

    fun setGeoJson(geoJson: String?) {
        this.geoJson = geoJson

        if (mSource != null && mMapView != null && !mMapView!!.isDestroyed) {
            mSource!!.setGeoJson(geoJson!!)
        }
    }

    fun setMaxZoom(value: Int?) {
        this.maxZoom = value
    }

    fun setBuffer(value: Int?) {
        this.buffer = value
    }

    fun setTolerance(value: Double?) {
        this.tolerance = value
    }

    fun setLineMetrics(lineMetrics: Boolean) {
        this.lineMetrics = lineMetrics
    }

    fun setCluster(cluster: Boolean) {
        this.cluster = cluster
    }

    fun setClusterRadius(clusterRadius: Int?) {
        this.clusterRadius = clusterRadius
    }

    fun setClusterMinPoints(clusterMinPoints: Int?) {
        this.clusterMinPoints = clusterMinPoints
    }

    fun setClusterMaxZoom(clusterMaxZoom: Int?) {
        this.clusterMaxZoom = clusterMaxZoom
    }

    fun setClusterProperties(clusterProperties: MutableList<MutableMap.MutableEntry<String, ClusterPropertyEntry>>?) {
        this.clusterProperties = clusterProperties
    }


    override fun onPress(event: OnPressEvent) {
        val event = MapPressEventWithFeatures(
            surfaceId, id, "onPress", event.latLng, event.screenPoint, event.features
        )
        eventDispatcher?.dispatchEvent(event)
    }

    private val options: GeoJsonOptions
        get() {
            val options = GeoJsonOptions()

            if (cluster != null) {
                options.withCluster(cluster!!)
            }

            if (clusterRadius != null) {
                options.withClusterRadius(clusterRadius!!)
            }

            if (clusterMinPoints != null) {
                options.withClusterMinPoints(clusterMinPoints!!)
            }

            if (clusterMaxZoom != null) {
                options.withClusterMaxZoom(clusterMaxZoom!!)
            }

            if (clusterProperties != null) {
                for (entry in clusterProperties) {
                    val property: ClusterPropertyEntry = entry.value

                    options.withClusterProperty(entry.key, property.operator, property.mapping)
                }
            }

            if (maxZoom != null) {
                options.withMaxZoom(maxZoom!!)
            }

            if (buffer != null) {
                options.withBuffer(buffer!!)
            }

            if (tolerance != null) {
                options.withTolerance(tolerance!!.toFloat())
            }

            if (lineMetrics != null) {
                options.withLineMetrics(lineMetrics!!)
            }

            return options
        }

    fun getData(
        filter: Expression?
    ): WritableMap {
        if (mSource == null) {
            throw IllegalStateException("Source is not yet loaded")
        }

        val features: List<Feature> = mSource!!.querySourceFeatures(filter)


        return GeoJSONUtils.fromFeatureCollection(
            FeatureCollection.fromFeatures(features)
        )
    }

    fun getClusterExpansionZoom(clusterId: Int): Int {
        if (mSource == null) {
            throw IllegalStateException("Source is not yet loaded")
        }

        val zoom = mSource!!.getClusterExpansionZoom(createClusterFeature(clusterId))

        return zoom
    }

    fun getClusterLeaves(clusterId: Int, limit: Int, offset: Int): WritableArray {
        if (mSource == null) {
            throw IllegalStateException("Source is not yet loaded")
        }

        val features = mSource!!.getClusterLeaves(
            createClusterFeature(clusterId), limit.toLong(), offset.toLong()
        )

        return GeoJSONUtils.fromFeatureList(features.features()?.toList()!!)
    }

    fun getClusterChildren(clusterId: Int): WritableArray {
        if (mSource == null) {
            throw IllegalStateException("Source is not yet loaded")
        }

        val leaves = mSource!!.getClusterChildren(createClusterFeature(clusterId))

        return GeoJSONUtils.fromFeatureList(leaves.features()!!)
    }

    private fun createClusterFeature(clusterId: Int): Feature {
        val properties = JsonObject()
        properties.addProperty("cluster_id", clusterId)

        return Feature.fromGeometry(
            Point.fromLngLat(0.0, 0.0), properties
        )
    }
}
