package org.maplibre.reactnative.modules

import android.util.Log
import okhttp3.HttpUrl
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import okhttp3.Interceptor
import okhttp3.Response
import java.io.IOException
import kotlin.collections.iterator

data class UrlTransformConfig(
    val matchRegex: Regex?,
    val findRegex: Regex,
    val replace: String,
)

data class UrlSearchParamConfig(
    val matchRegex: Regex?,
    val name: String,
    val value: String,
)

data class HeaderConfig(
    val matchRegex: Regex?,
    val name: String,
    val value: String,
)

class TransformRequestInterceptor : Interceptor {
    private val urlTransforms: LinkedHashMap<String, UrlTransformConfig> = LinkedHashMap()
    private val urlSearchParams: LinkedHashMap<String, UrlSearchParamConfig> = LinkedHashMap()
    private val headers: LinkedHashMap<String, HeaderConfig> = LinkedHashMap()

    @Volatile
    var jsLogger: ((level: String, tag: String, message: String) -> Unit)? = null

    private fun debugLog(message: String) {
        if (Log.isLoggable(TAG, Log.DEBUG)) {
            Log.d(TAG, message)
        }
        jsLogger?.invoke("debug", TAG, message)
    }

    private fun errorLog(message: String) {
        Log.e(TAG, message)
        jsLogger?.invoke("error", TAG, message)
    }

    fun addUrlTransform(
        id: String,
        match: String?,
        find: String,
        replace: String,
    ) {
        urlTransforms[id] = UrlTransformConfig(match?.let { Regex(it) }, Regex(find), replace)
    }

    fun removeUrlTransform(id: String) {
        urlTransforms.remove(id)
    }

    fun clearUrlTransforms() {
        urlTransforms.clear()
    }

    fun addUrlSearchParam(
        id: String,
        match: String?,
        name: String,
        value: String,
    ) {
        urlSearchParams[id] = UrlSearchParamConfig(match?.let { Regex(it) }, name, value)
    }

    fun removeUrlSearchParam(id: String) {
        urlSearchParams.remove(id)
    }

    fun clearUrlSearchParams() {
        urlSearchParams.clear()
    }

    fun addHeader(
        id: String,
        match: String?,
        name: String,
        value: String,
    ) {
        headers[id] = HeaderConfig(match?.let { Regex(it) }, name, value)
    }

    fun removeHeader(id: String) {
        headers.remove(id)
    }

    fun clearHeaders() {
        headers.clear()
    }

    @Throws(IOException::class)
    override fun intercept(chain: Interceptor.Chain): Response {
        var request = chain.request()

        val hasConfig = urlTransforms.isNotEmpty() || urlSearchParams.isNotEmpty() || headers.isNotEmpty()
        if (hasConfig) {
            debugLog("Request: ${request.url}")
        }

        // 1. URL transforms
        var currentUrl = request.url.toString()
        for ((transformId, config) in urlTransforms) {
            val urlBeforeTransform = currentUrl
            val shouldApply = config.matchRegex == null || config.matchRegex.containsMatchIn(currentUrl)

            if (!shouldApply) {
                debugLog("  URL Transform [$transformId]${matchDescription(config.matchRegex)}: SKIPPED (no match)")
                continue
            }

            val result = config.findRegex.replace(currentUrl, config.replace)
            if (result.toHttpUrlOrNull() == null) {
                errorLog(
                    "URL Transform [$transformId]${matchDescription(config.matchRegex)}: produced invalid URL '$result', " +
                        "using pre-transform URL",
                )
            } else {
                debugLog(
                    "  URL Transform [$transformId]${matchDescription(config.matchRegex)}: APPLIED '$urlBeforeTransform' → '$result'",
                )
                currentUrl = result
            }
        }

        // 2. URL search params
        var modifiedUrl: HttpUrl = currentUrl.toHttpUrlOrNull() ?: request.url
        for (entry in urlSearchParams.entries) {
            val config = entry.value
            val shouldApply =
                config.matchRegex == null || config.matchRegex.containsMatchIn(modifiedUrl.toString())

            if (shouldApply) {
                debugLog(
                    "  URL Search Param [${entry.key}]${matchDescription(config.matchRegex)}: APPLIED '${config.name}=${config.value}'",
                )
                modifiedUrl =
                    modifiedUrl
                        .newBuilder()
                        .setQueryParameter(config.name, config.value)
                        .build()
            } else {
                debugLog("  URL Search Param [${entry.key}]${matchDescription(config.matchRegex)}: SKIPPED (no match)")
            }
        }

        // 3. Headers
        val requestBuilder = request.newBuilder().url(modifiedUrl)
        for (entry in headers.entries) {
            val config = entry.value
            val shouldApply =
                config.matchRegex == null || config.matchRegex.containsMatchIn(modifiedUrl.toString())

            if (shouldApply) {
                debugLog("  Header [${entry.key}]${matchDescription(config.matchRegex)}: APPLIED '${config.name}: ${config.value}'")
                requestBuilder.header(config.name, config.value)
            } else {
                debugLog("  Header [${entry.key}]${matchDescription(config.matchRegex)}: SKIPPED (no match)")
            }
        }

        if (hasConfig) {
            debugLog("Final URL: $modifiedUrl")
        }

        request = requestBuilder.build()
        return chain.proceed(request)
    }

    companion object {
        val INSTANCE: TransformRequestInterceptor = TransformRequestInterceptor()
        private const val TAG = "TransformRequestInterceptor"

        private fun matchDescription(matchRegex: Regex?) = if (matchRegex != null) " (match='${matchRegex.pattern}')" else ""
    }
}
