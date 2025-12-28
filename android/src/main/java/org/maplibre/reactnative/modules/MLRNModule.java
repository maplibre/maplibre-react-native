package org.maplibre.reactnative.modules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;

import org.maplibre.reactnative.components.sources.MLRNSource;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * @deprecated This module is deprecated and will be removed in a future
 *             version.
 *             Use RequestManager for addCustomHeader, removeCustomHeader,
 *             setConnected.
 *             Use the TypeScript constants StyleURL, StyleSource,
 *             OfflinePackDownloadState from the main package exports.
 */
@Deprecated
@ReactModule(name = MLRNModule.REACT_CLASS)
public class MLRNModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "MLRNModule";

    public static final String DEFAULT_STYLE_URL = "https://demotiles.maplibre.org/style.json";

    public MLRNModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
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

        // offline region download states
        Map<String, Integer> offlinePackDownloadStates = new HashMap<>();
        offlinePackDownloadStates.put("Inactive", MLRNOfflineModule.INACTIVE_REGION_DOWNLOAD_STATE);
        offlinePackDownloadStates.put("Active", MLRNOfflineModule.ACTIVE_REGION_DOWNLOAD_STATE);
        offlinePackDownloadStates.put("Complete", MLRNOfflineModule.COMPLETE_REGION_DOWNLOAD_STATE);

        // offline module callback names
        Map<String, String> offlineModuleCallbackNames = new HashMap<>();
        offlineModuleCallbackNames.put("Error", MLRNOfflineModule.OFFLINE_ERROR);
        offlineModuleCallbackNames.put("Progress", MLRNOfflineModule.OFFLINE_PROGRESS);

        return MapBuilder.<String, Object>builder()
                .put("StyleURL", styleURLS)
                .put("StyleSource", styleSourceConsts)
                .put("OfflinePackDownloadState", offlinePackDownloadStates)
                .put("OfflineCallbackName", offlineModuleCallbackNames)
                .build();
    }
}
