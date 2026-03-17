package org.maplibre.reactnative.utils

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.geometry.LatLngBounds
import org.maplibre.android.geometry.LatLngQuad
import org.maplibre.android.log.Logger
import org.maplibre.geojson.Feature
import org.maplibre.geojson.FeatureCollection
import org.maplibre.geojson.Geometry
import org.maplibre.geojson.GeometryCollection
import org.maplibre.geojson.LineString
import org.maplibre.geojson.MultiLineString
import org.maplibre.geojson.MultiPoint
import org.maplibre.geojson.MultiPolygon
import org.maplibre.geojson.Point
import org.maplibre.geojson.Polygon
import org.maplibre.turf.TurfMeasurement
import java.util.stream.Collectors

object GeoJSONUtils {
    const val LOG_TAG: String = "GeoJSONUtils"

    @JvmStatic
    fun fromFeature(feature: Feature): WritableMap {
        val map = Arguments.createMap()
        map.putString("type", "Feature")
        map.putString("id", feature.id())

        val geometry = feature.geometry()
        if (geometry == null) {
            map.putNull("geometry")
        } else {
            map.putMap("geometry", fromGeometry(geometry))
        }

        val properties = feature.properties()
        if (properties == null) {
            map.putNull("properties")
        } else {
            map.putMap("properties", ConvertUtils.toWritableMap(properties))
        }

        return map
    }

    fun fromFeatureCollection(featureCollection: FeatureCollection): WritableMap {
        val map = Arguments.createMap()
        map.putString("type", "FeatureCollection")

        map.putArray("features", fromFeatureList(featureCollection.features() ?: emptyList()))

        return map
    }

    fun fromFeatureList(featureList: List<Feature>): WritableArray {
        val featuresArray = Arguments.createArray()
        featureList.forEach { feature ->
            featuresArray.pushMap(fromFeature(feature))
        }

        return featuresArray
    }

    fun fromGeometry(geometry: Geometry): WritableMap? =
        when (val type = geometry.type()) {
            "Point" -> {
                fromPoint(geometry as Point)
            }

            "LineString" -> {
                fromLineString(geometry as LineString)
            }

            "Polygon" -> {
                fromPolygon(geometry as Polygon)
            }

            "MultiPoint" -> {
                fromMultiPoint(geometry as MultiPoint)
            }

            "MultiLineString" -> {
                fromMultiLineString(geometry as MultiLineString)
            }

            "MultiPolygon" -> {
                fromMultiPolygon(geometry as MultiPolygon)
            }

            "GeometryCollection" -> {
                fromGeometryCollection(geometry as GeometryCollection)
            }

            else -> {
                Logger.w(LOG_TAG, "GeoJSONUtils.fromGeometry unsupported type: \"$type\"")

                null
            }
        }

    fun fromPoint(point: Point?): WritableMap {
        val map = Arguments.createMap()
        map.putString("type", "Point")
        map.putArray("coordinates", getCoordinates(point))
        return map
    }

    fun fromLineString(lineString: LineString): WritableMap {
        val map = Arguments.createMap()
        map.putString("type", "LineString")
        map.putArray("coordinates", getCoordinates(lineString))
        return map
    }

    fun fromPolygon(polygon: Polygon): WritableMap {
        val map = Arguments.createMap()
        map.putString("type", "Polygon")
        map.putArray("coordinates", getCoordinates(polygon))
        return map
    }

    fun fromMultiPoint(multiPoint: MultiPoint): WritableMap {
        val map = Arguments.createMap()
        map.putString("type", "MultiPoint")
        map.putArray("coordinates", getCoordinates(multiPoint))
        return map
    }

    fun fromMultiLineString(multiLineString: MultiLineString): WritableMap {
        val map = Arguments.createMap()
        map.putString("type", "MultiLineString")
        map.putArray("coordinates", getCoordinates(multiLineString))
        return map
    }

    fun fromMultiPolygon(multiPolygon: MultiPolygon): WritableMap {
        val map = Arguments.createMap()
        map.putString("type", "MultiPolygon")
        map.putArray("coordinates", getCoordinates(multiPolygon))
        return map
    }

    fun fromGeometryCollection(geometryCollection: GeometryCollection): WritableMap {
        val map = Arguments.createMap()
        map.putString("type", "GeometryCollection")

        map.putArray(
            "geometries",
            Arguments.fromList(
                geometryCollection
                    .geometries()
                    .stream()
                    .map<WritableMap?> { obj: Geometry -> fromGeometry(obj) }
                    .collect(Collectors.toList()),
            ),
        )

        return map
    }

    fun getCoordinates(point: Point?): WritableArray = Arguments.fromArray(pointToDoubleArray(point))

    fun getCoordinates(lineString: LineString): WritableArray {
        val array = Arguments.createArray()

        val points = lineString.coordinates()
        for (point in points) {
            array.pushArray(Arguments.fromArray(pointToDoubleArray(point)))
        }

        return array
    }

    fun getCoordinates(polygon: Polygon): WritableArray {
        val array = Arguments.createArray()

        val points = polygon.coordinates()

        for (curPoint in points) {
            val innerArray = Arguments.createArray()

            for (point in curPoint) {
                innerArray.pushArray(Arguments.fromArray(pointToDoubleArray(point)))
            }

            array.pushArray(innerArray)
        }

        return array
    }

    fun getCoordinates(multiPoint: MultiPoint): WritableArray {
        val array = Arguments.createArray()

        val points = multiPoint.coordinates()
        for (point in points) {
            array.pushArray(Arguments.fromArray(pointToDoubleArray(point)))
        }

        return array
    }

    fun getCoordinates(multiLineString: MultiLineString): WritableArray {
        val array = Arguments.createArray()

        val lines = multiLineString.coordinates()
        for (line in lines) {
            val lineArray = Arguments.createArray()

            for (point in line) {
                lineArray.pushArray(Arguments.fromArray(pointToDoubleArray(point)))
            }

            array.pushArray(lineArray)
        }

        return array
    }

    fun getCoordinates(multiPolygon: MultiPolygon): WritableArray {
        val array = Arguments.createArray()

        val polygons = multiPolygon.coordinates()
        for (polygon in polygons) {
            val polygonArray = Arguments.createArray()

            for (ring in polygon) {
                val ringArray = Arguments.createArray()

                for (point in ring!!) {
                    ringArray.pushArray(Arguments.fromArray(pointToDoubleArray(point)))
                }

                polygonArray.pushArray(ringArray)
            }

            array.pushArray(polygonArray)
        }

        return array
    }

    @JvmStatic
    fun toPointFeature(
        latLng: LatLng,
        properties: WritableMap?,
    ): WritableMap {
        val map: WritableMap =
            Arguments.createMap().apply {
                putString("type", "Feature")
                putMap("geometry", toPointGeometry(latLng))
                putMap("properties", properties)
            }

        return map
    }

    fun toPointGeometry(latLng: LatLng): WritableMap {
        val geometry: WritableMap =
            Arguments.createMap().apply {
                putString("type", "Point")
                putArray("coordinates", fromLatLng(latLng))
            }

        return geometry
    }

    @JvmStatic
    fun fromLatLng(latLng: LatLng): WritableArray {
        val coordinates: WritableArray =
            Arguments.createArray().apply {
                pushDouble(latLng.longitude)
                pushDouble(latLng.latitude)
            }

        return coordinates
    }

    @JvmStatic
    fun toLatLng(point: Point?): LatLng? {
        if (point == null) {
            return null
        }
        return LatLng(point.latitude(), point.longitude())
    }

    fun toLatLng(coordinates: ReadableArray?): LatLng? {
        if (coordinates == null || coordinates.size() < 2) {
            return null
        }
        return LatLng(coordinates.getDouble(1), coordinates.getDouble(0))
    }

    @JvmStatic
    fun toPointGeometry(featureJSONString: String): Point? {
        val feature = Feature.fromJson(featureJSONString) ?: return null

        return feature.geometry() as Point?
    }

    @JvmStatic
    fun fromLatLngBounds(latLngBounds: LatLngBounds): WritableArray {
        val array = Arguments.createArray()
        array.pushDouble(latLngBounds.getLonWest())
        array.pushDouble(latLngBounds.getLatSouth())
        array.pushDouble(latLngBounds.getLonEast())
        array.pushDouble(latLngBounds.getLatNorth())

        return array
    }

    private fun toGeometryCollection(features: MutableList<Feature>): GeometryCollection {
        val geometries = ArrayList<Geometry?>()
        geometries.ensureCapacity(features.size)
        for (feature in features) {
            geometries.add(feature.geometry())
        }
        return GeometryCollection.fromGeometries(geometries)
    }

    @JvmStatic
    fun toLatLngBounds(featureCollection: FeatureCollection): LatLngBounds {
        val features = featureCollection.features()

        val bbox = TurfMeasurement.bbox(toGeometryCollection(features!!))

        return LatLngBounds.from(bbox[3], bbox[2], bbox[1], bbox[0])
    }

    @JvmStatic
    fun toLatLngBounds(array: ReadableArray?): LatLngBounds? {
        if (array != null && array.size() == 4) {
            return LatLngBounds.from(
                array.getDouble(3),
                array.getDouble(2),
                array.getDouble(1),
                array.getDouble(0),
            )
        }

        return null
    }

    @JvmStatic
    fun toLatLngQuad(array: ReadableArray?): LatLngQuad? {
        // [top left, top right, bottom right, bottom left]
        if (array == null || array.size() < 4) {
            return null
        }
        return LatLngQuad(
            toLatLng(array.getArray(0))!!,
            toLatLng(array.getArray(1))!!,
            toLatLng(array.getArray(2))!!,
            toLatLng(array.getArray(3))!!,
        )
    }

    fun pointToDoubleArray(point: Point?): DoubleArray {
        if (point == null) {
            return doubleArrayOf(0.0, 0.0)
        }
        return doubleArrayOf(point.longitude(), point.latitude())
    }
}
