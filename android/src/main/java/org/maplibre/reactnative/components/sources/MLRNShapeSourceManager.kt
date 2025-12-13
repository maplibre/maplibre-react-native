package org.maplibre.reactnative.components.sources

import android.util.Log
import android.view.View
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.common.MapBuilder.builder
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import org.maplibre.android.style.expressions.Expression
import org.maplibre.reactnative.components.AbstractEventEmitter
import org.maplibre.reactnative.events.constants.EventKeys
import org.maplibre.reactnative.utils.ClusterPropertyEntry
import org.maplibre.reactnative.utils.ExpressionParser
import java.net.MalformedURLException
import java.net.URL
import java.util.AbstractMap

class MLRNShapeSourceManager(context: ReactApplicationContext) :
    AbstractEventEmitter<MLRNShapeSource?>(context) {
    private val mContext: ReactApplicationContext?

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createViewInstance(reactContext: ThemedReactContext?): MLRNShapeSource {
        return MLRNShapeSource(reactContext, this)
    }

    override fun getChildAt(source: MLRNShapeSource, childPosition: Int): View? {
        return source.getLayerAt(childPosition)
    }

    override fun getChildCount(source: MLRNShapeSource): Int {
        return source.getLayerCount()
    }

    override fun addView(source: MLRNShapeSource, childView: View?, childPosition: Int) {
        source.addLayer(childView, getChildCount(source))
    }

    override fun removeViewAt(source: MLRNShapeSource, childPosition: Int) {
        source.removeLayer(childPosition)
    }

    @ReactProp(name = "id")
    fun setId(source: MLRNShapeSource, id: String?) {
        source.setID(id)
    }

    @ReactProp(name = "url")
    fun setURL(source: MLRNShapeSource, urlStr: String?) {
        try {
            source.setURL(URL(urlStr))
        } catch (e: MalformedURLException) {
            Log.w(LOG_TAG, e.getLocalizedMessage())
        }
    }

    @ReactProp(name = "shape")
    fun setGeometry(source: MLRNShapeSource, geoJSONStr: String?) {
        source.setShape(geoJSONStr)
    }

    @ReactProp(name = "cluster")
    fun setCluster(source: MLRNShapeSource, cluster: Int) {
        source.setCluster(cluster == 1)
    }

    @ReactProp(name = "clusterRadius")
    fun setClusterRadius(source: MLRNShapeSource, radius: Int) {
        source.setClusterRadius(radius)
    }

    @ReactProp(name = "clusterMinPoints")
    fun setClusterMinPoints(source: MLRNShapeSource, minPoints: Int) {
        source.setClusterMinPoints(minPoints)
    }

    @ReactProp(name = "clusterMaxZoomLevel")
    fun setClusterMaxZoomLevel(source: MLRNShapeSource, clusterMaxZoom: Int) {
        source.setClusterMaxZoom(clusterMaxZoom)
    }

    @ReactProp(name = "clusterProperties")
    fun setClusterProperties(source: MLRNShapeSource, map: ReadableMap) {
        val properties: MutableList<MutableMap.MutableEntry<String?, ClusterPropertyEntry?>?> =
            ArrayList<MutableMap.MutableEntry<String?, ClusterPropertyEntry?>?>()

        val iterator = map.keySetIterator()
        while (iterator.hasNextKey()) {
            val name = iterator.nextKey()
            val expressions = map.getArray(name)

            val operator: Expression?
            if (expressions!!.getType(0) == ReadableType.Array) {
                operator = ExpressionParser.from(expressions.getArray(0))
            } else {
                operator = Expression.literal(expressions.getString(0)!!)
            }

            val mapping = ExpressionParser.from(expressions.getArray(1))

            properties.add(
                AbstractMap.SimpleEntry<String?, ClusterPropertyEntry?>(
                    name,
                    ClusterPropertyEntry(operator, mapping)
                )
            )
        }

        source.setClusterProperties(properties)
    }

    @ReactProp(name = "maxZoomLevel")
    fun setMaxZoomLevel(source: MLRNShapeSource, maxZoom: Int) {
        source.setMaxZoom(maxZoom)
    }

    @ReactProp(name = "buffer")
    fun setBuffer(source: MLRNShapeSource, buffer: Int) {
        source.setBuffer(buffer)
    }

    @ReactProp(name = "tolerance")
    fun setTolerance(source: MLRNShapeSource, tolerance: Double) {
        source.setTolerance(tolerance)
    }

    @ReactProp(name = "lineMetrics")
    fun setLineMetrics(source: MLRNShapeSource, lineMetrics: Boolean) {
        source.setLineMetrics(lineMetrics)
    }

    @ReactProp(name = "hasPressListener")
    fun setHasPressListener(source: MLRNShapeSource, hasPressListener: Boolean) {
        source.setHasPressListener(hasPressListener)
    }

    @ReactProp(name = "hitbox")
    fun setHitbox(source: MLRNShapeSource, map: ReadableMap) {
        source.setHitbox(map)
    }

    public override fun customEvents(): MutableMap<String?, String?>? {
        return builder<String?, String?>()
            .put(EventKeys.SHAPE_SOURCE_LAYER_CLICK, "onMapboxShapeSourcePress")
            .put(EventKeys.MAP_ANDROID_CALLBACK, "onAndroidCallback")
            .build()
    }

    init {
        mContext = context
    }

    override fun getCommandsMap(): MutableMap<String?, Int?>? {
        return builder<String?, Int?>()
            .put("features", METHOD_FEATURES)
            .put("getClusterExpansionZoom", METHOD_GET_CLUSTER_EXPANSION_ZOOM)
            .put("getClusterLeaves", METHOD_GET_CLUSTER_LEAVES)
            .put("getClusterChildren", METHOD_GET_CLUSTER_CHILDREN)
            .build()
    }

    override fun receiveCommand(source: MLRNShapeSource, commandID: Int, args: ReadableArray?) {
        when (commandID) {
            METHOD_FEATURES -> source.querySourceFeatures(
                args!!.getString(0),
                ExpressionParser.from(args.getArray(1))
            )

            METHOD_GET_CLUSTER_EXPANSION_ZOOM -> source.getClusterExpansionZoom(
                args!!.getString(0),
                args.getString(1)
            )

            METHOD_GET_CLUSTER_LEAVES -> source.getClusterLeaves(
                args!!.getString(0),
                args.getString(1),
                args.getInt(2),
                args.getInt((3))
            )

            METHOD_GET_CLUSTER_CHILDREN -> source.getClusterChildren(
                args!!.getString(0),
                args.getString(1)
            )
        }
    }

    companion object {
        const val LOG_TAG: String = "MLRNShapeSourceManager"
        const val REACT_CLASS: String = "MLRNShapeSource"

        //region React Methods
        const val METHOD_FEATURES: Int = 103
        const val METHOD_GET_CLUSTER_EXPANSION_ZOOM: Int = 104
        const val METHOD_GET_CLUSTER_LEAVES: Int = 105
        const val METHOD_GET_CLUSTER_CHILDREN: Int = 106
    }
}
