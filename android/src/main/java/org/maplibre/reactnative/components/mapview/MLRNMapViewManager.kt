package org.maplibre.reactnative.components.mapview

import android.util.Log
import android.view.View
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.MLRNMapViewManagerInterface
import org.maplibre.reactnative.components.AbstractEventEmitter
import org.maplibre.reactnative.events.constants.EventKeys

open class MLRNMapViewManager(context: ReactApplicationContext?) :
    AbstractEventEmitter<MLRNMapView?>(context), MLRNMapViewManagerInterface<MLRNMapView> {
    private val mViews: MutableMap<Int?, MLRNMapView?> = HashMap()

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createShadowNodeInstance(): LayoutShadowNode {
        return MapShadowNode(this)
    }

    override fun getShadowNodeClass(): Class<out LayoutShadowNode?> {
        return MapShadowNode::class.java
    }

    override fun onAfterUpdateTransaction(mapView: MLRNMapView) {
        super.onAfterUpdateTransaction(mapView)

        if (mapView.mapLibreMap == null) {
            mViews.put(mapView.id, mapView)
            mapView.init()
        }
    }

    override fun addView(mapView: MLRNMapView, childView: View, childPosition: Int) {
        mapView.addFeature(childView, childPosition)
    }

    override fun getChildCount(mapView: MLRNMapView): Int {
        return mapView.featureCount
    }

    override fun getChildAt(mapView: MLRNMapView, index: Int): View? {
        return mapView.getFeatureAt(index)
    }

    override fun removeViewAt(mapView: MLRNMapView, index: Int) {
        mapView.removeFeature(index)
    }

    override fun createViewInstance(themedReactContext: ThemedReactContext): MLRNMapView {
        return MLRNMapView(themedReactContext, this, null)
    }

    override fun onDropViewInstance(mapView: MLRNMapView) {
        val reactTag = mapView.id

        if (mViews.containsKey(reactTag)) {
            mViews.remove(reactTag)
        }

        super.onDropViewInstance(mapView)
    }

    fun getByReactTag(reactTag: Int): MLRNMapView? {
        return mViews[reactTag]
    }

    //region React Props
    @ReactProp(name = "mapStyle")
    override fun setMapStyle(mapView: MLRNMapView, value: String?) {
        mapView.setReactMapStyle(value)
    }

    @ReactProp(name = "preferredFramesPerSecond")
    override fun setPreferredFramesPerSecond(mapView: MLRNMapView, value: Int) {
        mapView.setReactPreferredFramesPerSecond(value)
    }

    @ReactProp(name = "localizeLabels")
    override fun setLocalizeLabels(mapView: MLRNMapView, value: Boolean) {
        mapView.setLocalizeLabels(value)
    }

    @ReactProp(name = "zoomEnabled")
    override fun setZoomEnabled(mapView: MLRNMapView, value: Boolean) {
        mapView.setReactZoomEnabled(value)
    }

    @ReactProp(name = "scrollEnabled")
    override fun setScrollEnabled(mapView: MLRNMapView, value: Boolean) {
        mapView.setReactScrollEnabled(value)
    }

    @ReactProp(name = "pitchEnabled")
    override fun setPitchEnabled(mapView: MLRNMapView, value: Boolean) {
        mapView.setReactPitchEnabled(value)
    }

    @ReactProp(name = "rotateEnabled")
    override fun setRotateEnabled(mapView: MLRNMapView, value: Boolean) {
        mapView.setReactRotateEnabled(value)
    }

    @ReactProp(name = "attribution")
    override fun setAttribution(mapView: MLRNMapView, value: Boolean) {
        mapView.setReactAttribution(value)
    }

    @ReactProp(name = "attributionPosition")
    override fun setAttributionPosition(mapView: MLRNMapView, value: ReadableMap?) {
        mapView.setReactAttributionPosition(value)
    }

    @ReactProp(name = "logo")
    override fun setLogo(mapView: MLRNMapView, value: Boolean) {
        mapView.setReactLogoEnabled(value)
    }

    @ReactProp(name = "logoPosition")
    override fun setLogoPosition(mapView: MLRNMapView, value: ReadableMap?) {
        mapView.setReactLogoPosition(value)
    }

    @ReactProp(name = "compass")
    override fun setCompass(mapView: MLRNMapView, value: Boolean) {
        mapView.setReactCompass(value)
    }

    @ReactProp(name = "compassPosition")
    override fun setCompassPosition(mapView: MLRNMapView, value: ReadableMap?) {
        mapView.setReactCompassPosition(value)
    }

    @ReactProp(name = "contentInset")
    override fun setContentInset(mapView: MLRNMapView, value: ReadableMap?) {
        mapView.setReactContentInset(value)
    }

    @ReactProp(name = "tintColor")
    override fun setTintColor(mapView: MLRNMapView, value: Int?) {
        mapView.tintColor = value
    }

    //endregion
    //region Custom Events
    override fun customEvents(): MutableMap<String?, String?>? {
        return MapBuilder.builder<String?, String?>()
            .put(EventKeys.MAP_CLICK, "onPress")
            .put(EventKeys.MAP_LONG_CLICK, "onLongPress")
            .put(EventKeys.MAP_ONCHANGE, "onMapChange")
            .put(EventKeys.MAP_ON_LOCATION_CHANGE, "onLocationChange")
            .put(EventKeys.MAP_USER_TRACKING_MODE_CHANGE, "onUserTrackingModeChange")
            .put(EventKeys.MAP_ANDROID_CALLBACK, "onAndroidCallback")
            .build()
    }

    //endregion

    private class MapShadowNode(private val mViewManager: MLRNMapViewManager) : LayoutShadowNode() {
        override fun dispose() {
            super.dispose()
            disposeNativeMapView()
        }

        /**
         * We need this mapview to dispose (calls into nativeMap.destroy) before ReactNative starts tearing down the views in
         * onDropViewInstance.
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
                            ex
                        )
                    }
                }
            }
        }
    }

    companion object {
        const val LOG_TAG: String = "MLRNMapViewManager"
        const val REACT_CLASS: String = "MLRNMapView"

        //endregion
    }
}

