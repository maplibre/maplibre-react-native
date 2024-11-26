package org.maplibre.mlrn.events;

import android.graphics.PointF;
import androidx.annotation.NonNull;
import android.view.View;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import org.maplibre.android.plugins.markerview.MarkerView;
import org.maplibre.android.geometry.LatLng;
import org.maplibre.mlrn.components.annotation.MLRNPointAnnotation;
import org.maplibre.mlrn.events.constants.EventKeys;
import org.maplibre.mlrn.events.constants.EventTypes;
import org.maplibre.mlrn.utils.ConvertUtils;
import org.maplibre.mlrn.utils.GeoJSONUtils;

public class PointAnnotationDragEvent extends MapClickEvent {
    MLRNPointAnnotation mView;
    private LatLng mTouchedLatLng;
    private PointF mScreenPoint;

    public PointAnnotationDragEvent(MLRNPointAnnotation view, @NonNull LatLng latLng, @NonNull PointF screenPoint, String eventType) {
        super(view, latLng, screenPoint, eventType);
        mView = view;
        mTouchedLatLng = latLng;
        mScreenPoint = screenPoint;
    }

    @Override
    public String getKey() {
        String eventType = getType();

        if (eventType.equals(EventTypes.ANNOTATION_DRAG_START)) {
            return EventKeys.POINT_ANNOTATION_DRAG_START;
        }
        if (eventType.equals(EventTypes.ANNOTATION_DRAG_END)) {
            return EventKeys.POINT_ANNOTATION_DRAG_END;
        }

        return EventKeys.POINT_ANNOTATION_DRAG;
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
