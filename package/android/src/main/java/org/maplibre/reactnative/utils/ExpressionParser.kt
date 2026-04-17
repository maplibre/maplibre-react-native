package org.maplibre.reactnative.utils

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.google.gson.JsonArray
import org.maplibre.android.style.expressions.Expression
import org.maplibre.reactnative.utils.ConvertUtils.toJsonArray
import org.maplibre.reactnative.utils.ConvertUtils.typedToJsonElement
import java.util.Locale

object ExpressionParser {
    const val TYPE_STRING: String = "string"
    const val TYPE_ARRAY: String = "array"
    const val TYPE_NUMBER: String = "number"
    const val TYPE_MAP: String = "hashmap"
    const val TYPE_BOOL: String = "boolean"

    @JvmStatic
    fun from(rawExpressions: ReadableArray?): Expression? {
        if (rawExpressions == null || rawExpressions.size() == 0) {
            return null
        }

        return Expression.Converter.convert(toJsonArray(rawExpressions)!!)
    }

    @JvmStatic
    fun fromTyped(rawExpressions: ReadableMap?): Expression {
        val array = typedToJsonElement(rawExpressions) as JsonArray?
        return Expression.Converter.convert(array!!)
    }

    fun from(rawExpression: ReadableMap): Expression? = Expression.raw("[" + stringExpression(rawExpression) + "]")

    private fun stringExpression(item: ReadableMap): String {
        var expression = ""
        val type = item.getString("type")

        if (TYPE_STRING == type) {
            val value = item.getString("value")
            expression = String.format(Locale.ENGLISH, "\"%s\"", value)
        } else if (TYPE_NUMBER == type) {
            val value = item.getDouble("value")
            expression = String.format(Locale.ENGLISH, "%f", value)
        } else if (TYPE_BOOL == type) {
            val value = item.getBoolean("value")
            expression = String.format(Locale.ENGLISH, "%b", value)
        } else if (TYPE_ARRAY == type) {
            val entries = item.getArray("value")

            expression += "["

            for (i in 0..<entries!!.size()) {
                val entryExpression = stringExpression(entries.getMap(i)!!)
                expression += entryExpression

                if (i < entries.size() - 1) {
                    expression += ","
                }
            }

            expression += "]"
        }

        return expression
    }
}
