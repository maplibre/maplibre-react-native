package org.maplibre.reactnative.components.layers.types.symbol;

import android.content.Context;

import org.maplibre.android.style.expressions.Expression;
import org.maplibre.android.style.layers.SymbolLayer;
import org.maplibre.reactnative.components.layers.MLRNLayer;
import org.maplibre.reactnative.components.mapview.MLRNMapView;
import org.maplibre.reactnative.components.layers.style.MLRNStyle;
import org.maplibre.reactnative.components.layers.style.MLRNStyleFactory;

public class MLRNSymbolLayer extends MLRNLayer<SymbolLayer> {
    private String mSourceLayerID;

    public MLRNSymbolLayer(Context context) {
        super(context);
    }

    @Override
    protected void updateFilter(Expression expression) {
        mLayer.setFilter(expression);
    }

    @Override
    public void addToMap(MLRNMapView mapView) {
        super.addToMap(mapView);
    }

    @Override
    public SymbolLayer makeLayer() {
        SymbolLayer layer = new SymbolLayer(mID, mSourceID);

        if (mSourceLayerID != null) {
            layer.setSourceLayer(mSourceLayerID);
        }

        return layer;
    }

    @Override
    public void addStyles() {
        MLRNStyleFactory.setSymbolLayerStyle(mLayer, new MLRNStyle(getContext(), mReactStyle, mMap));
    }

    public void setSourceLayerID(String sourceLayerID) {
        mSourceLayerID = sourceLayerID;

        if (mLayer != null) {
            mLayer.setSourceLayer(sourceLayerID);
        }
    }
}
