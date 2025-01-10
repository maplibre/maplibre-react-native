package org.maplibre.reactnative.modules;

import android.os.Handler;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import org.maplibre.android.MapLibre;
import org.maplibre.android.WellKnownTileServer;
import org.maplibre.reactnative.components.camera.constants.CameraMode;
import org.maplibre.reactnative.components.styles.sources.MLRNSource;
import org.maplibre.reactnative.events.constants.EventTypes;
import org.maplibre.reactnative.http.CustomHeadersInterceptor;
import org.maplibre.reactnative.location.UserLocationVerticalAlignment;
import org.maplibre.reactnative.location.UserTrackingMode;

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

        // events
        Map<String, String> eventTypes = new HashMap<>();
        eventTypes.put("MapClick", EventTypes.MAP_CLICK);
        eventTypes.put("MapLongClick", EventTypes.MAP_LONG_CLICK);
        eventTypes.put("RegionWillChange", EventTypes.REGION_WILL_CHANGE);
        eventTypes.put("RegionIsChanging", EventTypes.REGION_IS_CHANGING);
        eventTypes.put("RegionDidChange", EventTypes.REGION_DID_CHANGE);
        eventTypes.put("UserLocationUpdated", EventTypes.USER_LOCATION_UPDATED);
        eventTypes.put("WillStartLoadingMap", EventTypes.WILL_START_LOADING_MAP);
        eventTypes.put("DidFinishLoadingMap", EventTypes.DID_FINISH_LOADING_MAP);
        eventTypes.put("DidFailLoadingMap", EventTypes.DID_FAIL_LOADING_MAP);
        eventTypes.put("WillStartRenderingFrame", EventTypes.WILL_START_RENDERING_FRAME);
        eventTypes.put("DidFinishRenderingFrame", EventTypes.DID_FINISH_RENDERING_FRAME);
        eventTypes.put("DidFinishRenderingFrameFully", EventTypes.DID_FINISH_RENDERING_FRAME_FULLY);
        eventTypes.put("WillStartRenderingMap", EventTypes.WILL_START_RENDERING_MAP);
        eventTypes.put("DidFinishRenderingMap", EventTypes.DID_FINISH_RENDERING_MAP);
        eventTypes.put("DidFinishRenderingMapFully", EventTypes.DID_FINISH_RENDERING_MAP_FULLY);
        eventTypes.put("DidFinishLoadingStyle", EventTypes.DID_FINISH_LOADING_STYLE);

        // user tracking modes
        Map<String, Integer> userTrackingModes = new HashMap<>();
        userTrackingModes.put("None", UserTrackingMode.NONE);
        userTrackingModes.put("Follow", UserTrackingMode.FOLLOW);
        userTrackingModes.put("FollowWithCourse", UserTrackingMode.FollowWithCourse);
        userTrackingModes.put("FollowWithHeading", UserTrackingMode.FollowWithHeading);

        // user location vertical alignment
        Map<String, Integer> userLocationVerticalAlignment = new HashMap<>();
        userLocationVerticalAlignment.put("Center", UserLocationVerticalAlignment.CENTER);
        userLocationVerticalAlignment.put("Top", UserLocationVerticalAlignment.TOP);
        userLocationVerticalAlignment.put("Bottom", UserLocationVerticalAlignment.BOTTOM);

        // camera modes
        Map<String, Integer> cameraModes = new HashMap<>();
        cameraModes.put("Flight", CameraMode.FLIGHT);
        cameraModes.put("Ease", CameraMode.EASE);
        cameraModes.put("Linear", CameraMode.LINEAR);
        cameraModes.put("None", CameraMode.NONE);

        // style source constants
        Map<String, String> styleSourceConsts = new HashMap<>();
        styleSourceConsts.put("DefaultSourceID", MLRNSource.DEFAULT_ID);

        // offline region download states
        Map<String, Integer> offlinePackDownloadStates = new HashMap<>();
        offlinePackDownloadStates.put("Inactive", MLRNOfflineModule.INACTIVE_REGION_DOWNLOAD_STATE);
        offlinePackDownloadStates.put("Active", MLRNOfflineModule.ACTIVE_REGION_DOWNLOAD_STATE);
        offlinePackDownloadStates.put("Complete", MLRNOfflineModule.COMPLETE_REGION_DOWNLOAD_STATE);

        // offline module callback names
        Map<String, String> offlineModuleCallbackNames = new HashMap<>();
        offlineModuleCallbackNames.put("Error", MLRNOfflineModule.OFFLINE_ERROR);
        offlineModuleCallbackNames.put("Progress", MLRNOfflineModule.OFFLINE_PROGRESS);

        // location module callback names
        Map<String, String> locationModuleCallbackNames = new HashMap<>();
        locationModuleCallbackNames.put("Update", MLRNLocationModule.LOCATION_UPDATE);

        return MapBuilder.<String, Object>builder()
                .put("StyleURL", styleURLS)
                .put("EventTypes", eventTypes)
                .put("UserTrackingModes", userTrackingModes)
                .put("UserLocationVerticalAlignment", userLocationVerticalAlignment)
                .put("CameraModes", cameraModes)
                .put("StyleSource", styleSourceConsts)
                .put("OfflinePackDownloadState", offlinePackDownloadStates)
                .put("OfflineCallbackName", offlineModuleCallbackNames)
                .put("LocationCallbackName", locationModuleCallbackNames)
                .build();
    }

    /**
     * @deprecated This will be removed in the next major version.
     * @see https://github.com/maplibre/maplibre-react-native/issues/25#issuecomment-1382382044
     */
    @Deprecated
    @ReactMethod
    public void setAccessToken(final String accessToken) {
        mReactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                if (accessToken == null) {
                    MapLibre.getInstance(getReactApplicationContext());
                } else {
                    MapLibre.getInstance(getReactApplicationContext(), accessToken, WellKnownTileServer.Mapbox);
                }
            }
        });
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

    /**
     * @deprecated This will be removed in the next major version.
     * @see https://github.com/maplibre/maplibre-react-native/issues/25#issuecomment-1382382044
     */
    @Deprecated
    @ReactMethod
    public void getAccessToken(Promise promise) {
        String token = MapLibre.getApiKey();
        if(token == null) {
            promise.reject("missing_access_token", "No access token has been set");
        } else {
            promise.resolve(token);
        }
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
