package org.maplibre.reactnative.components.sources

import android.content.Context
import android.graphics.Bitmap
import android.graphics.drawable.BitmapDrawable
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import org.maplibre.android.maps.Style
import org.maplibre.android.maps.Style.OnStyleLoaded
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.sources.GeoJsonOptions
import org.maplibre.android.style.sources.GeoJsonSource
import org.maplibre.geojson.Feature
import org.maplibre.geojson.FeatureCollection
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.events.AndroidCallbackEvent
import org.maplibre.reactnative.events.FeatureClickEvent
import org.maplibre.reactnative.utils.ClusterPropertyEntry
import org.maplibre.reactnative.utils.ImageEntry
import java.net.URL

class MLRNShapeSource(context: Context?, private val mManager: MLRNShapeSourceManager) :
    MLRNSource<GeoJsonSource?>(context) {
    private var mURL: URL? = null

    private var mShape: String? = null

    private var mCluster: Boolean? = null
    private var mClusterRadius: Int? = null
    private var mClusterMinPoints: Int? = null
    private var mClusterMaxZoom: Int? = null
    private var mClusterProperties: MutableList<MutableMap.MutableEntry<String?, ClusterPropertyEntry?>>? =
        null

    private var mMaxZoom: Int? = null
    private var mBuffer: Int? = null
    private var mTolerance: Double? = null
    private var mLineMetrics: Boolean? = null

    override fun addToMap(mapView: MLRNMapView) {
        // Wait for style before adding the source to the map
        mapView.mapLibreMap!!.getStyle(object : OnStyleLoaded {
            override fun onStyleLoaded(style: Style) {
                val map = mapView.mapLibreMap
                super@MLRNShapeSource.addToMap(mapView)
            }
        })
    }

    override fun makeSource(): GeoJsonSource {
        val options = this.options

        if (mShape != null) {
            return GeoJsonSource(mID, mShape, options)
        }

        return GeoJsonSource(mID, mURL!!, options)
    }

    fun setURL(url: URL) {
        mURL = url

        if (mSource != null && mMapView != null && !mMapView.isDestroyed()) {
            mSource!!.setUrl(mURL!!)
        }
    }

    fun setShape(geoJSONStr: String?) {
        mShape = geoJSONStr

        if (mSource != null && mMapView != null && !mMapView.isDestroyed()) {
            mSource!!.setGeoJson(mShape!!)
        }
    }

    fun setCluster(cluster: Boolean) {
        mCluster = cluster
    }

    fun setClusterRadius(clusterRadius: Int) {
        mClusterRadius = clusterRadius
    }

    fun setClusterMinPoints(clusterMinPoints: Int) {
        mClusterMinPoints = clusterMinPoints
    }

    fun setClusterMaxZoom(clusterMaxZoom: Int) {
        mClusterMaxZoom = clusterMaxZoom
    }

    fun setClusterProperties(clusterProperties: MutableList<MutableMap.MutableEntry<String?, ClusterPropertyEntry?>>?) {
        mClusterProperties = clusterProperties
    }

    fun setMaxZoom(maxZoom: Int) {
        mMaxZoom = maxZoom
    }

    fun setBuffer(buffer: Int) {
        mBuffer = buffer
    }

    fun setTolerance(tolerance: Double) {
        mTolerance = tolerance
    }

    fun setLineMetrics(lineMetrics: Boolean) {
        mLineMetrics = lineMetrics
    }

    override fun onPress(event: OnPressEvent) {
        mManager.handleEvent(FeatureClickEvent.makeShapeSourceEvent(this, event))
    }

    private val options: GeoJsonOptions
        get() {
            val options = GeoJsonOptions()

            if (mCluster != null) {
                options.withCluster(mCluster!!)
            }

            if (mClusterRadius != null) {
                options.withClusterRadius(mClusterRadius!!)
            }

            if (mClusterMinPoints != null) {
                options.withClusterMinPoints(mClusterMinPoints!!)
            }

            if (mClusterMaxZoom != null) {
                options.withClusterMaxZoom(mClusterMaxZoom!!)
            }

            if (mClusterProperties != null) {
                for (entry in mClusterProperties) {
                    val property: ClusterPropertyEntry = entry.value!!

                    options.withClusterProperty(entry.key!!, property.operator, property.mapping)
                }
            }

            if (mMaxZoom != null) {
                options.withMaxZoom(mMaxZoom!!)
            }

            if (mBuffer != null) {
                options.withBuffer(mBuffer!!)
            }

            if (mTolerance != null) {
                options.withTolerance(mTolerance!!.toFloat())
            }

            if (mLineMetrics != null) {
                options.withLineMetrics(mLineMetrics!!)
            }

            return options
        }

    fun querySourceFeatures(
        callbackID: String?,
        filter: Expression?
    ) {
        if (mSource == null) {
            val payload: WritableMap = WritableNativeMap()
            payload.putString("error", "source is not yet loaded")
            val event = AndroidCallbackEvent(this, callbackID, payload)
            mManager.handleEvent(event)
            return
        }
        val features: List<Feature> = mSource.querySourceFeatures(filter)
        val payload: WritableMap = WritableNativeMap()
        payload.putString("data", FeatureCollection.fromFeatures(features).toJson())

        val event = AndroidCallbackEvent(this, callbackID, payload)
        mManager.handleEvent(event)
    }

    fun getClusterExpansionZoom(callbackID: String?, featureJSON: String) {
        if (mSource == null) {
            val payload: WritableMap = WritableNativeMap()
            payload.putString("error", "source is not yet loaded")
            val event = AndroidCallbackEvent(this, callbackID, payload)
            mManager.handleEvent(event)
            return
        }
        val feature = Feature.fromJson(featureJSON)

        val zoom = mSource!!.getClusterExpansionZoom(feature)

        val payload: WritableMap = WritableNativeMap()
        payload.putInt("data", zoom)

        val event = AndroidCallbackEvent(this, callbackID, payload)
        mManager.handleEvent(event)
    }

    fun getClusterLeaves(callbackID: String?, featureJSON: String, number: Int, offset: Int) {
        if (mSource == null) {
            val payload: WritableMap = WritableNativeMap()
            payload.putString("error", "source is not yet loaded")
            val event = AndroidCallbackEvent(this, callbackID, payload)
            mManager.handleEvent(event)
            return
        }
        val clusterFeature = Feature.fromJson(featureJSON)
        val leaves = mSource!!.getClusterLeaves(clusterFeature, number.toLong(), offset.toLong())
        val payload: WritableMap = WritableNativeMap()
        payload.putString("data", leaves.toJson())

        val event = AndroidCallbackEvent(this, callbackID, payload)
        mManager.handleEvent(event)
    }

    fun getClusterChildren(callbackID: String?, featureJSON: String) {
        if (mSource == null) {
            val payload: WritableMap = WritableNativeMap()
            payload.putString("error", "source is not yet loaded")
            val event = AndroidCallbackEvent(this, callbackID, payload)
            mManager.handleEvent(event)
            return
        }
        val clusterFeature = Feature.fromJson(featureJSON)
        val leaves = mSource!!.getClusterChildren(clusterFeature)
        val payload: WritableMap = WritableNativeMap()
        payload.putString("data", leaves.toJson())

        val event = AndroidCallbackEvent(this, callbackID, payload)
        mManager.handleEvent(event)
    }

    companion object {
        private val mImagePlaceholder: Bitmap? = null
    }
}
