package org.maplibre.mlrn.components.styles.layers;

import android.content.Context;

import org.maplibre.android.style.expressions.Expression;
import org.maplibre.android.style.layers.CircleLayer;
import org.maplibre.mlrn.components.mapview.MLRNMapView;
import org.maplibre.mlrn.components.styles.MLRNStyle;
import org.maplibre.mlrn.components.styles.MLRNStyleFactory;

/**
 * Created by nickitaliano on 9/18/17.
 */

public class MLRNCircleLayer extends RCTLayer<CircleLayer> {
    private String mSourceLayerID;

    public MLRNCircleLayer(Context context) {
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
    public CircleLayer makeLayer() {
        CircleLayer layer = new CircleLayer(mID, mSourceID);

        if (mSourceLayerID != null) {
            layer.setSourceLayer(mSourceLayerID);
        }

        return layer;
    }

    @Override
    public void addStyles() {
        MLRNStyleFactory.setCircleLayerStyle(mLayer, new MLRNStyle(getContext(), mReactStyle, mMap));
    }

    public void setSourceLayerID(String sourceLayerID) {
        mSourceLayerID = sourceLayerID;

        if (mLayer != null) {
            mLayer.setSourceLayer(sourceLayerID);
        }
    }
}
