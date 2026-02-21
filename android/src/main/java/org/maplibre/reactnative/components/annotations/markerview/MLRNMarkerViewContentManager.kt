package org.maplibre.reactnative.components.annotations.markerview

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.viewmanagers.MLRNMarkerViewContentManagerInterface

class MLRNMarkerViewContentManager(
    reactApplicationContext: ReactApplicationContext,
) : ViewGroupManager<MLRNMarkerViewContent>(),
    MLRNMarkerViewContentManagerInterface<MLRNMarkerView> {
    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(context: ThemedReactContext): MLRNMarkerViewContent = MLRNMarkerViewContent(context)

    companion object {
        const val REACT_CLASS = "MLRNMarkerViewContent"
    }
}
