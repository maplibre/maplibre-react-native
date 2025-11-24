package org.maplibre.reactnative.events.constants;

public class EventTypes {
    // map event types
    public static final String MAP_CLICK = "press";
    public static final String MAP_LONG_CLICK = "longpress";

    // point annotation event types
    public static final String ANNOTATION_SELECTED = "annotationselected";
    public static final String ANNOTATION_DESELECTED = "annotationdeselected";
    public static final String ANNOTATION_DRAG_START = "annotationdragstart";
    public static final String ANNOTATION_DRAG = "annotationdrag";
    public static final String ANNOTATION_DRAG_END = "annotationdragend";

    // offline event types
    public static final String OFFLINE_ERROR = "offlineerror";
    public static final String OFFLINE_TILE_LIMIT = "offlinetilelimit";
    public static final String OFFLINE_STATUS = "offlinestatus";

    // shape source event types
    public static final String SHAPE_SOURCE_LAYER_CLICK = "shapesourcelayerpress";
    public static final String VECTOR_SOURCE_LAYER_CLICK = "vectorsourcelayerpress";
    public static final String RASTER_SOURCE_LAYER_CLICK = "rastersourcelayerpress";

    // image missing event type
    public static final String IMAGES_MISSING = "imagesmissing";
}
