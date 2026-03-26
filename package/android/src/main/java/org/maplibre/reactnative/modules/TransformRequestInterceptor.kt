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

data class UrlParamConfig(
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
    // LinkedHashMap preserves insertion order for pipeline execution.
    // Re-putting an existing key updates the rule in-place (same position in pipeline).
    private val urlTransforms: LinkedHashMap<String, UrlTransformConfig> = LinkedHashMap()
    private val urlParams: LinkedHashMap<String, UrlParamConfig> = LinkedHashMap()
    private val requestHeaders: LinkedHashMap<String, HeaderConfig> = LinkedHashMap()



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
                        "TransformRequestInterceptor",
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
                    "TransformRequestInterceptor",
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

    fun addUrlSearchParam(
        id: String,
        match: String?,
        name: String,
        value: String,
    ) {
        val regex = parseRegex(match, "addUrlSearchParam")
        urlParams[id] = UrlParamConfig(regex, name, value)
    }

    fun removeUrlSearchParam(id: String) {
        urlParams.remove(id)
    }

    fun addHeader(
        id: String,
        match: String?,
        name: String,
        value: String,
    ) {
        val regex = parseRegex(match, "addHeader")
        requestHeaders[id] = HeaderConfig(regex, name, value)
    }

    fun removeHeader(id: String) {
        requestHeaders.remove(id)
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
                    "TransformRequestInterceptor",
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
                    "TransformRequestInterceptor",
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
                        .addQueryParameter(config.name, config.value)
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
                requestBuilder.addHeader(config.name, config.value)
            }
        }

        request = requestBuilder.build()
        return chain.proceed(request)
    }

    companion object {
        val INSTANCE: TransformRequestInterceptor = TransformRequestInterceptor()
    }
}
