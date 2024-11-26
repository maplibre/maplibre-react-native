package org.maplibre.rctmln.components.styles.layers;

import android.content.Context;

import org.maplibre.android.style.expressions.Expression;
import org.maplibre.android.style.layers.HeatmapLayer;
import org.maplibre.rctmln.components.mapview.RCTMLNMapView;
import org.maplibre.rctmln.components.styles.RCTMLNStyle;
import org.maplibre.rctmln.components.styles.RCTMLNStyleFactory;

/**
 * Created by dhee9000 on 6/8/2019
 */

public class RCTMLNHeatmapLayer extends RCTLayer<HeatmapLayer> {
    private String mSourceLayerID;

    public RCTMLNHeatmapLayer(Context context){
        super(context);
    }

    @Override
    protected void updateFilter(Expression expression) {
        mLayer.setFilter(expression);
    }

    @Override
    public void addToMap(RCTMLNMapView mapView) {
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
        RCTMLNStyleFactory.setHeatmapLayerStyle(mLayer, new RCTMLNStyle(getContext(), mReactStyle, mMap));
    }

    public void setSourceLayerID(String sourceLayerID) {
        mSourceLayerID = sourceLayerID;

        if (mLayer != null) {
            mLayer.setSourceLayer(sourceLayerID);
        }
    }
}
