package org.maplibre.reactnative.http

import okhttp3.Interceptor
import okhttp3.Response
import java.io.IOException

class RequestHeadersInterceptor : Interceptor {
    private val requestHeaders: MutableMap<String?, String?> = HashMap()

    fun addHeader(
        headerName: String,
        headerValue: String,
    ) {
        requestHeaders[headerName] = headerValue
    }

    fun removeHeader(headerName: String) {
        requestHeaders.remove(headerName)
    }

    @Throws(IOException::class)
    override fun intercept(chain: Interceptor.Chain): Response {
        val modifiedHeaderBuilder = chain.request().newBuilder()
        for (entry in requestHeaders.entries) {
            modifiedHeaderBuilder.addHeader(entry.key!!, entry.value!!)
        }

        val request = modifiedHeaderBuilder.build()
        return chain.proceed(request)
    }

    companion object {
        val INSTANCE: RequestHeadersInterceptor = RequestHeadersInterceptor()
    }
}
