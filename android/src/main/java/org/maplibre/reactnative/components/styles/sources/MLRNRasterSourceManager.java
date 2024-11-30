package org.maplibre.reactnative.components.styles.sources;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

public class MLRNRasterSourceManager extends MLRNTileSourceManager<MLRNRasterSource> {
    public static final String REACT_CLASS = "MLRNRasterSource";

    public MLRNRasterSourceManager(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Nonnull
    @Override
    protected MLRNRasterSource createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new MLRNRasterSource(reactContext);
    }

    @ReactProp(name="tileSize")
    public void setTileSize(MLRNRasterSource source, int tileSize) {
        source.setTileSize(tileSize);
    }

    @Override
    public Map<String, String> customEvents() {
        return null;
    }
}
