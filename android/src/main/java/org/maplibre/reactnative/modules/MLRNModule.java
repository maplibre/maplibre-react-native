package org.maplibre.reactnative.modules;

import android.os.Handler;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;

import org.maplibre.android.MapLibre;
import org.maplibre.reactnative.components.sources.MLRNSource;
import org.maplibre.reactnative.http.CustomHeadersInterceptor;

import okhttp3.Dispatcher;
import okhttp3.OkHttpClient;

import org.maplibre.android.module.http.HttpRequestUtil;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

@ReactModule(name = MLRNModule.REACT_CLASS)
public class MLRNModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "MLRNModule";

    public static final String DEFAULT_STYLE_URL = "https://demotiles.maplibre.org/style.json";

    private static boolean customHeaderInterceptorAdded = false;

    private Handler mUiThreadHandler;
    private ReactApplicationContext mReactContext;

    public MLRNModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        mReactContext = reactApplicationContext;
    }

    @Override
    public void initialize() {
        initializeMapLibreInstance();
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    @Nullable
    public Map<String, Object> getConstants() {
        // map style urls
        Map<String, String> styleURLS = new HashMap<>();
        styleURLS.put("Default", DEFAULT_STYLE_URL);

        // style source constants
        Map<String, String> styleSourceConsts = new HashMap<>();
        styleSourceConsts.put("DefaultSourceID", MLRNSource.DEFAULT_ID);

        return MapBuilder.<String, Object>builder()
                .put("StyleURL", styleURLS)
                .put("StyleSource", styleSourceConsts)
                .build();
    }

    @ReactMethod
    public void removeCustomHeader(final String headerName) {
        mReactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                CustomHeadersInterceptor.INSTANCE.removeHeader(headerName);
            }
        });
    }

    @ReactMethod
    public void addCustomHeader(final String headerName, final String headerValue) {
        mReactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                if (!customHeaderInterceptorAdded) {
                    Log.i("header", "Add interceptor");
                    OkHttpClient httpClient = new OkHttpClient.Builder()
                            .addInterceptor(CustomHeadersInterceptor.INSTANCE).dispatcher(getDispatcher()).build();
                    HttpRequestUtil.setOkHttpClient(httpClient);
                    customHeaderInterceptorAdded = true;
                }

                CustomHeadersInterceptor.INSTANCE.addHeader(headerName, headerValue);
            }
        });
    }

    @ReactMethod
    public void setConnected(final boolean connected) {
        mReactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                MapLibre.setConnected(connected);
            }
        });
    }

    private Dispatcher getDispatcher() {
        Dispatcher dispatcher = new Dispatcher();
        // Matches core limit set on
        // https://github.com/mapbox/mapbox-gl-native/blob/master/platform/android/src/http_file_source.cpp#L192
        dispatcher.setMaxRequestsPerHost(20);
        return dispatcher;
    }

    private void initializeMapLibreInstance() {
        mReactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                MapLibre.getInstance(getReactApplicationContext());
            }
        });
    }
}
