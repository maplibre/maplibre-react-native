package org.maplibre.reactnative.components.layer.style

import com.facebook.react.bridge.NoSuchKeyException
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import org.maplibre.android.style.layers.PropertyValue

abstract class MLRNStyleFunctionParser<T, V>(
    private val mStyleValue: MLRNStyleValue,
) {
    val rawStops: MutableList<MLRNStyleFunctionParser<T, V>.StopConfig?>
        get() {
            val readableArrayRawStops = mStyleValue.getArray("stops")

            val rawStops: MutableList<StopConfig?> =
                ArrayList<StopConfig?>()

            if (readableArrayRawStops != null) {
                for (i in 0..<readableArrayRawStops.size()) {
                    val rawStop = readableArrayRawStops.getArray(i)

                    val jsStopKey = rawStop!!.getMap(0)
                    val jsStopValue = rawStop.getMap(1)
                    val innerStyleValue = MLRNStyleValue(jsStopValue!!)

                    var propertyValue: Any? = null
                    try {
                        val dynamicPropertyValue =
                            innerStyleValue.getDynamic("propertyValue")
                        val type = dynamicPropertyValue.type

                        if (type == ReadableType.Number) {
                            propertyValue = dynamicPropertyValue.asDouble()
                        } else if (type == ReadableType.Boolean) {
                            propertyValue = dynamicPropertyValue.asBoolean()
                        } else {
                            propertyValue = dynamicPropertyValue.asString()
                        }
                    } catch (e: NoSuchKeyException) {
                        // not a zoom-property value
                    }

                    val config: StopConfig?
                    if (propertyValue != null) {
                        config =
                            StopConfig(
                                getStopKey(jsStopKey!!),
                                getRawStopValue(innerStyleValue),
                                propertyValue,
                            )
                    } else {
                        config =
                            StopConfig(getStopKey(jsStopKey!!), getRawStopValue(innerStyleValue))
                    }

                    rawStops.add(config)
                }
            }

            return rawStops
        }

    protected abstract fun getRawStopValue(styleValue: MLRNStyleValue?): T?

    protected abstract fun getStopValue(value: T?): PropertyValue<V?>?

    private fun getStopKey(jsStopKey: ReadableMap): Any? {
        val payloadKey = "value"
        val type = jsStopKey.getString("type")

        when (type) {
            "number" -> return jsStopKey.getDouble(payloadKey)
            "boolean" -> return jsStopKey.getBoolean(payloadKey)
            else -> return jsStopKey.getString(payloadKey)
        }
    }

    inner class StopConfig
        constructor(
            var key: Any?,
            var value: T?,
            var propertyValue: Any? = null,
        )
}
