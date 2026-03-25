package org.maplibre.reactnative.modules

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import okhttp3.Dispatcher
import okhttp3.OkHttpClient
import org.maplibre.android.MapLibre
import org.maplibre.android.module.http.HttpRequestUtil
import org.maplibre.reactnative.NativeNetworkModuleSpec
import org.maplibre.reactnative.http.RequestHeadersInterceptor

@ReactModule(name = MLRNNetworkModule.NAME)
class MLRNNetworkModule(
    reactContext: ReactApplicationContext,
) : NativeNetworkModuleSpec(reactContext) {
    companion object {
        const val NAME = "MLRNNetworkModule"
        private var requestHeadersInterceptorAdded = false
    }

    override fun getName() = NAME

    private val context: ReactApplicationContext = reactContext

    private fun ensureInterceptorAdded() {
        if (!requestHeadersInterceptorAdded) {
            Log.i("MLRNNetworkModule", "Add interceptor")
            val httpClient =
                OkHttpClient
                    .Builder()
                    .addInterceptor(RequestHeadersInterceptor.INSTANCE)
                    .dispatcher(getDispatcher())
                    .build()
            HttpRequestUtil.setOkHttpClient(httpClient)
            requestHeadersInterceptorAdded = true
        }
    }

    override fun addHeader(
        name: String,
        value: String,
        match: String?,
    ) {
        context.runOnUiQueueThread {
            ensureInterceptorAdded()
            RequestHeadersInterceptor.INSTANCE.addHeader(name, value, match)
        }
    }

    override fun removeHeader(name: String) {
        context.runOnUiQueueThread {
            RequestHeadersInterceptor.INSTANCE.removeHeader(name)
        }
    }

    override fun addUrlSearchParam(
        key: String,
        value: String,
        match: String?,
    ) {
        context.runOnUiQueueThread {
            ensureInterceptorAdded()
            RequestHeadersInterceptor.INSTANCE.addUrlParam(key, value, match)
        }
    }

    override fun removeUrlSearchParam(key: String) {
        context.runOnUiQueueThread {
            RequestHeadersInterceptor.INSTANCE.removeUrlParam(key)
        }
    }

    override fun setConnected(connected: Boolean) {
        context.runOnUiQueueThread {
            MapLibre.setConnected(connected)
        }
    }

    override fun addUrlTransform(
        id: String,
        match: String?,
        find: String,
        replace: String,
    ) {
        context.runOnUiQueueThread {
            ensureInterceptorAdded()
            RequestHeadersInterceptor.INSTANCE.addUrlTransform(id, match, find, replace)
        }
    }

    override fun removeUrlTransform(id: String) {
        context.runOnUiQueueThread {
            RequestHeadersInterceptor.INSTANCE.removeUrlTransform(id)
        }
    }

    override fun clearUrlTransforms() {
        context.runOnUiQueueThread {
            RequestHeadersInterceptor.INSTANCE.clearUrlTransforms()
        }
    }

    private fun getDispatcher(): Dispatcher {
        val dispatcher = Dispatcher()
        // Matches core limit set on
        // https://github.com/mapbox/mapbox-gl-native/blob/master/platform/android/src/http_file_source.cpp#L192
        dispatcher.maxRequestsPerHost = 20
        return dispatcher
    }
}
