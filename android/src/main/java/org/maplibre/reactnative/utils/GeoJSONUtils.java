package org.maplibre.reactnative.utils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.gson.JsonObject;

import org.maplibre.geojson.Feature;
import org.maplibre.geojson.FeatureCollection;
import org.maplibre.geojson.Geometry;
import org.maplibre.geojson.GeometryCollection;
import org.maplibre.geojson.MultiLineString;
import org.maplibre.geojson.LineString;
import org.maplibre.geojson.MultiPoint;
import org.maplibre.geojson.Point;
import org.maplibre.geojson.MultiPolygon;
import org.maplibre.geojson.Polygon;
import org.maplibre.android.geometry.LatLng;
import org.maplibre.android.geometry.LatLngBounds;
import org.maplibre.android.geometry.LatLngQuad;
import org.maplibre.android.log.Logger;
import org.maplibre.turf.TurfMeasurement;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class GeoJSONUtils {
    public static final String LOG_TAG = "GeoJSONUtils";

    public static WritableMap fromFeature(Feature feature) {
        WritableMap map = Arguments.createMap();
        map.putString("type", "Feature");
        map.putString("id", feature.id());

        Geometry geometry = feature.geometry();
        if (geometry == null) {
            map.putNull("geometry");
        } else {
            map.putMap("geometry", fromGeometry(geometry));
        }

        JsonObject properties = feature.properties();
        if(properties == null) {
            map.putNull("properties");
        } else {
            map.putMap("properties", ConvertUtils.toWritableMap(properties));
        }

        return map;
    }

    public static WritableMap fromGeometry(Geometry geometry) {
        final String type = geometry.type();

        return switch (type) {
            case "Point" -> fromPoint((Point) geometry);
            case "LineString" -> fromLineString((LineString) geometry);
            case "Polygon" -> fromPolygon((Polygon) geometry);
            case "MultiPoint" -> fromMultiPoint((MultiPoint) geometry);
            case "MultiLineString" -> fromMultiLineString((MultiLineString) geometry);
            case "MultiPolygon" -> fromMultiPolygon((MultiPolygon) geometry);
            case "GeometryCollection" -> fromGeometryCollection((GeometryCollection) geometry);
            default -> {
                Logger.w(LOG_TAG, "GeoJSONUtils.fromGeometry unsupported type: \"" + type + "\"");

                yield null;
            }
        };
    }

    public static WritableMap fromPoint(Point point) {
        WritableMap map = Arguments.createMap();
        map.putString("type", "Point");
        map.putArray("coordinates", getCoordinates(point));
        return map;
    }

    public static WritableMap fromLineString(LineString lineString) {
        WritableMap map = Arguments.createMap();
        map.putString("type", "LineString");
        map.putArray("coordinates", getCoordinates(lineString));
        return map;
    }

    public static WritableMap fromPolygon(Polygon polygon) {
        WritableMap map = Arguments.createMap();
        map.putString("type", "Polygon");
        map.putArray("coordinates", getCoordinates(polygon));
        return map;
    }

    public static WritableMap fromMultiPoint(MultiPoint multiPoint) {
        WritableMap map = Arguments.createMap();
        map.putString("type", "MultiPoint");
        map.putArray("coordinates", getCoordinates(multiPoint));
        return map;
    }

    public static WritableMap fromMultiLineString(MultiLineString multiLineString) {
        WritableMap map = Arguments.createMap();
        map.putString("type", "MultiLineString");
        map.putArray("coordinates", getCoordinates(multiLineString));
        return map;
    }

    public static WritableMap fromMultiPolygon(MultiPolygon multiPolygon) {
        WritableMap map = Arguments.createMap();
        map.putString("type", "MultiPolygon");
        map.putArray("coordinates", getCoordinates(multiPolygon));
        return map;
    }

    public static WritableMap fromGeometryCollection(GeometryCollection geometryCollection) {
        WritableMap map = Arguments.createMap();
        map.putString("type", "GeometryCollection");

        map.putArray("geometries",
                Arguments.fromList(
                        geometryCollection
                                .geometries()
                                .stream()
                                .map(GeoJSONUtils::fromGeometry)
                                .collect(Collectors.toList())
                )
        );

        return map;
    }

    public static WritableArray getCoordinates(Point point) {
        return Arguments.fromArray(pointToDoubleArray(point));
    }

    public static WritableArray getCoordinates(LineString lineString) {
        WritableArray array = Arguments.createArray();

        List<Point> points = lineString.coordinates();
        for (Point point : points) {
            array.pushArray(Arguments.fromArray(pointToDoubleArray(point)));
        }

        return array;
    }

    public static WritableArray getCoordinates(Polygon polygon) {
        WritableArray array = Arguments.createArray();

        List<List<Point>> points = polygon.coordinates();

        for (List<Point> curPoint : points) {
            WritableArray innerArray = Arguments.createArray();

            for (Point point : curPoint) {
                innerArray.pushArray(Arguments.fromArray(pointToDoubleArray(point)));
            }

            array.pushArray(innerArray);
        }

        return array;
    }

    public static WritableArray getCoordinates(MultiPoint multiPoint) {
        WritableArray array = Arguments.createArray();

        List<Point> points = multiPoint.coordinates();
        for (Point point : points) {
            array.pushArray(Arguments.fromArray(pointToDoubleArray(point)));
        }

        return array;
    }

    public static WritableArray getCoordinates(MultiLineString multiLineString) {
        WritableArray array = Arguments.createArray();

        List<List<Point>> lines = multiLineString.coordinates();
        for (List<Point> line : lines) {
            WritableArray lineArray = Arguments.createArray();

            for (Point point : line) {
                lineArray.pushArray(Arguments.fromArray(pointToDoubleArray(point)));
            }

            array.pushArray(lineArray);
        }

        return array;
    }

    public static WritableArray getCoordinates(MultiPolygon multiPolygon) {
        WritableArray array = Arguments.createArray();

        List<List<List<Point>>> polygons = multiPolygon.coordinates();
        for (List<List<Point>> polygon : polygons) {
            WritableArray polygonArray = Arguments.createArray();

            for (List<Point> ring : polygon) {
                WritableArray ringArray = Arguments.createArray();

                for (Point point : ring) {
                    ringArray.pushArray(Arguments.fromArray(pointToDoubleArray(point)));
                }

                polygonArray.pushArray(ringArray);
            }

            array.pushArray(polygonArray);
        }

        return array;
    }

    public static WritableMap toPointFeature(LatLng latLng, WritableMap properties) {
        WritableMap map = new WritableNativeMap();
        map.putString("type", "Feature");
        map.putMap("geometry", toPointGeometry(latLng));
        map.putMap("properties", properties);
        return map;
    }

    public static WritableMap toPointGeometry(LatLng latLng) {
        WritableMap geometry = new WritableNativeMap();
        geometry.putString("type", "Point");
        geometry.putArray("coordinates", fromLatLng(latLng));
        return geometry;
    }

    public static WritableArray fromLatLng(LatLng latLng) {
        double[] coords = new double[]{ latLng.getLongitude(), latLng.getLatitude() };
        WritableArray writableCoords = new WritableNativeArray();
        writableCoords.pushDouble(coords[0]);
        writableCoords.pushDouble(coords[1]);
        return writableCoords;
    }

    public static LatLng toLatLng(Point point) {
        if (point == null) {
            return null;
        }
        return new LatLng(point.latitude(), point.longitude());
    }

    public static LatLng toLatLng(ReadableArray coordinates) {
        if (coordinates == null || coordinates.size() < 2) {
            return null;
        }
        return new LatLng(coordinates.getDouble(1), coordinates.getDouble(0));
    }

    public static Point toPointGeometry(String featureJSONString) {
        Feature feature = Feature.fromJson(featureJSONString);
        if (feature == null) {
            return null;
        }
        return (Point)feature.geometry();
    }

    public static WritableArray fromLatLngBounds(LatLngBounds latLngBounds) {
        WritableArray array = Arguments.createArray();

        LatLng[] latLngs = latLngBounds.toLatLngs();
        for (LatLng latLng : latLngs) {
            array.pushArray(fromLatLng(latLng));
        }

        return array;
    }

    private static GeometryCollection toGeometryCollection(List<Feature> features) {
        ArrayList<Geometry> geometries = new ArrayList<>();
        geometries.ensureCapacity(features.size());
        for (Feature feature : features) {
            geometries.add(feature.geometry());
        }
        return GeometryCollection.fromGeometries(geometries);
    }

    public static LatLngBounds toLatLngBounds(FeatureCollection featureCollection) {
        List<Feature> features = featureCollection.features();

        double[] bbox = TurfMeasurement.bbox(toGeometryCollection(features));

        return LatLngBounds.from(bbox[3], bbox[2], bbox[1], bbox[0]);
    }

    public static LatLngQuad toLatLngQuad(ReadableArray array) {
        // [top left, top right, bottom right, bottom left]
        if (array == null || array.size() < 4) {
            return null;
        }
        return new LatLngQuad(
                toLatLng(array.getArray(0)),
                toLatLng(array.getArray(1)),
                toLatLng(array.getArray(2)),
                toLatLng(array.getArray(3))
        );
    }

    public static double[] pointToDoubleArray(Point point) {
        if (point == null) {
            return new double[] { 0.0, 0.0 };
        }
        return new double[] { point.longitude(), point.latitude() };
    }
}
