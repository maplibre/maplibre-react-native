package org.maplibre.reactnative.components.sources

import android.content.Context
import android.graphics.PointF
import android.graphics.RectF
import com.facebook.react.bridge.ReadableMap
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.style.sources.Source
import org.maplibre.geojson.Feature
import org.maplibre.reactnative.events.MapPressEventWithFeatures

abstract class MLRNPressableSource<T : Source?>(
    context: Context?,
) : MLRNSource<T>(context) {
    var hasOnPress: Boolean = false

    var hitbox: RectF? = null
        get() {
            if (!hasOnPress) {
                return null
            }
            return field ?: DEFAULT_HITBOX
        }

    fun setReactHitbox(map: ReadableMap?) {
        hitbox =
            if (map != null) {
                RectF(
                    map.getDouble("left").toFloat(),
                    map.getDouble("top").toFloat(),
                    map.getDouble("right").toFloat(),
                    map.getDouble("bottom").toFloat(),
                )
            } else {
                null
            }
    }

    fun onPress(
        features: MutableList<Feature>,
        latLng: LatLng,
        screenPoint: PointF,
    ) {
        eventDispatcher?.dispatchEvent(
            MapPressEventWithFeatures(
                surfaceId,
                id,
                "onPress",
                latLng,
                screenPoint,
                features,
            ),
        )
    }

    companion object {
        const val LOG_TAG: String = "MLRNPressableSource"

        val DEFAULT_HITBOX: RectF = RectF(22.0f, 22.0f, 22.0f, 22.0f)
    }
}
