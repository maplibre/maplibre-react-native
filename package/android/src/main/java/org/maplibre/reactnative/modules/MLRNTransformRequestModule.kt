package org.maplibre.reactnative.modules

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import okhttp3.Dispatcher
import okhttp3.OkHttpClient
import org.maplibre.android.module.http.HttpRequestUtil
import org.maplibre.reactnative.NativeTransformRequestModuleSpec

@ReactModule(name = MLRNTransformRequestModule.NAME)
class MLRNTransformRequestModule(
    reactContext: ReactApplicationContext,
) : NativeTransformRequestModuleSpec(reactContext) {
    companion object {
        const val NAME = "MLRNTransformRequestModule"

        private var requestHeadersInterceptorAdded = false
    }

    override fun getName() = NAME

    private val context: ReactApplicationContext = reactContext

    private fun ensureInterceptorAdded() {
        if (!requestHeadersInterceptorAdded) {
            Log.i("MLRNTransformRequestModule", "Add interceptor")
            val httpClient =
                OkHttpClient
                    .Builder()
                    .addInterceptor(TransformRequestInterceptor.INSTANCE)
                    .dispatcher(getDispatcher())
                    .build()
            HttpRequestUtil.setOkHttpClient(httpClient)
            requestHeadersInterceptorAdded = true
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
            TransformRequestInterceptor.INSTANCE.addUrlTransform(id, match, find, replace)
        }
    }

    override fun removeUrlTransform(id: String) {
        context.runOnUiQueueThread {
            TransformRequestInterceptor.INSTANCE.removeUrlTransform(id)
        }
    }

    override fun clearUrlTransforms() {
        context.runOnUiQueueThread {
            TransformRequestInterceptor.INSTANCE.clearUrlTransforms()
        }
    }

    override fun addUrlSearchParam(
        id: String,
        match: String?,
        key: String,
        value: String,
    ) {
        context.runOnUiQueueThread {
            ensureInterceptorAdded()
            TransformRequestInterceptor.INSTANCE.addUrlSearchParam(id, match, key, value)
        }
    }

    override fun removeUrlSearchParam(id: String) {
        context.runOnUiQueueThread {
            TransformRequestInterceptor.INSTANCE.removeUrlSearchParam(id)
        }
    }

    override fun clearUrlSearchParams() {
        context.runOnUiQueueThread {
            TransformRequestInterceptor.INSTANCE.clearUrlSearchParams()
        }
    }

    override fun addHeader(
        id: String,
        match: String?,
        name: String,
        value: String,
    ) {
        context.runOnUiQueueThread {
            ensureInterceptorAdded()
            TransformRequestInterceptor.INSTANCE.addHeader(id, match, name, value)
        }
    }

    override fun removeHeader(id: String) {
        context.runOnUiQueueThread {
            TransformRequestInterceptor.INSTANCE.removeHeader(id)
        }
    }

    override fun clearHeaders() {
        context.runOnUiQueueThread {
            TransformRequestInterceptor.INSTANCE.clearHeaders()
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
