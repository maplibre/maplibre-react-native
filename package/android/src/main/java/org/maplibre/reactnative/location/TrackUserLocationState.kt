package org.maplibre.reactnative.location

object TrackUserLocationState {
    // The map view not yet tracked the user location
    const val POSSIBLE: Int = 0

    // The map view has begun to move to the first user location
    const val BEGAN: Int = 1

    // The map views begins a significant transition
    const val SIGNIFICANT_TRANSITION: Int = 2

    // The map view has finished moving to the user location
    const val CHANGED: Int = 3
}
