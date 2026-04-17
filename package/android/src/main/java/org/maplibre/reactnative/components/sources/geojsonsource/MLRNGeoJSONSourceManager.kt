package org.maplibre.reactnative.components.sources.geojsonsource

import android.util.Log
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableType
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.MLRNGeoJSONSourceManagerDelegate
import com.facebook.react.viewmanagers.MLRNGeoJSONSourceManagerInterface
import org.json.JSONException
import org.json.JSONObject
import org.maplibre.android.style.expressions.Expression
import org.maplibre.reactnative.components.sources.MLRNSourceManager
import org.maplibre.reactnative.utils.ExpressionParser
import java.net.MalformedURLException
import java.net.URI
import java.util.AbstractMap

@ReactModule(name = MLRNGeoJSONSourceManager.REACT_CLASS)
class MLRNGeoJSONSourceManager(
    context: ReactApplicationContext,
) : MLRNSourceManager<MLRNGeoJSONSource>(context),
    MLRNGeoJSONSourceManagerInterface<MLRNGeoJSONSource> {
    private val delegate: MLRNGeoJSONSourceManagerDelegate<MLRNGeoJSONSource, MLRNGeoJSONSourceManager> =
        MLRNGeoJSONSourceManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<MLRNGeoJSONSource> = delegate

    companion object {
        const val REACT_CLASS: String = "MLRNGeoJSONSource"
        const val LOG_TAG: String = "MLRNGeoJSONSourceManager"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(themedReactContext: ThemedReactContext): MLRNGeoJSONSource = MLRNGeoJSONSource(themedReactContext)

    fun isJSONValid(test: String): Boolean {
        try {
            JSONObject(test)
        } catch (_: JSONException) {
            return false
        }
        return true
    }

    @ReactProp(name = "data")
    override fun setData(
        source: MLRNGeoJSONSource,
        value: String?,
    ) {
        if (value != null) {
            if (isJSONValid(value)) {
                source.setGeoJson(value)
            } else {
                try {
                    source.setURI(URI(value))
                } catch (error: MalformedURLException) {
                    Log.w(LOG_TAG, error.localizedMessage)
                }
            }
        }
    }

    @ReactProp(name = "maxzoom")
    override fun setMaxzoom(
        source: MLRNGeoJSONSource,
        value: Int,
    ) {
        source.setMaxZoom(if (value != -1) value else null)
    }

    @ReactProp(name = "buffer")
    override fun setBuffer(
        source: MLRNGeoJSONSource,
        value: Int,
    ) {
        source.setBuffer(if (value != -1) value else null)
    }

    @ReactProp(name = "tolerance")
    override fun setTolerance(
        source: MLRNGeoJSONSource,
        value: Double,
    ) {
        source.setTolerance(if (value.toInt() != -1) value else null)
    }

    @ReactProp(name = "lineMetrics")
    override fun setLineMetrics(
        source: MLRNGeoJSONSource,
        lineMetrics: Boolean,
    ) {
        source.setLineMetrics(lineMetrics)
    }

    @ReactProp(name = "cluster")
    override fun setCluster(
        source: MLRNGeoJSONSource,
        value: Boolean,
    ) {
        source.setCluster(value)
    }

    @ReactProp(name = "clusterRadius")
    override fun setClusterRadius(
        source: MLRNGeoJSONSource,
        value: Int,
    ) {
        source.setClusterRadius(if (value != -1) value else null)
    }

    @ReactProp(name = "clusterMinPoints")
    override fun setClusterMinPoints(
        source: MLRNGeoJSONSource,
        value: Int,
    ) {
        source.setClusterMinPoints(if (value != -1) value else null)
    }

    @ReactProp(name = "clusterMaxZoom")
    override fun setClusterMaxZoom(
        source: MLRNGeoJSONSource,
        value: Int,
    ) {
        source.setClusterMaxZoom(if (value != -1) value else null)
    }

    @ReactProp(name = "clusterProperties")
    override fun setClusterProperties(
        source: MLRNGeoJSONSource,
        value: Dynamic,
    ) {
        val map = value.asMap()
        val properties: MutableList<MutableMap.MutableEntry<String, ClusterPropertyEntry>> =
            ArrayList()

        if (map != null) {
            val iterator = map.keySetIterator()
            while (iterator.hasNextKey()) {
                val name = iterator.nextKey()
                val expressions = map.getArray(name)

                val operator: Expression? =
                    if (expressions!!.getType(0) == ReadableType.Array) {
                        ExpressionParser.from(expressions.getArray(0))
                    } else {
                        Expression.literal(expressions.getString(0)!!)
                    }

                val mapping = ExpressionParser.from(expressions.getArray(1))

                // TODO: Throw error instead?
                if (operator != null && mapping != null) {
                    properties.add(
                        AbstractMap.SimpleEntry<String, ClusterPropertyEntry>(
                            name,
                            ClusterPropertyEntry(operator, mapping),
                        ),
                    )
                }
            }
        }

        source.setClusterProperties(properties)
    }
}
