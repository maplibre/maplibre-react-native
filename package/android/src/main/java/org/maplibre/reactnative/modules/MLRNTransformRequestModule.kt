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

        private var transformRequestInterceptorAdded = false
    }

    override fun getName() = NAME

    override fun initialize() {
        reactApplicationContext.getNativeModule(MLRNLogModule::class.java)?.let { logModule ->
            TransformRequestInterceptor.INSTANCE.jsLogger = { level, tag, message ->
                logModule.onLog(level, tag, message)
            }
        }
    }

    private fun ensureInterceptorAdded() {
        if (!transformRequestInterceptorAdded) {
            Log.i(NAME, "Add interceptor")
            val httpClient =
                OkHttpClient
                    .Builder()
                    .addInterceptor(TransformRequestInterceptor.INSTANCE)
                    .dispatcher(getDispatcher())
                    .build()
            HttpRequestUtil.setOkHttpClient(httpClient)
            transformRequestInterceptorAdded = true
        }
    }

    override fun addUrlTransform(
        id: String,
        match: String?,
        find: String,
        replace: String,
    ) {
        requireValidRegex(match, "addUrlTransform", "match")
        requireValidRegex(find, "addUrlTransform", "find")
        reactApplicationContext.runOnUiQueueThread {
            ensureInterceptorAdded()
            TransformRequestInterceptor.INSTANCE.addUrlTransform(id, match, find, replace)
        }
    }

    override fun removeUrlTransform(id: String) {
        reactApplicationContext.runOnUiQueueThread {
            TransformRequestInterceptor.INSTANCE.removeUrlTransform(id)
        }
    }

    override fun clearUrlTransforms() {
        reactApplicationContext.runOnUiQueueThread {
            TransformRequestInterceptor.INSTANCE.clearUrlTransforms()
        }
    }

    override fun addUrlSearchParam(
        id: String,
        match: String?,
        key: String,
        value: String,
    ) {
        requireValidRegex(match, "addUrlSearchParam", "match")
        reactApplicationContext.runOnUiQueueThread {
            ensureInterceptorAdded()
            TransformRequestInterceptor.INSTANCE.addUrlSearchParam(id, match, key, value)
        }
    }

    override fun removeUrlSearchParam(id: String) {
        reactApplicationContext.runOnUiQueueThread {
            TransformRequestInterceptor.INSTANCE.removeUrlSearchParam(id)
        }
    }

    override fun clearUrlSearchParams() {
        reactApplicationContext.runOnUiQueueThread {
            TransformRequestInterceptor.INSTANCE.clearUrlSearchParams()
        }
    }

    override fun addHeader(
        id: String,
        match: String?,
        name: String,
        value: String,
    ) {
        requireValidRegex(match, "addHeader", "match")
        reactApplicationContext.runOnUiQueueThread {
            ensureInterceptorAdded()
            TransformRequestInterceptor.INSTANCE.addHeader(id, match, name, value)
        }
    }

    override fun removeHeader(id: String) {
        reactApplicationContext.runOnUiQueueThread {
            TransformRequestInterceptor.INSTANCE.removeHeader(id)
        }
    }

    override fun clearHeaders() {
        reactApplicationContext.runOnUiQueueThread {
            TransformRequestInterceptor.INSTANCE.clearHeaders()
        }
    }

    private fun requireValidRegex(
        pattern: String?,
        methodName: String,
        fieldName: String,
    ) {
        if (pattern != null) {
            try {
                Regex(pattern)
            } catch (e: Exception) {
                throw IllegalArgumentException(
                    "[$NAME] $methodName: invalid $fieldName regex '$pattern': ${e.message}",
                )
            }
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
