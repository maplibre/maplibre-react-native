package org.maplibre.reactnative.components.annotations.callout

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.MLRNCalloutManagerDelegate
import com.facebook.react.viewmanagers.MLRNCalloutManagerInterface

@ReactModule(name = MLRNCalloutManager.REACT_CLASS)
class MLRNCalloutManager :
    ViewGroupManager<MLRNCallout>(),
    MLRNCalloutManagerInterface<MLRNCallout> {
    private val delegate: MLRNCalloutManagerDelegate<MLRNCallout, MLRNCalloutManager> =
        MLRNCalloutManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<MLRNCallout> = delegate

    companion object {
        const val REACT_CLASS: String = "MLRNCallout"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): MLRNCallout = MLRNCallout(reactContext)
}
