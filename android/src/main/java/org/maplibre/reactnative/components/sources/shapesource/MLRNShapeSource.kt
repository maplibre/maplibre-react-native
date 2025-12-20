package org.maplibre.reactnative.components.sources.shapesource

import android.content.Context
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.google.gson.JsonObject
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.sources.GeoJsonOptions
import org.maplibre.android.style.sources.GeoJsonSource
import org.maplibre.geojson.Feature
import org.maplibre.geojson.FeatureCollection
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.components.sources.MLRNSource
import org.maplibre.reactnative.events.AndroidCallbackEvent
import org.maplibre.reactnative.components.sources.shapesource.ClusterPropertyEntry
import org.maplibre.reactnative.utils.GeoJSONUtils
import java.net.URI

class MLRNShapeSource(context: Context) : MLRNSource<GeoJsonSource?>(context) {
    private var uri: URI? = null
    private var geoJson: String? = null

    private var maxzoom: Int? = null
    private var buffer: Int? = null
    private var tolerance: Double? = null
    private var lineMetrics: Boolean? = null

    private var cluster: Boolean? = null
    private var clusterRadius: Int? = null
    private var clusterMinPoints: Int? = null
    private var clusterMaxZoom: Int? = null
    private var clusterProperties: MutableList<MutableMap.MutableEntry<String?, ClusterPropertyEntry?>>? =
        null


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

        if (mSource != null && mMapView != null && !mMapView.isDestroyed) {
            mSource!!.setUri(uri!!)
        }
    }

    fun setGeoJson(geoJson: String?) {
        this.geoJson = geoJson

        if (mSource != null && mMapView != null && !mMapView.isDestroyed) {
            mSource!!.setGeoJson(geoJson!!)
        }
    }

    fun setMaxZoom(value: Int?) {
        this.maxzoom = value
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

    fun setClusterProperties(clusterProperties: MutableList<MutableMap.MutableEntry<String?, ClusterPropertyEntry?>>?) {
        this.clusterProperties = clusterProperties
    }


    override fun onPress(event: OnPressEvent) {
//        TODO
//        mManager.handleEvent(FeatureClickEvent.makeShapeSourceEvent(this, event))
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
                    val property: ClusterPropertyEntry = entry.value!!

                    options.withClusterProperty(entry.key!!, property.operator, property.mapping)
                }
            }

            if (maxzoom != null) {
                options.withMaxZoom(maxzoom!!)
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

        val properties = JsonObject()
        properties.addProperty("cluster_id", clusterId)
        val feature = Feature.fromGeometry(
            null, properties
        )

        val zoom = mSource!!.getClusterExpansionZoom(feature)

        return zoom;
    }

    fun getClusterLeaves(callbackID: String?, featureJSON: String, number: Int, offset: Int) {
        if (mSource == null) {
            throw IllegalStateException("Source is not yet loaded")
        }

        val clusterFeature = Feature.fromJson(featureJSON)
        val features = mSource!!.getClusterLeaves(clusterFeature, number.toLong(), offset.toLong())

        GeoJSONUtils.fromFeatureCollection(features)
    }

    fun getClusterChildren(callbackID: String?, featureJSON: String) {
        if (mSource == null) {
            val payload: WritableMap = WritableNativeMap()
            payload.putString("error", "source is not yet loaded")
            val event = AndroidCallbackEvent(this, callbackID, payload)
//            TODO
//            mManager.handleEvent(event)
            return
        }
        val clusterFeature = Feature.fromJson(featureJSON)
        val leaves = mSource!!.getClusterChildren(clusterFeature)
        val payload: WritableMap = WritableNativeMap()
        payload.putString("data", leaves.toJson())

        val event = AndroidCallbackEvent(this, callbackID, payload)
//        TODO
//        mManager.handleEvent(event)
    }
}
