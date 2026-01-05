package org.maplibre.reactnative.components.annotations;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import org.maplibre.reactnative.components.camera.MLRNCameraManager

class MLRNCalloutManager : ViewGroupManager<MLRNCallout>() {
    companion object {
        const val REACT_CLASS: String = "MLRNCallout"
    }

    override fun getName(): String = REACT_CLASS

    protected override fun createViewInstance(reactContext: ThemedReactContext): MLRNCallout {
        return MLRNCallout(reactContext);
    }
}
