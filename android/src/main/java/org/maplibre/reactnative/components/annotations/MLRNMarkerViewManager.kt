package org.maplibre.reactnative.components.annotations

import android.view.View
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.MLRNMarkerViewManagerDelegate
import com.facebook.react.viewmanagers.MLRNMarkerViewManagerInterface

@ReactModule(name = MLRNMarkerViewManager.REACT_CLASS)
class MLRNMarkerViewManager(private val reactApplicationContext: ReactApplicationContext) :
    ViewGroupManager<MLRNMarkerView>(),
    MLRNMarkerViewManagerInterface<MLRNMarkerView> {

    private val delegate: MLRNMarkerViewManagerDelegate<MLRNMarkerView, MLRNMarkerViewManager> =
        MLRNMarkerViewManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<MLRNMarkerView> = delegate

    companion object {
        const val REACT_CLASS: String = "MLRNMarkerView"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): MLRNMarkerView {
        return MLRNMarkerView(reactContext)
    }

    override fun addView(parent: MLRNMarkerView, child: View, index: Int) {
        parent.addView(child, index)
    }

    override fun removeViewAt(parent: MLRNMarkerView, index: Int) {
        parent.removeViewAt(index)
    }

    override fun getChildCount(parent: MLRNMarkerView): Int {
        return parent.childCount
    }

    override fun getChildAt(parent: MLRNMarkerView, index: Int): View? {
        return parent.getChildAt(index)
    }

    @ReactProp(name = "lngLat")
    override fun setLngLat(markerView: MLRNMarkerView, lngLat: Dynamic) {
        if (lngLat.type == ReadableType.Array) {
            val arr = lngLat.asArray()
            if (arr != null && arr.size() >= 2) {
                markerView.setLngLat(doubleArrayOf(arr.getDouble(0), arr.getDouble(1)))
            }
        }
    }

    @ReactProp(name = "anchor")
    override fun setAnchor(markerView: MLRNMarkerView, map: ReadableMap?) {
        if (map != null) {
            markerView.setAnchor(map.getDouble("x").toFloat(), map.getDouble("y").toFloat())
        }
    }

    @ReactProp(name = "allowOverlap")
    override fun setAllowOverlap(markerView: MLRNMarkerView, allowOverlap: Boolean) {
        markerView.setAllowOverlap(allowOverlap)
    }

    @ReactProp(name = "isSelected")
    override fun setIsSelected(markerView: MLRNMarkerView, isSelected: Boolean) {
        markerView.setIsSelected(isSelected)
    }
}
