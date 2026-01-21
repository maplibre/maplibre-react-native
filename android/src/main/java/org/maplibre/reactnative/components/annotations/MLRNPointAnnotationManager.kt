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
import com.facebook.react.viewmanagers.MLRNPointAnnotationManagerDelegate
import com.facebook.react.viewmanagers.MLRNPointAnnotationManagerInterface

@ReactModule(name = MLRNPointAnnotationManager.REACT_CLASS)
class MLRNPointAnnotationManager(private val reactApplicationContext: ReactApplicationContext) :
    ViewGroupManager<MLRNPointAnnotation>(),
    MLRNPointAnnotationManagerInterface<MLRNPointAnnotation> {

    private val delegate: MLRNPointAnnotationManagerDelegate<MLRNPointAnnotation, MLRNPointAnnotationManager> =
        MLRNPointAnnotationManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<MLRNPointAnnotation> = delegate

    companion object {
        const val REACT_CLASS: String = "MLRNPointAnnotation"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): MLRNPointAnnotation {
        return MLRNPointAnnotation(reactContext)
    }

    override fun addView(parent: MLRNPointAnnotation, child: View, index: Int) {
        parent.addView(child, index)
    }

    override fun removeViewAt(parent: MLRNPointAnnotation, index: Int) {
        parent.removeViewAt(index)
    }

    override fun getChildCount(parent: MLRNPointAnnotation): Int {
        return parent.childCount
    }

    override fun getChildAt(parent: MLRNPointAnnotation, index: Int): View? {
        return parent.getChildAt(index)
    }

    @ReactProp(name = "id")
    override fun setId(annotation: MLRNPointAnnotation, id: String?) {
        id?.let { annotation.setID(it) }
    }

    @ReactProp(name = "title")
    override fun setTitle(annotation: MLRNPointAnnotation, title: String?) {
        annotation.setTitle(title)
    }

    @ReactProp(name = "snippet")
    override fun setSnippet(annotation: MLRNPointAnnotation, snippet: String?) {
        annotation.setSnippet(snippet)
    }

    @ReactProp(name = "selected")
    override fun setSelected(annotation: MLRNPointAnnotation, selected: Boolean) {
        // Selection is handled by the map view
    }

    @ReactProp(name = "lngLat")
    override fun setLngLat(annotation: MLRNPointAnnotation, lngLat: Dynamic) {
        if (lngLat.type == ReadableType.Array) {
            val arr = lngLat.asArray()
            if (arr != null && arr.size() >= 2) {
                annotation.setLngLat(doubleArrayOf(arr.getDouble(0), arr.getDouble(1)))
            }
        }
    }

    @ReactProp(name = "anchor")
    override fun setAnchor(annotation: MLRNPointAnnotation, map: ReadableMap?) {
        if (map != null) {
            annotation.setAnchor(map.getDouble("x").toFloat(), map.getDouble("y").toFloat())
        }
    }

    @ReactProp(name = "draggable")
    override fun setDraggable(annotation: MLRNPointAnnotation, draggable: Boolean) {
        annotation.setDraggable(draggable)
    }

    override fun refresh(annotation: MLRNPointAnnotation) {
        annotation.refresh()
    }
}
