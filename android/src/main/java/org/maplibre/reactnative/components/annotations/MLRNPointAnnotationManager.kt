package org.maplibre.reactnative.components.annotations;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import org.maplibre.reactnative.components.AbstractEventEmitter;
import org.maplibre.reactnative.events.constants.EventKeys;
import org.maplibre.reactnative.utils.GeoJSONUtils;

class MLRNPointAnnotationManager(reactApplicationContext: ReactApplicationContext) : AbstractEventEmitter<MLRNPointAnnotation>(reactApplicationContext) {
    companion object {
        const val REACT_CLASS: String = "MLRNPointAnnotation"
        const val METHOD_REFRESH: Int = 2;
    }

    override fun customEvents(): Map<String, String> {
        return mapOf(
            EventKeys.POINT_ANNOTATION_SELECTED to "onMapboxPointAnnotationSelected",
            EventKeys.POINT_ANNOTATION_DESELECTED to "onMapboxPointAnnotationDeselected",
            EventKeys.POINT_ANNOTATION_DRAG_START to "onMapboxPointAnnotationDragStart",
            EventKeys.POINT_ANNOTATION_DRAG to "onMapboxPointAnnotationDrag",
            EventKeys.POINT_ANNOTATION_DRAG_END to "onMapboxPointAnnotationDragEnd"
        )
    }

    override fun getCommandsMap(): Map<String?, Int?>? {
        return mapOf("refresh" to METHOD_REFRESH)
    }

    override fun getName(): String = REACT_CLASS

    protected override fun  createViewInstance(reactContext: ThemedReactContext): MLRNPointAnnotation {
        return MLRNPointAnnotation(reactContext, this)
    }

    @ReactProp(name="id")
     fun setId( annotation: MLRNPointAnnotation,  id: String) {
        annotation.setID(id);
    }

    @ReactProp(name="coordinate")
     fun setCoordinate(annotation: MLRNPointAnnotation, geoJSONStr: String) {
         val point = GeoJSONUtils.toPointGeometry(geoJSONStr)
         if (point != null) {
            annotation.setCoordinate(point);
         }
    }

    @ReactProp(name="anchor")
     fun setAnchor( annotation: MLRNPointAnnotation, map: ReadableMap) {
        annotation.setAnchor(map.getDouble("x").toFloat(), map.getDouble("y").toFloat());
    }

    @ReactProp(name="draggable")
     fun setDraggable(annotation: MLRNPointAnnotation, draggable: Boolean) {
        annotation.setDraggable(draggable);
    }

    override fun receiveCommand( annotation: MLRNPointAnnotation, commandID: Int, args: ReadableArray?) {
        when (commandID) {
            METHOD_REFRESH -> annotation.refresh()
        }
    }
}
