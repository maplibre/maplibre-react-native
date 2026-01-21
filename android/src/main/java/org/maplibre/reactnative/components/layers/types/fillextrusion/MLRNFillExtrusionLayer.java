package org.maplibre.reactnative.components.layers.types.fillextrusion;

import android.content.Context;

import org.maplibre.android.style.expressions.Expression;
import org.maplibre.android.style.layers.FillExtrusionLayer;
import org.maplibre.reactnative.components.layers.MLRNLayer;
import org.maplibre.reactnative.components.mapview.MLRNMapView;
import org.maplibre.reactnative.components.layers.style.MLRNStyle;
import org.maplibre.reactnative.components.layers.style.MLRNStyleFactory;

public class MLRNFillExtrusionLayer extends MLRNLayer<FillExtrusionLayer> {
    private String mSourceLayerID;

    public MLRNFillExtrusionLayer(Context context) {
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
    public FillExtrusionLayer makeLayer() {
        FillExtrusionLayer layer = new FillExtrusionLayer(mID, mSourceID);

        if (mSourceLayerID != null) {
            layer.setSourceLayer(mSourceLayerID);
        }

        return layer;
    }

    @Override
    public void addStyles() {
        MLRNStyleFactory.setFillExtrusionLayerStyle(mLayer, new MLRNStyle(getContext(), mReactStyle, mMap));
    }

    public void setSourceLayerID(String sourceLayerID) {
        mSourceLayerID = sourceLayerID;

        if (mLayer != null) {
            mLayer.setSourceLayer(mSourceLayerID);
        }
    }
}
