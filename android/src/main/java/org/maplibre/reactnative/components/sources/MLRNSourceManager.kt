package org.maplibre.reactnative.components.sources

import android.view.View
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

abstract class MLRNSourceManager<T : MLRNSource<*>>(
    context: ReactApplicationContext,
) : ViewGroupManager<T>(context) {
    abstract override fun createViewInstance(themedReactContext: ThemedReactContext): T

    override fun addView(
        parent: T,
        child: View,
        index: Int,
    ) {
        parent.addLayer(child, index)
    }

    override fun getChildCount(parent: T): Int = parent.layerCount

    override fun getChildAt(
        parent: T,
        index: Int,
    ): View? = parent.getLayerAt(index)

    override fun removeViewAt(
        parent: T,
        index: Int,
    ) {
        parent.removeLayer(index)
    }

    // TODO: Strings are nullable?
    @ReactProp(name = "id")
    fun setId(
        source: T?,
        id: String?,
    ) {
        if (id == null) {
            return
        }

        source!!.setID(id)
    }

    @ReactProp(name = "hitbox")
    fun setHitbox(
        view: T,
        value: ReadableMap?,
    ) {
        if (view is MLRNPressableSource<*>) {
            view.setReactHitbox(value)
        }
    }

    @ReactProp(name = "hasOnPress")
    fun setHasOnPress(
        view: T,
        value: Boolean,
    ) {
        if (view is MLRNPressableSource<*>) {
            view.hasOnPress = value
        }
    }
}
