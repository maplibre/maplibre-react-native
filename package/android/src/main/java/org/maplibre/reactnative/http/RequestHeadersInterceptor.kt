package org.maplibre.reactnative.http

import android.util.Log
import okhttp3.HttpUrl
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import okhttp3.Interceptor
import okhttp3.Response
import java.io.IOException

data class HeaderConfig(
    val value: String,
    val matchRegex: Regex?,
)

data class UrlParamConfig(
    val value: String,
    val matchRegex: Regex?,
)

data class UrlTransformConfig(
    val matchRegex: Regex?,
    val findRegex: Regex,
    val replace: String,
)

class RequestHeadersInterceptor : Interceptor {
    private val requestHeaders: MutableMap<String, HeaderConfig> = HashMap()
    private val urlParams: MutableMap<String, UrlParamConfig> = HashMap()

    // LinkedHashMap preserves insertion order for pipeline execution.
    // Re-putting an existing key updates the rule in-place (same position in pipeline).
    private val urlTransforms: LinkedHashMap<String, UrlTransformConfig> = LinkedHashMap()

    fun addHeader(
        name: String,
        value: String,
        match: String?,
    ) {
        val regex = parseRegex(match, "addHeader")
        requestHeaders[name] = HeaderConfig(value, regex)
    }

    fun removeHeader(name: String) {
        requestHeaders.remove(name)
    }

    fun addUrlParam(
        key: String,
        value: String,
        match: String?,
    ) {
        val regex = parseRegex(match, "addUrlParam")
        urlParams[key] = UrlParamConfig(value, regex)
    }

    fun removeUrlParam(key: String) {
        urlParams.remove(key)
    }

    fun addUrlTransform(
        id: String,
        match: String?,
        find: String,
        replace: String,
    ) {
        val matchRegex =
            match?.let {
                try {
                    Regex(it)
                } catch (e: Exception) {
                    Log.e(
                        "RequestHeadersInterceptor",
                        "addUrlTransform '$id': invalid match regex '$it': ${e.message}",
                    )
                    // Keep null — rule will apply to all URLs rather than being silently dropped
                    null
                }
            }
        val findRegex =
            try {
                Regex(find)
            } catch (e: Exception) {
                Log.e(
                    "RequestHeadersInterceptor",
                    "addUrlTransform '$id': invalid find regex '$find': ${e.message}",
                )
                return
            }
        urlTransforms[id] = UrlTransformConfig(matchRegex, findRegex, replace)
    }

    fun removeUrlTransform(id: String) {
        urlTransforms.remove(id)
    }

    fun clearUrlTransforms() {
        urlTransforms.clear()
    }

    private fun parseRegex(
        match: String?,
        methodName: String,
    ): Regex? =
        if (match != null) {
            try {
                Regex(match)
            } catch (e: Exception) {
                Log.e(
                    "RequestHeadersInterceptor",
                    "Invalid regex pattern in $methodName '$match': ${e.message}",
                )
                null
            }
        } else {
            null
        }

    @Throws(IOException::class)
    override fun intercept(chain: Interceptor.Chain): Response {
        var request = chain.request()
        val originalUrl = request.url.toString()

        // Apply URL transforms — pipeline in insertion order.
        // Each rule receives the URL as left by the previous rule.
        var currentUrl = originalUrl
        for ((transformId, config) in urlTransforms) {
            val shouldApply =
                config.matchRegex == null || config.matchRegex.containsMatchIn(currentUrl)
            if (!shouldApply) continue

            val result = config.findRegex.replace(currentUrl, config.replace)
            if (result.toHttpUrlOrNull() == null) {
                Log.e(
                    "RequestHeadersInterceptor",
                    "URL transform '$transformId' produced invalid URL '$result', " +
                        "using pre-transform URL",
                )
            } else {
                currentUrl = result
            }
        }

        // Apply URL params on the (potentially transformed) URL
        var modifiedUrl: HttpUrl = currentUrl.toHttpUrlOrNull() ?: request.url
        for (entry in urlParams.entries) {
            val config = entry.value
            val shouldApply =
                config.matchRegex == null || config.matchRegex.containsMatchIn(originalUrl)

            if (shouldApply) {
                modifiedUrl =
                    modifiedUrl
                        .newBuilder()
                        .addQueryParameter(entry.key, config.value)
                        .build()
            }
        }

        // Build request with modified URL
        val requestBuilder = request.newBuilder().url(modifiedUrl)

        // Apply headers
        for (entry in requestHeaders.entries) {
            val config = entry.value
            val shouldApply =
                config.matchRegex == null || config.matchRegex.containsMatchIn(originalUrl)

            if (shouldApply) {
                requestBuilder.addHeader(entry.key, config.value)
            }
        }

        request = requestBuilder.build()
        return chain.proceed(request)
    }

    companion object {
        val INSTANCE: RequestHeadersInterceptor = RequestHeadersInterceptor()
    }
}
