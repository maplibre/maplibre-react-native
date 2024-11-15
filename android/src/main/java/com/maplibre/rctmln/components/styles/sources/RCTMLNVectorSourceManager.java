package com.maplibre.rctmln.components.styles.sources;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.maplibre.rctmln.events.constants.EventKeys;
import com.maplibre.rctmln.utils.ConvertUtils;
import com.maplibre.rctmln.utils.ExpressionParser;

import javax.annotation.Nonnull;

import java.util.Map;

/**
 * Created by nickitaliano on 9/8/17.
 */

public class RCTMLNVectorSourceManager extends RCTMLNTileSourceManager<RCTMLNVectorSource> {
    public static final String REACT_CLASS = "RCTMLNVectorSource";

    public RCTMLNVectorSourceManager(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Nonnull
    @Override
    protected RCTMLNVectorSource createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new RCTMLNVectorSource(reactContext, this);
    }

    @ReactProp(name = "hasPressListener")
    public void setHasPressListener(RCTMLNVectorSource source, boolean hasPressListener) {
        source.setHasPressListener(hasPressListener);
    }

    @ReactProp(name="hitbox")
    public void setHitbox(RCTMLNVectorSource source, ReadableMap map) {
        source.setHitbox(map);
    }

    @Override
    public Map<String, String> customEvents() {
        return MapBuilder.<String, String>builder()
                .put(EventKeys.VECTOR_SOURCE_LAYER_CLICK, "onMapboxVectorSourcePress")
                .put(EventKeys.MAP_ANDROID_CALLBACK, "onAndroidCallback")
                .build();
    }

    //region React Methods
    public static final int METHOD_FEATURES = 102;

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.<String, Integer>builder()
                .put("features", METHOD_FEATURES)
                .build();
    }

    @Override
    public void receiveCommand(RCTMLNVectorSource vectorSource, int commandID, @Nullable ReadableArray args) {

        switch (commandID) {
            case METHOD_FEATURES:
                vectorSource.querySourceFeatures(
                        args.getString(0),
                        ConvertUtils.toStringList(args.getArray(1)),
                        ExpressionParser.from(args.getArray(2))
                        );
                break;
        }
    }
}
