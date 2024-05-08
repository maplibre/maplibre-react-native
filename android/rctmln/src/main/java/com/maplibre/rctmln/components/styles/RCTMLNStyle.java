package com.maplibre.rctmln.components.styles;

import android.content.Context;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.mapbox.mapboxsdk.maps.MapboxMap;
import com.maplibre.rctmln.utils.DownloadMapImageTask;
import com.maplibre.rctmln.utils.ImageEntry;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by nickitaliano on 9/12/17.
 */

public class RCTMLNStyle {
    private Context mContext;
    private ReadableMap mReactStyle;
    private MapboxMap mMap;

    public RCTMLNStyle(@NonNull Context context, @NonNull ReadableMap reactStyle, @NonNull MapboxMap map) {
        mContext = context;
        mReactStyle = reactStyle;
        mMap = map;
    }

    public List<String> getAllStyleKeys() {
        if (mReactStyle == null) {
            return new ArrayList<>();
        }

        ReadableMapKeySetIterator it = mReactStyle.keySetIterator();
        List<String> keys = new ArrayList<>();

        while (it.hasNextKey()) {
            String key = it.nextKey();

            if (!key.equals("__MAPBOX_STYLESHEET__")) {
                keys.add(key);
            }
        }

        return keys;
    }

    public RCTMLNStyleValue getStyleValueForKey(String styleKey) {
        ReadableMap styleValueConfig = mReactStyle.getMap(styleKey);

        if (styleValueConfig == null) {
            // TODO: throw exeception here
            return null;
        }

        return new RCTMLNStyleValue(styleValueConfig);
    }

    public void addImage(RCTMLNStyleValue styleValue) {
        addImage(styleValue, null);
    }

    public ImageEntry imageEntry(RCTMLNStyleValue styleValue) {
        return new ImageEntry(styleValue.getImageURI(), styleValue.getImageScale());
    }

    public void addImage(RCTMLNStyleValue styleValue, DownloadMapImageTask.OnAllImagesLoaded callback) {
        if (!styleValue.shouldAddImage()) {
            if (callback != null) {
                callback.onAllImagesLoaded();
            }
            return;
        }

        String uriStr = styleValue.getImageURI();
        Map.Entry[] images = new Map.Entry[]{ new AbstractMap.SimpleEntry(uriStr, imageEntry(styleValue)) };
        DownloadMapImageTask task = new DownloadMapImageTask(mContext, mMap, callback);
        task.execute(images);
    }
}
