package org.maplibre.reactnative.events

import android.location.Location
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import org.maplibre.reactnative.components.mapview.MLRNMapView
import org.maplibre.reactnative.events.constants.EventKeys
import org.maplibre.reactnative.events.constants.EventTypes
import java.util.UUID

class LocationEvent @JvmOverloads constructor(
    private val location: Location,
    private val mapView: MLRNMapView? = null
) : IEvent {
    val uUID: UUID = UUID.randomUUID()

    override fun getID(): Int {
        if (mapView != null) {
            return mapView.getId()
        }
        return -1
    }

    override fun getKey(): String {
        return EventKeys.USER_LOCATION_UPDATE
    }

    override fun getType(): String {
        return EventTypes.USER_LOCATION_UPDATED
    }

    override fun getTimestamp(): Long {
        return System.currentTimeMillis()
    }

    override fun equals(event: IEvent?): Boolean {
        val other = event as LocationEvent
        return this.uUID == other.uUID
    }

    fun equals(event: LocationEvent): Boolean {
        return this.uUID == event.uUID
    }

    override fun getPayload(): WritableMap {
        val positionProperties: WritableMap = WritableNativeMap()
        val coords: WritableMap = WritableNativeMap()

        coords.putDouble("longitude", location.getLongitude())
        coords.putDouble("latitude", location.getLatitude())
        coords.putDouble("altitude", location.getAltitude())
        coords.putDouble("accuracy", location.getAccuracy().toDouble())
        // A better solution will be to pull the heading from the compass engine, 
        // unfortunately the api is not publicly available in the mapbox sdk
        coords.putDouble("heading", location.getBearing().toDouble())
        coords.putDouble("course", location.getBearing().toDouble())
        coords.putDouble("speed", location.getSpeed().toDouble())

        positionProperties.putMap("coords", coords)
        positionProperties.putDouble("timestamp", location.getTime().toDouble())

        return positionProperties
    }

    override fun toJSON(): WritableMap {
        val map = Arguments.createMap()
        map.putString("type", getType())
        map.putMap("payload", getPayload())
        return map
    }

    override fun canCoalesce(): Boolean {
        return true
    }
}
