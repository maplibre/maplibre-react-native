package org.maplibre.reactnative.http

import android.util.Log
import okhttp3.Interceptor
import okhttp3.Response
import java.io.IOException

data class HeaderConfig(
    val value: String,
    val matchRegex: Regex?,
)

class RequestHeadersInterceptor : Interceptor {
    private val requestHeaders: MutableMap<String, HeaderConfig> = HashMap()

    fun addHeader(
        name: String,
        value: String,
        match: String?,
    ) {
        val regex =
            if (match != null) {
                try {
                    Regex(match)
                } catch (e: Exception) {
                    Log.e(
                        "RequestHeadersInterceptor",
                        "Invalid regex pattern '$match': ${e.message}",
                    )
                    null
                }
            } else {
                null
            }

        requestHeaders[name] = HeaderConfig(value, regex)
    }

    fun removeHeader(name: String) {
        requestHeaders.remove(name)
    }

    @Throws(IOException::class)
    override fun intercept(chain: Interceptor.Chain): Response {
        val modifiedHeaderBuilder = chain.request().newBuilder()
        val requestUrl = chain.request().url.toString()

        for (entry in requestHeaders.entries) {
            val config = entry.value
            val shouldApply =
                config.matchRegex == null || config.matchRegex.containsMatchIn(requestUrl)

            if (shouldApply) {
                modifiedHeaderBuilder.addHeader(entry.key, config.value)
            }
        }

        val request = modifiedHeaderBuilder.build()
        return chain.proceed(request)
    }

    companion object {
        val INSTANCE: RequestHeadersInterceptor = RequestHeadersInterceptor()
    }
}
