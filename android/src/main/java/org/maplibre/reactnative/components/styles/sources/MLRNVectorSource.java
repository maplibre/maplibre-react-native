package org.maplibre.reactnative.components.styles.sources;

import android.content.Context;
import androidx.annotation.Nullable;
import androidx.annotation.Size;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import org.maplibre.geojson.Feature;
import org.maplibre.geojson.FeatureCollection;
import org.maplibre.android.style.expressions.Expression;
import org.maplibre.android.style.sources.VectorSource;
import org.maplibre.reactnative.events.AndroidCallbackEvent;
import org.maplibre.reactnative.events.FeatureClickEvent;

import java.util.List;

public class MLRNVectorSource extends MLRNTileSource<VectorSource> {
    private MLRNVectorSourceManager mManager;

    public MLRNVectorSource(Context context, MLRNVectorSourceManager manager) {
        super(context);
        mManager = manager;
    }

    public void onPress(OnPressEvent event) {
        mManager.handleEvent(FeatureClickEvent.makeVectorSourceEvent(this, event));
    }

    @Override
    public VectorSource makeSource() {
        if (isDefaultSource(mID)) {
            return (VectorSource)mMap.getStyle().getSource(DEFAULT_ID);
        }

        String configurationUrl = getURL();
        if (configurationUrl != null) {
            return new VectorSource(mID, getURL());
        }
        return new VectorSource(mID, buildTileset());
    }

    public void querySourceFeatures(String callbackID,
                                             @Size(min = 1) List<String> layerIDs,
                                             @Nullable Expression filter) {
        if (mSource == null) {
            WritableMap payload = new WritableNativeMap();
            payload.putString("error", "source is not yet loaded");
            AndroidCallbackEvent event = new AndroidCallbackEvent(this, callbackID, payload);
            mManager.handleEvent(event);
            return;
        }
        List<Feature> features = mSource.querySourceFeatures(layerIDs.toArray(new String[layerIDs.size()]), filter);
        WritableMap payload = new WritableNativeMap();
        payload.putString("data", FeatureCollection.fromFeatures(features).toJson());

        AndroidCallbackEvent event = new AndroidCallbackEvent(this, callbackID, payload);
        mManager.handleEvent(event);
    }
}
