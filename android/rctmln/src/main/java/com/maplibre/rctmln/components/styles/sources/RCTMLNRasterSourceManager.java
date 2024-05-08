package com.maplibre.rctmln.components.styles.sources;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;


/**
 * Created by nickitaliano on 9/25/17.
 */

public class RCTMLNRasterSourceManager extends RCTMLNTileSourceManager<RCTMLNRasterSource> {
    public static final String REACT_CLASS = "RCTMLNRasterSource";

    public RCTMLNRasterSourceManager(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Nonnull
    @Override
    protected RCTMLNRasterSource createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new RCTMLNRasterSource(reactContext);
    }

    @ReactProp(name="tileSize")
    public void setTileSize(RCTMLNRasterSource source, int tileSize) {
        source.setTileSize(tileSize);
    }

    @Override
    public Map<String, String> customEvents() {
        return null;
    }
}
