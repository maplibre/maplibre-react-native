package org.maplibre.reactnative.modules

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import org.maplibre.android.MapLibre
import org.maplibre.reactnative.NativeNetworkModuleSpec

@ReactModule(name = MLRNNetworkModule.NAME)
class MLRNNetworkModule(
    reactContext: ReactApplicationContext,
) : NativeNetworkModuleSpec(reactContext) {
    companion object {
        const val NAME = "MLRNNetworkModule"
    }

    override fun getName() = NAME

    private val context: ReactApplicationContext = reactContext

    override fun setConnected(connected: Boolean) {
        context.runOnUiQueueThread {
            MapLibre.setConnected(connected)
        }
    }
}
