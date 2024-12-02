package org.maplibre.reactnative.components.styles.layers;

import android.content.Context;

import org.maplibre.android.style.expressions.Expression;
import org.maplibre.android.style.layers.HeatmapLayer;
import org.maplibre.reactnative.components.mapview.MLRNMapView;
import org.maplibre.reactnative.components.styles.MLRNStyle;
import org.maplibre.reactnative.components.styles.MLRNStyleFactory;

public class MLRNHeatmapLayer extends MLRNLayer<HeatmapLayer> {
    private String mSourceLayerID;

    public MLRNHeatmapLayer(Context context){
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
    public HeatmapLayer makeLayer() {
        HeatmapLayer layer = new HeatmapLayer(mID, mSourceID);

        if (mSourceLayerID != null) {
            layer.setSourceLayer(mSourceLayerID);
        }

        return layer;
    }

    @Override
    public void addStyles() {
        MLRNStyleFactory.setHeatmapLayerStyle(mLayer, new MLRNStyle(getContext(), mReactStyle, mMap));
    }

    public void setSourceLayerID(String sourceLayerID) {
        mSourceLayerID = sourceLayerID;

        if (mLayer != null) {
            mLayer.setSourceLayer(sourceLayerID);
        }
    }
}
