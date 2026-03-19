package org.maplibre.reactnative.location

import android.location.Location
import org.maplibre.android.geometry.LatLng

class UserLocation
    @JvmOverloads
    constructor(
        private var currentLocation: Location? = null,
    ) {
        private var previousLocation: Location? = null

        var trackingMode: Int = TrackUserLocationMode.NONE

        fun getCurrentLocation(): Location? = currentLocation

        val coordinate: LatLng?
            get() {
                if (currentLocation == null) {
                    return null
                }

                return LatLng(
                    currentLocation!!.getLatitude(),
                    currentLocation!!.getLongitude(),
                )
            }

        val bearing: Double
            get() {
                if (currentLocation == null) {
                    return 0.0
                }

                return currentLocation!!.getBearing().toDouble()
            }

        fun setCurrentLocation(currentLocation: Location?) {
            this.previousLocation = this.currentLocation
            this.currentLocation = currentLocation
        }
    }
