package org.maplibre.reactnative.components.mapview

import android.util.Log
import android.view.View
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.MLRNMapViewManagerDelegate
import com.facebook.react.viewmanagers.MLRNMapViewManagerInterface

@ReactModule(name = MLRNMapViewManager.REACT_CLASS)
open class MLRNMapViewManager(
    context: ReactApplicationContext,
) : ViewGroupManager<MLRNMapView>(context),
    MLRNMapViewManagerInterface<MLRNMapView> {
    private val delegate: MLRNMapViewManagerDelegate<MLRNMapView, MLRNMapViewManager> =
        MLRNMapViewManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<MLRNMapView> = delegate

    companion object {
        const val REACT_CLASS: String = "MLRNMapView"
        const val LOG_TAG: String = "MLRNMapViewManager"
    }

    override fun getName(): String = REACT_CLASS

    private val mViews: MutableMap<Int?, MLRNMapView?> = HashMap()

    override fun createShadowNodeInstance(): LayoutShadowNode = MapShadowNode(this)

    override fun getShadowNodeClass(): Class<out LayoutShadowNode?> = MapShadowNode::class.java

    override fun onAfterUpdateTransaction(mapView: MLRNMapView) {
        super.onAfterUpdateTransaction(mapView)

        if (mapView.mapLibreMap == null) {
            mViews.put(mapView.id, mapView)
            mapView.init()
        }
    }

    override fun addView(
        parent: MLRNMapView,
        child: View,
        index: Int,
    ) {
        parent.addFeature(child, index)
    }

    override fun getChildCount(parent: MLRNMapView): Int = parent.featureCount

    override fun getChildAt(
        parent: MLRNMapView,
        index: Int,
    ): View? = parent.getFeatureAt(index).toView()

    override fun removeViewAt(
        parent: MLRNMapView,
        index: Int,
    ) {
        parent.removeFeature(index)
    }

    override fun createViewInstance(themedReactContext: ThemedReactContext): MLRNMapView = MLRNMapView(themedReactContext, options = null)

    override fun onDropViewInstance(mapView: MLRNMapView) {
        val reactTag = mapView.id

        if (mViews.containsKey(reactTag)) {
            mViews.remove(reactTag)
        }

        super.onDropViewInstance(mapView)
    }

    fun getByReactTag(reactTag: Int): MLRNMapView? = mViews[reactTag]

    //region React Props

    @ReactProp(name = "mapStyle")
    override fun setMapStyle(
        mapView: MLRNMapView,
        value: String?,
    ) {
        mapView.setReactMapStyle(value)
    }

    @ReactProp(name = "light")
    override fun setLight(
        mapView: MLRNMapView,
        value: Dynamic?,
    ) {
        mapView.setReactLight(value?.asMap())
    }

    @ReactProp(name = "contentInset")
    override fun setContentInset(
        mapView: MLRNMapView,
        value: ReadableMap?,
    ) {
        mapView.setReactContentInset(value)
    }

    @ReactProp(name = "preferredFramesPerSecond")
    override fun setPreferredFramesPerSecond(
        mapView: MLRNMapView,
        value: Int,
    ) {
        mapView.setReactPreferredFramesPerSecond(value)
    }

    @ReactProp(name = "dragPan")
    override fun setDragPan(
        mapView: MLRNMapView,
        value: Boolean,
    ) {
        mapView.setReactScrollEnabled(value)
    }

    @ReactProp(name = "touchAndDoubleTapZoom")
    override fun setTouchAndDoubleTapZoom(
        mapView: MLRNMapView,
        value: Boolean,
    ) {
        mapView.setReactZoomEnabled(value)
    }

    @ReactProp(name = "touchRotate")
    override fun setTouchRotate(
        mapView: MLRNMapView,
        value: Boolean,
    ) {
        mapView.setReactRotateEnabled(value)
    }

    @ReactProp(name = "touchPitch")
    override fun setTouchPitch(
        mapView: MLRNMapView,
        value: Boolean,
    ) {
        mapView.setReactPitchEnabled(value)
    }

    @ReactProp(name = "tintColor")
    override fun setTintColor(
        mapView: MLRNMapView,
        value: Int?,
    ) {
        mapView.setReactTintColor(value)
    }

    @ReactProp(name = "attribution")
    override fun setAttribution(
        mapView: MLRNMapView,
        value: Boolean,
    ) {
        mapView.setReactAttribution(value)
    }

    @ReactProp(name = "attributionPosition")
    override fun setAttributionPosition(
        mapView: MLRNMapView,
        value: ReadableMap?,
    ) {
        mapView.setReactAttributionPosition(value)
    }

    @ReactProp(name = "logo")
    override fun setLogo(
        mapView: MLRNMapView,
        value: Boolean,
    ) {
        mapView.setReactLogo(value)
    }

    @ReactProp(name = "logoPosition")
    override fun setLogoPosition(
        mapView: MLRNMapView,
        value: ReadableMap?,
    ) {
        mapView.setReactLogoPosition(value)
    }

    @ReactProp(name = "compass")
    override fun setCompass(
        mapView: MLRNMapView,
        value: Boolean,
    ) {
        mapView.setReactCompass(value)
    }

    @ReactProp(name = "compassPosition")
    override fun setCompassPosition(
        mapView: MLRNMapView,
        value: ReadableMap?,
    ) {
        mapView.setReactCompassPosition(value)
    }

    @ReactProp(name = "compassHiddenFacingNorth")
    override fun setCompassHiddenFacingNorth(
        mapView: MLRNMapView,
        value: Boolean,
    ) {
        mapView.setReactCompassHiddenFacingNorth(value)
    }

    //endregion

    private class MapShadowNode(
        private val mViewManager: MLRNMapViewManager,
    ) : LayoutShadowNode() {
        override fun dispose() {
            super.dispose()
            disposeNativeMapView()
        }

        /**
         * We need this mapview to dispose (calls into nativeMap.destroy) before ReactNative starts
         * tearing down the views in onDropViewInstance.
         */
        fun disposeNativeMapView() {
            val mapView = mViewManager.getByReactTag(reactTag)

            if (mapView != null) {
                UiThreadUtil.runOnUiThread {
                    try {
                        mapView.dispose()
                    } catch (ex: Exception) {
                        Log.e(
                            LOG_TAG,
                            " disposeNativeMapView() exception destroying map view",
                            ex,
                        )
                    }
                }
            }
        }
    }
}
