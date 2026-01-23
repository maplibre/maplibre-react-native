package org.maplibre.reactnative.components.sources.shapesource

import android.util.Log
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableType
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.MLRNShapeSourceManagerDelegate
import com.facebook.react.viewmanagers.MLRNShapeSourceManagerInterface
import org.json.JSONException
import org.json.JSONObject
import org.maplibre.android.style.expressions.Expression
import org.maplibre.reactnative.components.sources.MLRNSourceManager
import org.maplibre.reactnative.utils.ConvertUtils
import org.maplibre.reactnative.utils.ExpressionParser
import java.net.MalformedURLException
import java.net.URI
import java.util.AbstractMap

@ReactModule(name = MLRNShapeSourceManager.REACT_CLASS)
class MLRNShapeSourceManager(
    context: ReactApplicationContext,
) : MLRNSourceManager<MLRNShapeSource>(context),
    MLRNShapeSourceManagerInterface<MLRNShapeSource> {
    private val delegate: MLRNShapeSourceManagerDelegate<MLRNShapeSource, MLRNShapeSourceManager> =
        MLRNShapeSourceManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<MLRNShapeSource> = delegate

    companion object {
        const val REACT_CLASS: String = "MLRNShapeSource"
        const val LOG_TAG: String = "MLRNShapeSourceManager"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(themedReactContext: ThemedReactContext): MLRNShapeSource = MLRNShapeSource(themedReactContext)

    @ReactProp(name = "data")
    override fun setData(
        source: MLRNShapeSource,
        value: String?,
    ) {
        if (value != null) {
            if (ConvertUtils.isJSONValid(value)) {
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
        source: MLRNShapeSource,
        value: Int,
    ) {
        source.setMaxZoom(if (value != -1) value else null)
    }

    @ReactProp(name = "buffer")
    override fun setBuffer(
        source: MLRNShapeSource,
        value: Int,
    ) {
        source.setBuffer(if (value != -1) value else null)
    }

    @ReactProp(name = "tolerance")
    override fun setTolerance(
        source: MLRNShapeSource,
        value: Double,
    ) {
        source.setTolerance(if (value.toInt() != -1) value else null)
    }

    @ReactProp(name = "lineMetrics")
    override fun setLineMetrics(
        source: MLRNShapeSource,
        lineMetrics: Boolean,
    ) {
        source.setLineMetrics(lineMetrics)
    }

    @ReactProp(name = "cluster")
    override fun setCluster(
        source: MLRNShapeSource,
        value: Boolean,
    ) {
        source.setCluster(value)
    }

    @ReactProp(name = "clusterRadius")
    override fun setClusterRadius(
        source: MLRNShapeSource,
        value: Int,
    ) {
        source.setClusterRadius(if (value != -1) value else null)
    }

    @ReactProp(name = "clusterMinPoints")
    override fun setClusterMinPoints(
        source: MLRNShapeSource,
        value: Int,
    ) {
        source.setClusterMinPoints(if (value != -1) value else null)
    }

    @ReactProp(name = "clusterMaxZoom")
    override fun setClusterMaxZoom(
        source: MLRNShapeSource,
        value: Int,
    ) {
        source.setClusterMaxZoom(if (value != -1) value else null)
    }

    @ReactProp(name = "clusterProperties")
    override fun setClusterProperties(
        source: MLRNShapeSource,
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
