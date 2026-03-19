package org.maplibre.reactnative.events.constants;

public class EventKeys {
    public static final String NAMESPACE = "rct.mapbox";

    // map events
    public static final String MAP_CLICK = ns("map.press");
    public static final String MAP_LONG_CLICK = ns("map.longpress");
    public static final String MAP_ANDROID_CALLBACK = ns("map.androidcallback");

    // point annotation events
    public static final String POINT_ANNOTATION_SELECTED = ns("pointannotation.selected");
    public static final String POINT_ANNOTATION_DESELECTED = ns("pointannotation.deselected");
    public static final String POINT_ANNOTATION_DRAG_START = ns("pointannotation.dragstart");
    public static final String POINT_ANNOTATION_DRAG = ns("pointannotation.drag");
    public static final String POINT_ANNOTATION_DRAG_END = ns("pointannotation.dragend");


    private static String ns(String name) {
        return String.format("%s.%s", NAMESPACE, name);
    }
}
