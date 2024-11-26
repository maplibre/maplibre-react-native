package org.maplibre.rctmln.events;

import android.graphics.PointF;
import androidx.annotation.NonNull;
import android.view.View;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import org.maplibre.android.plugins.markerview.MarkerView;
import org.maplibre.android.geometry.LatLng;
import org.maplibre.rctmln.components.annotation.RCTMLNPointAnnotation;
import org.maplibre.rctmln.events.constants.EventKeys;
import org.maplibre.rctmln.events.constants.EventTypes;
import org.maplibre.rctmln.utils.ConvertUtils;
import org.maplibre.rctmln.utils.GeoJSONUtils;

/**
 * Created by nickitaliano on 10/11/17.
 */

public class PointAnnotationClickEvent extends MapClickEvent {
    private RCTMLNPointAnnotation mView;
    private LatLng mTouchedLatLng;
    private PointF mScreenPoint;

    public PointAnnotationClickEvent(RCTMLNPointAnnotation view, @NonNull LatLng latLng, @NonNull PointF screenPoint, String eventType) {
        super(view, latLng, screenPoint, eventType);
        mView = view;
        mTouchedLatLng = latLng;
        mScreenPoint = screenPoint;
    }

    @Override
    public String getKey() {
        return getType().equals(EventTypes.ANNOTATION_SELECTED) ? EventKeys.POINT_ANNOTATION_SELECTED : EventKeys.POINT_ANNOTATION_DESELECTED;
    }

    @Override
    public WritableMap getPayload() {
        WritableMap properties = new WritableNativeMap();
        properties.putString("id", mView.getID());
        properties.putDouble("screenPointX", mScreenPoint.x);
        properties.putDouble("screenPointY", mScreenPoint.y);
        return GeoJSONUtils.toPointFeature(mTouchedLatLng, properties);
    }
}
