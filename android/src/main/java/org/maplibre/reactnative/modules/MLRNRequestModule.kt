package org.maplibre.reactnative.modules

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import okhttp3.Dispatcher
import okhttp3.OkHttpClient
import org.maplibre.android.MapLibre
import org.maplibre.android.module.http.HttpRequestUtil
import org.maplibre.reactnative.NativeRequestModuleSpec
import org.maplibre.reactnative.http.CustomHeadersInterceptor

@ReactModule(name = MLRNRequestModule.NAME)
class MLRNRequestModule(reactContext: ReactApplicationContext) :
    NativeRequestModuleSpec(reactContext) {

    companion object {
        const val NAME = "MLRNRequestModule"
        private var customHeaderInterceptorAdded = false
    }

    override fun getName() = NAME

    private val context: ReactApplicationContext = reactContext

    init {
        // Initialize MapLibre instance when this module is created
        context.runOnUiQueueThread {
            MapLibre.getInstance(context)
        }
    }

    override fun addCustomHeader(headerName: String, headerValue: String) {
        context.runOnUiQueueThread {
            if (!customHeaderInterceptorAdded) {
                Log.i("MLRNRequestModule", "Add interceptor")
                val httpClient = OkHttpClient.Builder()
                    .addInterceptor(CustomHeadersInterceptor.INSTANCE)
                    .dispatcher(getDispatcher())
                    .build()
                HttpRequestUtil.setOkHttpClient(httpClient)
                customHeaderInterceptorAdded = true
            }

            CustomHeadersInterceptor.INSTANCE.addHeader(headerName, headerValue)
        }
    }

    override fun removeCustomHeader(headerName: String) {
        context.runOnUiQueueThread {
            CustomHeadersInterceptor.INSTANCE.removeHeader(headerName)
        }
    }

    override fun setConnected(connected: Boolean) {
        context.runOnUiQueueThread {
            MapLibre.setConnected(connected)
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
