package org.maplibre.reactnative.http

import android.util.Log
import okhttp3.HttpUrl
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

class RequestHeadersInterceptor : Interceptor {
    private val requestHeaders: MutableMap<String, HeaderConfig> = HashMap()
    private val urlParams: MutableMap<String, UrlParamConfig> = HashMap()

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

        // Apply URL params first
        var modifiedUrl: HttpUrl = request.url
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
