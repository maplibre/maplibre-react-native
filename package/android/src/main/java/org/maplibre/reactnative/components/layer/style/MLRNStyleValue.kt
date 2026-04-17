package org.maplibre.reactnative.components.layer.style

import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableNativeMap
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.layers.TransitionOptions
import org.maplibre.reactnative.utils.ExpressionParser.fromTyped
import org.maplibre.reactnative.utils.ImageEntry

class MLRNStyleValue(
    config: ReadableMap,
) {
    var type: String?
        private set
    private var isExpression = false
    private var mExpression: Expression? = null
    private var mPayload: ReadableMap?

    var imageURI: String? = null
        private set
    private var isAddImage = false
    var imageScale: Double = ImageEntry.DEFAULT_SCALE
        private set

    init {
        this.type = config.getString("styletype")
        mPayload = config.getMap("stylevalue")

        if ("image" == this.type) {
            imageScale = ImageEntry.DEFAULT_SCALE
            if ("hashmap" == mPayload!!.getString("type")) {
                val map = this.map
                imageURI = map.getMap("uri")!!.getString("value")
                if (map.getMap("scale") != null) {
                    imageScale = map.getMap("scale")!!.getDouble("value")
                }
            } else if ("string" == mPayload!!.getString("type")) {
                val value = mPayload!!.getString("value")
                if (value!!.contains("://")) {
                    imageURI = value
                } else {
                    imageURI = null
                    isExpression = true
                    mExpression = Expression.literal(value)
                }
            }

            isAddImage = imageURI != null
        }

        if (!isAddImage) {
            val dynamic = mPayload!!.getDynamic("value")
            if (dynamic.type == ReadableType.Array) {
                val array = dynamic.asArray()
                if (array!!.size() > 0 && mPayload!!.getString("type") == "array") {
                    val map = array.getMap(0)
                    if (map != null && map.getString("type") == "string") {
                        isExpression = true
                        mExpression = fromTyped(mPayload)
                    }
                }
            }
        }
    }

    fun getInt(key: String): Int = mPayload!!.getInt(key)

    fun getString(key: String): String = mPayload!!.getString(key)!!

    fun getDouble(key: String): Double = mPayload!!.getDouble(key)

    fun getFloat(key: String): Float = getDouble(key).toFloat()

    fun getDynamic(key: String): Dynamic = mPayload!!.getDynamic(key)

    fun getArray(key: String): ReadableArray? = mPayload!!.getArray(key)

    fun getBoolean(key: String): Boolean = mPayload!!.getBoolean(key)

    fun getFloatArray(key: String): Array<Float?> {
        val arr = getArray(key)

        val floatArr = arrayOfNulls<Float>(arr!!.size())
        for (i in 0..<arr.size()) {
            val item = arr.getMap(i)
            floatArr[i] = item!!.getDouble("value").toFloat()
        }

        return floatArr
    }

    fun getStringArray(key: String): Array<String?> {
        val arr = getArray(key)

        val stringArr = arrayOfNulls<String>(arr!!.size())
        for (i in 0..<arr.size()) {
            val item = arr.getMap(i)
            stringArr[i] = item!!.getString("value")
        }

        return stringArr
    }

    val map: ReadableMap
        get() {
            val result = WritableNativeMap()

            if ("hashmap" == mPayload!!.getString("type")) {
                val keyValues = mPayload!!.getArray("value")
                for (i in 0..<keyValues!!.size()) {
                    val keyValue = keyValues.getArray(i)
                    val stringKey = keyValue!!.getMap(0)!!.getString("value")
                    val value = WritableNativeMap()
                    value.merge(keyValue.getMap(1)!!)
                    result.putMap(stringKey!!, value)
                }
            }

            return result
        }

    fun getExpression(): Expression? = mExpression

    fun isExpression(): Boolean = isExpression

    fun shouldAddImage(): Boolean = isAddImage

    val isImageStringValue: Boolean
        get() = "string" == mPayload!!.getString("type")

    fun getImageStringValue(): String? = mPayload!!.getString("value")

    val transition: TransitionOptions?
        get() {
            if (this.type != "transition") {
                return null
            }
            val config = this.map

            var enablePlacementTransitions = true
            if (config.hasKey("enablePlacementTransitions")) {
                enablePlacementTransitions =
                    config.getMap("enablePlacementTransitions")!!.getBoolean("value")
            }
            var duration = 300
            var delay = 0
            if (config.hasKey("duration") && ReadableType.Map == config.getType("duration")) {
                duration = config.getMap("duration")!!.getInt("value")
            }
            if (config.hasKey("delay") && ReadableType.Map == config.getType("delay")) {
                delay = config.getMap("delay")!!.getInt("value")
            }

            return TransitionOptions(duration.toLong(), delay.toLong(), enablePlacementTransitions)
        }
}
