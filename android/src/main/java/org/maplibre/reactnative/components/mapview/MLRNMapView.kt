package org.maplibre.reactnative.components.mapview

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.PointF
import android.graphics.RectF
import android.location.Location
import android.os.Handler
import android.util.Pair
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import org.json.JSONException
import org.json.JSONObject
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.camera.CameraUpdate
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.geometry.VisibleRegion
import org.maplibre.android.gestures.MoveGestureDetector
import org.maplibre.android.log.Logger
import org.maplibre.android.maps.AttributionDialogManager
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.MapLibreMap.CancelableCallback
import org.maplibre.android.maps.MapLibreMap.OnMapClickListener
import org.maplibre.android.maps.MapLibreMap.OnMapLongClickListener
import org.maplibre.android.maps.MapLibreMap.OnMoveListener
import org.maplibre.android.maps.MapLibreMapOptions
import org.maplibre.android.maps.MapView
import org.maplibre.android.maps.MapView.OnCameraDidChangeListener
import org.maplibre.android.maps.MapView.OnCameraIsChangingListener
import org.maplibre.android.maps.MapView.OnDidFailLoadingMapListener
import org.maplibre.android.maps.MapView.OnDidFinishLoadingMapListener
import org.maplibre.android.maps.MapView.OnDidFinishLoadingStyleListener
import org.maplibre.android.maps.MapView.OnDidFinishRenderingFrameListener
import org.maplibre.android.maps.MapView.OnDidFinishRenderingMapListener
import org.maplibre.android.maps.MapView.OnStyleImageMissingListener
import org.maplibre.android.maps.MapView.OnWillStartRenderingFrameListener
import org.maplibre.android.maps.MapView.OnWillStartRenderingMapListener
import org.maplibre.android.maps.OnMapReadyCallback
import org.maplibre.android.maps.Style
import org.maplibre.android.maps.Style.OnStyleLoaded
import org.maplibre.android.plugins.annotation.OnSymbolClickListener
import org.maplibre.android.plugins.annotation.OnSymbolDragListener
import org.maplibre.android.plugins.annotation.Symbol
import org.maplibre.android.plugins.annotation.SymbolManager
import org.maplibre.android.plugins.localization.LocalizationPlugin
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.layers.Layer
import org.maplibre.android.style.layers.Property
import org.maplibre.android.style.layers.PropertyFactory
import org.maplibre.geojson.Feature
import org.maplibre.geojson.FeatureCollection
import org.maplibre.reactnative.R
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.annotation.MLRNMarkerView
import org.maplibre.reactnative.components.annotation.MLRNPointAnnotation
import org.maplibre.reactnative.components.annotation.MarkerViewManager
import org.maplibre.reactnative.components.camera.MLRNCamera
import org.maplibre.reactnative.components.images.MLRNImages
import org.maplibre.reactnative.components.location.LocationComponentManager
import org.maplibre.reactnative.components.location.MLRNNativeUserLocation
import org.maplibre.reactnative.components.mapview.helpers.CameraChangeTracker
import org.maplibre.reactnative.components.styles.layers.MLRNLayer
import org.maplibre.reactnative.components.styles.light.MLRNLight
import org.maplibre.reactnative.components.styles.sources.MLRNShapeSource
import org.maplibre.reactnative.components.styles.sources.MLRNSource
import org.maplibre.reactnative.components.styles.sources.MLRNSource.OnPressEvent
import org.maplibre.reactnative.events.AndroidCallbackEvent
import org.maplibre.reactnative.events.IEvent
import org.maplibre.reactnative.events.MapChangeEvent
import org.maplibre.reactnative.events.MapClickEvent
import org.maplibre.reactnative.events.constants.EventTypes
import org.maplibre.reactnative.modules.MLRNModule
import org.maplibre.reactnative.utils.BitmapUtils
import org.maplibre.reactnative.utils.GeoJSONUtils
import org.maplibre.reactnative.utils.GeoViewport
import java.util.Locale
import kotlin.math.roundToInt

open class MLRNMapView(
    private val mContext: Context,
    manager: MLRNMapViewManager,
    options: MapLibreMapOptions?
) : MapView(
    mContext, options
), OnMapReadyCallback, OnMapClickListener, OnMapLongClickListener, OnCameraIsChangingListener,
    OnCameraDidChangeListener, OnDidFailLoadingMapListener, OnDidFinishLoadingMapListener,
    OnWillStartRenderingFrameListener, OnWillStartRenderingMapListener,
    OnDidFinishRenderingFrameListener, OnDidFinishRenderingMapListener,
    OnDidFinishLoadingStyleListener, OnStyleImageMissingListener {
    private val mManager: MLRNMapViewManager
    private val mHandler: Handler
    private var mLifeCycleListener: LifecycleEventListener? = null
    private var mPaused = false
    private var mDestroyed = false

    private var mCamera: MLRNCamera? = null
    private val mFeatures: MutableList<AbstractMapFeature>
    private var mQueuedFeatures: MutableList<AbstractMapFeature>?
    private val mPointAnnotations: MutableMap<String?, MLRNPointAnnotation?>
    private val mSources: MutableMap<String?, MLRNSource<*>?>
    private val mImages: MutableList<MLRNImages>

    private val mCameraChangeTracker = CameraChangeTracker()
    private val mPreRenderMethods: MutableList<Pair<Int?, ReadableArray?>> =
        ArrayList<Pair<Int?, ReadableArray?>>()

    var mapboxMap: MapLibreMap? = null
        private set

    private var mLocalizationPlugin: LocalizationPlugin? = null

    private var mMapStyle: String

    private var mPreferredFramesPerSecond: Int? = null
    private var mLocalizeLabels = false
    private var mScrollEnabled: Boolean? = null
    private var mPitchEnabled: Boolean? = null
    private var mRotateEnabled: Boolean? = null
    private var mAttributionEnabled: Boolean? = null
    private var mAttributionGravity: Int? = null
    private var mAttributionMargin: IntArray? = null
    private var mLogoEnabled: Boolean? = null
    private var mLogoGravity: Int? = null
    private var mLogoMargins: IntArray? = null
    private var mCompassEnabled: Boolean? = null
    private var mCompassViewMargins: ReadableMap? = null
    private var mCompassViewPosition = -1
    private var mZoomEnabled: Boolean? = null

    private var symbolManager: SymbolManager? = null

    private var mActiveMarkerID: Long = -1

    private var mInsets: ReadableArray? = null

    private var mHandledMapChangedEvents: HashSet<String?>? = null

    private var markerViewManager: MarkerViewManager? = null
    private var mOffscreenAnnotationViewContainer: ViewGroup? = null

    private var mAnnotationClicked = false

    private var mLocationComponentManager: LocationComponentManager? = null

    private var mTintColor: Int? = null

    override fun onResume() {
        super.onResume()
        mPaused = false
    }

    override fun onPause() {
        super.onPause()
        mPaused = true
    }

    override fun onDestroy() {
        super.onDestroy()
        mDestroyed = true
    }

    fun enqueuePreRenderMapMethod(methodID: Int?, args: ReadableArray?) {
        mPreRenderMethods.add(Pair<Int?, ReadableArray?>(methodID, args))
    }

    fun addFeature(childView: View?, childPosition: Int) {
        var feature: AbstractMapFeature? = null

        when (childView) {
            is MLRNSource<*> -> {
                mSources.put(childView.getID(), childView)
                feature = childView as AbstractMapFeature
            }

            is MLRNImages -> {
                mImages.add(childView)
                feature = childView as AbstractMapFeature
            }

            is MLRNLight -> {
                feature = childView as AbstractMapFeature
            }

            is MLRNNativeUserLocation -> {
                feature = childView as AbstractMapFeature
            }

            is MLRNPointAnnotation -> {
                mPointAnnotations.put(childView.getID(), childView)
                feature = childView as AbstractMapFeature
            }

            is MLRNMarkerView -> {
                feature = childView as AbstractMapFeature
            }

            is MLRNCamera -> {
                mCamera = childView
                feature = childView as AbstractMapFeature
            }

            is MLRNLayer<*> -> {
                feature = childView
            }

            is ViewGroup -> {
                for (i in 0..<childView.childCount) {
                    addFeature(childView.getChildAt(i), childPosition)
                }
            }
        }

        if (feature != null) {
            if (mQueuedFeatures == null) {
                feature.addToMap(this)
                mFeatures.add(childPosition, feature)
            } else {
                mQueuedFeatures!!.add(childPosition, feature)
            }
        }
    }

    fun removeFeature(childPosition: Int) {
        val feature = features()!![childPosition]

        when (feature) {
            is MLRNSource<*> -> {
                mSources.remove(feature.getID())
            }

            is MLRNPointAnnotation -> {
                if (feature.mapboxID == mActiveMarkerID) {
                    mActiveMarkerID = -1
                }

                mPointAnnotations.remove(feature.getID())
            }

            is MLRNImages -> {
                mImages.remove(feature)
            }
        }

        feature.removeFromMap(this)
        features()!!.remove(feature)
    }

    private fun features(): MutableList<AbstractMapFeature>? {
        return if (mQueuedFeatures != null && !mQueuedFeatures!!.isEmpty()) {
            mQueuedFeatures
        } else {
            mFeatures
        }
    }

    val featureCount: Int
        get() = features()!!.size

    fun getFeatureAt(i: Int): AbstractMapFeature? {
        return features()!![i]
    }

    @Synchronized
    fun dispose() {
        if (mDestroyed) {
            return
        }

        if (!layerWaiters.isEmpty()) {
            layerWaiters.clear()
        }

        val reactContext = mContext as ReactContext
        reactContext.removeLifecycleEventListener(mLifeCycleListener)

        if (!mPaused) {
            onPause()
        }

        onStop()
        onDestroy()
    }

    fun getVisibleRegion(center: LatLng?, zoomLevel: Double): VisibleRegion {
        val metrics = mContext.resources.displayMetrics
        val contentPadding = mapboxMap!!.padding

        val mapWidth = ((mapboxMap!!.width * 0.75 - (contentPadding[0] + contentPadding[2]))
                / metrics.scaledDensity).toInt()
        val mapHeight = ((mapboxMap!!.height * 0.75 - (contentPadding[1] + contentPadding[3]))
                / metrics.scaledDensity).toInt()
        val region = GeoViewport.getRegion(center, zoomLevel.toInt(), mapWidth, mapHeight)
        return region
    }

    val cameraPosition: CameraPosition
        get() = mapboxMap!!.cameraPosition

    fun animateCamera(cameraUpdate: CameraUpdate, callback: CancelableCallback?) {
        mapboxMap!!.animateCamera(cameraUpdate, callback)
    }

    fun moveCamera(cameraUpdate: CameraUpdate, callback: CancelableCallback?) {
        mapboxMap!!.moveCamera(cameraUpdate, callback)
    }

    fun moveCamera(cameraUpdate: CameraUpdate) {
        mapboxMap!!.moveCamera(cameraUpdate)
    }

    fun easeCamera(
        cameraUpdate: CameraUpdate, duration: Int, easingInterpolator: Boolean,
        callback: CancelableCallback?
    ) {
        mapboxMap!!.easeCamera(cameraUpdate, duration, easingInterpolator, callback)
    }

    fun easeCamera(cameraUpdate: CameraUpdate) {
        mapboxMap!!.easeCamera(cameraUpdate)
    }

    fun getPointAnnotationByID(annotationID: String?): MLRNPointAnnotation? {
        if (annotationID == null) {
            return null
        }

        for (key in mPointAnnotations.keys) {
            val annotation = mPointAnnotations.get(key)

            if (annotation != null && annotationID == annotation.getID()) {
                return annotation
            }
        }

        return null
    }

    fun getPointAnnotationByMarkerID(markerID: Long): MLRNPointAnnotation? {
        for (key in mPointAnnotations.keys) {
            val annotation = mPointAnnotations[key]

            if (annotation != null && markerID == annotation.mapboxID) {
                return annotation
            }
        }

        return null
    }

    fun getSymbolManager(): SymbolManager {
        return symbolManager!!
    }

    interface FoundLayerCallback {
        fun found(layer: Layer?)
    }

    private val layerWaiters: MutableMap<String?, MutableList<FoundLayerCallback>> =
        HashMap<String?, MutableList<FoundLayerCallback>>()

    init {
        onCreate(null)
        onStart()
        onResume()
        getMapAsync(this)

        mManager = manager

        mSources = HashMap()
        mImages = ArrayList()
        mPointAnnotations = HashMap()
        mQueuedFeatures = ArrayList()
        mFeatures = ArrayList()

        mHandler = Handler()

        mMapStyle = MLRNModule.DEFAULT_STYLE_URL

        setLifecycleListeners()

        addOnCameraIsChangingListener(this)
        addOnCameraDidChangeListener(this)
        addOnDidFailLoadingMapListener(this)
        addOnDidFinishLoadingMapListener(this)
        addOnStyleImageMissingListener(this)

        addOnWillStartRenderingFrameListener(this)
        addOnDidFinishRenderingFrameListener(this)
        addOnWillStartRenderingMapListener(this)
        addOnDidFinishRenderingMapListener(this)
        addOnDidFinishLoadingStyleListener(this)
    }

    fun layerAdded(layer: Layer) {
        val layerId = layer.getId()

        val callbacks = layerWaiters[layerId]
        if (callbacks != null) {
            for (callback in callbacks) {
                callback.found(layer)
            }
        }
        layerWaiters.remove(layerId)
    }

    fun waitForLayer(layerID: String, callback: FoundLayerCallback) {
        val layer = mapboxMap!!.style!!.getLayer(layerID)
        if (layer != null) {
            callback.found(layer)
        } else {
            val waiters =
                layerWaiters.computeIfAbsent(layerID) { k: String? -> ArrayList<FoundLayerCallback?>() as MutableList<FoundLayerCallback> }
            waiters.add(callback)
        }
    }

    fun isJSONValid(test: String): Boolean {
        try {
            JSONObject(test)
        } catch (ex: JSONException) {
            return false
        }
        return true
    }

    override fun onMapReady(mapboxMap: MapLibreMap) {
        this.mapboxMap = mapboxMap

        if (isJSONValid(mMapStyle)) {
            mapboxMap.setStyle(Style.Builder().fromJson(mMapStyle))
        } else {
            mapboxMap.setStyle(Style.Builder().fromUri(mMapStyle))
        }

        reflow()

        mapboxMap.getStyle { style ->
            createSymbolManager(style)
            setUpImage(style)
            addQueuedFeatures()
            setupLocalization(style)
        }

        updatePreferredFramesPerSecond()
        updateInsets()
        updateUISettings()

        mapboxMap.addOnCameraIdleListener { sendRegionDidChangeEvent() }

        mapboxMap.addOnCameraMoveStartedListener { reason ->
            mCameraChangeTracker.setReason(reason)
            handleMapChangedEvent(EventTypes.REGION_WILL_CHANGE)
        }

        mapboxMap.addOnCameraMoveListener {
            if (markerViewManager != null) {
                markerViewManager!!.updateMarkers()
            }
        }

        mapboxMap.addOnMoveListener(object : OnMoveListener {
            override fun onMoveBegin(detector: MoveGestureDetector) {
                mCameraChangeTracker.setReason(CameraChangeTracker.USER_GESTURE)
                handleMapChangedEvent(EventTypes.REGION_WILL_CHANGE)
            }

            override fun onMove(detector: MoveGestureDetector) {
                mCameraChangeTracker.setReason(CameraChangeTracker.USER_GESTURE)
                handleMapChangedEvent(EventTypes.REGION_IS_CHANGING)
            }

            override fun onMoveEnd(detector: MoveGestureDetector) {
            }
        })
    }

    fun reflow() {
        mHandler.post {
            measure(
                MeasureSpec.makeMeasureSpec(measuredWidth, MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(measuredHeight, MeasureSpec.EXACTLY)
            )
            layout(left, top, right, bottom)
        }
    }

    fun createSymbolManager(style: Style) {
        symbolManager = SymbolManager(this, this.mapboxMap!!, style)
        symbolManager!!.setIconAllowOverlap(true)
        symbolManager!!.addClickListener(object : OnSymbolClickListener {
            override fun onAnnotationClick(symbol: Symbol): Boolean {
                onMarkerClick(symbol)
                return true
            }
        })
        symbolManager!!.addDragListener(object : OnSymbolDragListener {
            override fun onAnnotationDragStarted(symbol: Symbol) {
                mAnnotationClicked = true
                val selectedMarkerID = symbol.id
                val annotation = getPointAnnotationByMarkerID(selectedMarkerID)
                annotation?.onDragStart()
            }

            override fun onAnnotationDrag(symbol: Symbol) {
                val selectedMarkerID = symbol.id
                val annotation = getPointAnnotationByMarkerID(selectedMarkerID)
                annotation?.onDrag()
            }

            override fun onAnnotationDragFinished(symbol: Symbol) {
                mAnnotationClicked = false
                val selectedMarkerID = symbol.id
                val annotation = getPointAnnotationByMarkerID(selectedMarkerID)
                annotation?.onDragEnd()
            }
        })
        mapboxMap!!.addOnMapClickListener(this)
        mapboxMap!!.addOnMapLongClickListener(this)
    }

    fun addQueuedFeatures() {
        if (mQueuedFeatures != null && !mQueuedFeatures!!.isEmpty()) {
            for (i in mQueuedFeatures!!.indices) {
                val feature = mQueuedFeatures!![i]
                feature.addToMap(this)
                mFeatures.add(feature)
            }
            mQueuedFeatures = null
        }
    }

    private fun setupLocalization(style: Style) {
        mLocalizationPlugin = LocalizationPlugin(this@MLRNMapView, this.mapboxMap!!, style)
        if (mLocalizeLabels) {
            try {
                mLocalizationPlugin!!.matchMapLanguageWithDeviceDefault()
            } catch (_: Exception) {
                val localeString = Locale.getDefault().toString()
                Logger.w(
                    LOG_TAG,
                    String.format("Could not find matching locale for %s", localeString)
                )
            }
        }
    }

    override fun onTouchEvent(ev: MotionEvent?): Boolean {
        val result = super.onTouchEvent(ev)

        if (result && mScrollEnabled!!) {
            requestDisallowInterceptTouchEvent(true)
        }

        return result
    }

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        if (!mPaused) {
            if (markerViewManager != null) {
                markerViewManager!!.removeViews()
            }
            super.onLayout(changed, left, top, right, bottom)
            if (markerViewManager != null) {
                markerViewManager!!.restoreViews()
            }
        }
    }

    override fun onMapClick(point: LatLng): Boolean {
        if (mAnnotationClicked) {
            mAnnotationClicked = false
            return true
        }

        val screenPoint = mapboxMap!!.projection.toScreenLocation(point)
        val touchableSources =
            this.allTouchableSources

        val hits: MutableMap<String?, MutableList<Feature?>?> =
            HashMap<String?, MutableList<Feature?>?>()
        val hitTouchableSources: MutableList<MLRNSource<*>> = ArrayList<MLRNSource<*>>()
        for (touchableSource in touchableSources) {
            val hitbox = touchableSource.getTouchHitbox()
            if (hitbox == null) {
                continue
            }

            val halfWidth = hitbox.get("width")!!.toFloat() / 2.0f
            val halfHeight = hitbox.get("height")!!.toFloat() / 2.0f

            val hitboxF = RectF()
            hitboxF.set(
                screenPoint.x - halfWidth, screenPoint.y - halfHeight, screenPoint.x + halfWidth,
                screenPoint.y + halfHeight
            )

            val features =
                mapboxMap!!.queryRenderedFeatures(hitboxF, *touchableSource.getLayerIDs())
            if (features.isNotEmpty()) {
                hits.put(touchableSource.getID(), features)
                hitTouchableSources.add(touchableSource)
            }
        }

        if (hits.isNotEmpty()) {
            val source = getTouchableSourceWithHighestZIndex(hitTouchableSources)
            if (source != null && source.hasPressListener()) {
                source.onPress(
                    OnPressEvent(
                        hits[source.getID()]!!,
                        point,
                        screenPoint
                    )
                )
                return true
            }
        }

        val event = MapClickEvent(this, point, screenPoint)
        mManager.handleEvent(event)
        return false
    }

    override fun onMapLongClick(point: LatLng): Boolean {
        if (mAnnotationClicked) {
            mAnnotationClicked = false
            return true
        }
        val screenPoint = mapboxMap!!.projection.toScreenLocation(point)
        val event = MapClickEvent(this, point, screenPoint, EventTypes.MAP_LONG_CLICK)
        mManager.handleEvent(event)
        return false
    }

    fun onMarkerClick(symbol: Symbol) {
        mAnnotationClicked = true
        val selectedMarkerID = symbol.id

        var activeAnnotation: MLRNPointAnnotation? = null
        var nextActiveAnnotation: MLRNPointAnnotation? = null

        for (key in mPointAnnotations.keys) {
            val annotation = mPointAnnotations[key]
            val curMarkerID = annotation!!.mapboxID
            if (mActiveMarkerID == curMarkerID) {
                activeAnnotation = annotation
            }
            if (selectedMarkerID == curMarkerID && mActiveMarkerID != curMarkerID) {
                nextActiveAnnotation = annotation
            }
        }

        if (activeAnnotation != null) {
            deselectAnnotation(activeAnnotation)
        }

        if (nextActiveAnnotation != null) {
            selectAnnotation(nextActiveAnnotation)
        }
    }

    fun selectAnnotation(annotation: MLRNPointAnnotation) {
        mActiveMarkerID = annotation.mapboxID
        annotation.onSelect(true)
    }

    fun deselectAnnotation(annotation: MLRNPointAnnotation) {
        mActiveMarkerID = -1
        annotation.onDeselect()
    }

    override fun onCameraDidChange(animated: Boolean) {
        mCameraChangeTracker.setIsAnimating(animated)
    }

    override fun onCameraIsChanging() {
        handleMapChangedEvent(EventTypes.REGION_IS_CHANGING)
    }

    override fun onDidFailLoadingMap(errorMessage: String?) {
        handleMapChangedEvent(EventTypes.DID_FAIL_LOADING_MAP)
    }

    override fun onDidFinishLoadingMap() {
        handleMapChangedEvent(EventTypes.DID_FINISH_LOADING_MAP)
    }

    override fun onWillStartRenderingFrame() {
        handleMapChangedEvent(EventTypes.WILL_START_RENDERING_FRAME)
    }

    override fun onDidFinishRenderingFrame(
        fully: Boolean,
        frameEncodingTime: Double,
        frameRenderingTime: Double
    ) {
        if (fully) {
            handleMapChangedEvent(EventTypes.DID_FINISH_RENDERING_FRAME_FULLY)
        } else {
            handleMapChangedEvent(EventTypes.DID_FINISH_RENDERING_FRAME)
        }
    }

    override fun onWillStartRenderingMap() {
        handleMapChangedEvent(EventTypes.WILL_START_RENDERING_MAP)
    }

    override fun onDidFinishRenderingMap(fully: Boolean) {
        if (fully) {
            for (preRenderMethod in mPreRenderMethods) {
                val methodID: Int = preRenderMethod.first!!
                val args = preRenderMethod.second
                mManager.receiveCommand(this, methodID, args)
            }
            mPreRenderMethods.clear()
            handleMapChangedEvent(EventTypes.DID_FINISH_RENDERING_MAP_FULLY)
        } else {
            handleMapChangedEvent(EventTypes.DID_FINISH_RENDERING_MAP)
        }
    }

    override fun onDidFinishLoadingStyle() {
        handleMapChangedEvent(EventTypes.DID_FINISH_LOADING_STYLE)
    }

    override fun onStyleImageMissing(id: String) {
        for (images in mImages) {
            if (images.addMissingImageToStyle(id, this.mapboxMap!!)) {
                return
            }
        }
        for (images in mImages) {
            images.sendImageMissingEvent(id, this.mapboxMap!!)
        }
    }

    private val displayDensity: Float
        get() = mContext.resources.displayMetrics.density

    fun setReactMapStyle(mapStyle: String) {
        mMapStyle = mapStyle

        if (this.mapboxMap != null) {
            removeAllSourcesFromMap()

            if (isJSONValid(mMapStyle)) {
                mapboxMap!!.setStyle(Style.Builder().fromJson(mMapStyle), object : OnStyleLoaded {
                    override fun onStyleLoaded(style: Style) {
                        addAllSourcesToMap()
                    }
                })
            } else {
                mapboxMap!!.setStyle(mapStyle) { addAllSourcesToMap() }
            }
        }
    }

    fun setReactPreferredFramesPerSecond(preferredFramesPerSecond: Int?) {
        mPreferredFramesPerSecond = preferredFramesPerSecond
        updatePreferredFramesPerSecond()
    }

    fun setReactContentInset(array: ReadableArray?) {
        mInsets = array
        updateInsets()
    }

    fun setLocalizeLabels(localizeLabels: Boolean) {
        mLocalizeLabels = localizeLabels
    }

    fun setReactZoomEnabled(zoomEnabled: Boolean) {
        mZoomEnabled = zoomEnabled
        updateUISettings()
    }

    fun setReactScrollEnabled(scrollEnabled: Boolean) {
        mScrollEnabled = scrollEnabled
        updateUISettings()
    }

    fun setReactPitchEnabled(pitchEnabled: Boolean) {
        mPitchEnabled = pitchEnabled
        updateUISettings()
    }

    fun setReactRotateEnabled(rotateEnabled: Boolean) {
        mRotateEnabled = rotateEnabled
        updateUISettings()
    }

    fun setReactLogoEnabled(logoEnabled: Boolean) {
        mLogoEnabled = logoEnabled
        updateUISettings()
    }

    fun setReactLogoPosition(position: ReadableMap?) {
        if (position == null) {
            // reset from explicit to default
            if (mLogoGravity != null) {
                val defaultOptions = MapLibreMapOptions.createFromAttributes(mContext)
                mLogoGravity = defaultOptions.logoGravity
                mLogoMargins = defaultOptions.logoMargins.copyOf(4)
                updateUISettings()
            }
            return
        }

        mLogoGravity = Gravity.NO_GRAVITY
        if (position.hasKey("left")) {
            mLogoGravity = mLogoGravity!! or Gravity.START
        }
        if (position.hasKey("right")) {
            mLogoGravity = mLogoGravity!! or Gravity.END
        }
        if (position.hasKey("top")) {
            mLogoGravity = mLogoGravity!! or Gravity.TOP
        }
        if (position.hasKey("bottom")) {
            mLogoGravity = mLogoGravity!! or Gravity.BOTTOM
        }
        val density = this.displayDensity
        mLogoMargins = intArrayOf(
            if (position.hasKey("left")) density.toInt() * position.getInt("left") else 0,
            if (position.hasKey("top")) density.toInt() * position.getInt("top") else 0,
            if (position.hasKey("right")) density.toInt() * position.getInt("right") else 0,
            if (position.hasKey("bottom")) density.toInt() * position.getInt("bottom") else 0
        )
        updateUISettings()
    }

    fun setReactCompassEnabled(compassEnabled: Boolean) {
        mCompassEnabled = compassEnabled
        updateUISettings()
    }

    fun setReactCompassViewMargins(compassViewMargins: ReadableMap?) {
        mCompassViewMargins = compassViewMargins
        updateUISettings()
    }

    fun setReactCompassViewPosition(compassViewPosition: Int) {
        mCompassViewPosition = compassViewPosition
        updateUISettings()
    }

    fun setReactAttributionEnabled(attributionEnabled: Boolean) {
        mAttributionEnabled = attributionEnabled
        updateUISettings()
    }

    fun setReactAttributionPosition(position: ReadableMap?) {
        if (position == null) {
            // reset from explicit to default
            if (mAttributionGravity != null) {
                val defaultOptions = MapLibreMapOptions.createFromAttributes(mContext)
                mAttributionGravity = defaultOptions.attributionGravity
                mAttributionMargin = defaultOptions.attributionMargins.copyOf(4)
                updateUISettings()
            }
            return
        }
        mAttributionGravity = Gravity.NO_GRAVITY
        if (position.hasKey("left")) {
            mAttributionGravity = mAttributionGravity!! or Gravity.START
        }
        if (position.hasKey("right")) {
            mAttributionGravity = mAttributionGravity!! or Gravity.END
        }
        if (position.hasKey("top")) {
            mAttributionGravity = mAttributionGravity!! or Gravity.TOP
        }
        if (position.hasKey("bottom")) {
            mAttributionGravity = mAttributionGravity!! or Gravity.BOTTOM
        }
        val density = this.displayDensity
        mAttributionMargin = intArrayOf(
            if (position.hasKey("left")) (density * position.getInt("left")).roundToInt() else 0,
            if (position.hasKey("top")) (density * position.getInt("top")).roundToInt() else 0,
            if (position.hasKey("right")) (density * position.getInt("right")).roundToInt() else 0,
            if (position.hasKey("bottom")) (density * position.getInt("bottom")).roundToInt() else 0
        )
        updateUISettings()
    }

    fun queryRenderedFeaturesAtPoint(
        callbackID: String?, point: PointF, filter: Expression?,
        layerIDs: MutableList<String?>
    ) {
        val features = mapboxMap!!.queryRenderedFeatures(
            point, filter,
            *layerIDs.toTypedArray<String?>()
        )

        val payload: WritableMap = WritableNativeMap()
        payload.putString("data", FeatureCollection.fromFeatures(features).toJson())

        val event = AndroidCallbackEvent(this, callbackID, payload)
        mManager.handleEvent(event)
    }

    fun getZoom(callbackID: String?) {
        val position = mapboxMap!!.cameraPosition

        val payload: WritableMap = WritableNativeMap()
        payload.putDouble("zoom", position.zoom)

        val event = AndroidCallbackEvent(this, callbackID, payload)
        mManager.handleEvent(event)
    }

    fun queryRenderedFeaturesInRect(
        callbackID: String?,
        rect: RectF,
        filter: Expression?,
        layerIDs: MutableList<String?>
    ) {
        val features = mapboxMap!!.queryRenderedFeatures(
            rect, filter,
            *layerIDs.toTypedArray<String?>()
        )

        val payload: WritableMap = WritableNativeMap()
        payload.putString("data", FeatureCollection.fromFeatures(features).toJson())

        val event = AndroidCallbackEvent(this, callbackID, payload)
        mManager.handleEvent(event)
    }

    fun getVisibleBounds(callbackID: String?) {
        val region = mapboxMap!!.projection.visibleRegion

        val payload: WritableMap = WritableNativeMap()
        payload.putArray("visibleBounds", GeoJSONUtils.fromLatLngBounds(region.latLngBounds))

        val event = AndroidCallbackEvent(this, callbackID, payload)
        mManager.handleEvent(event)
    }

    fun getPointInView(callbackID: String?, mapCoordinate: LatLng) {
        val pointInView = mapboxMap!!.projection.toScreenLocation(mapCoordinate)
        val density = this.displayDensity
        pointInView.x /= density
        pointInView.y /= density
        val payload: WritableMap = WritableNativeMap()

        val array: WritableArray = WritableNativeArray()
        array.pushDouble(pointInView.x.toDouble())
        array.pushDouble(pointInView.y.toDouble())
        payload.putArray("pointInView", array)

        val event = AndroidCallbackEvent(this, callbackID, payload)
        mManager.handleEvent(event)
    }

    fun getCoordinateFromView(callbackID: String?, pointInView: PointF) {
        val density = this.displayDensity
        pointInView.x *= density
        pointInView.y *= density

        val mapCoordinate = mapboxMap!!.projection.fromScreenLocation(pointInView)
        val payload: WritableMap = WritableNativeMap()

        val array: WritableArray = WritableNativeArray()
        array.pushDouble(mapCoordinate.longitude)
        array.pushDouble(mapCoordinate.latitude)
        payload.putArray("coordinateFromView", array)

        val event = AndroidCallbackEvent(this, callbackID, payload)
        mManager.handleEvent(event)
    }

    fun takeSnap(callbackID: String?, writeToDisk: Boolean) {
        if (this.mapboxMap == null) {
            throw Error("takeSnap should only be called after the map has rendered")
        }

        mapboxMap!!.snapshot(object : MapLibreMap.SnapshotReadyCallback {
            override fun onSnapshotReady(snapshot: Bitmap) {
                val payload: WritableMap = WritableNativeMap()
                val uri = if (writeToDisk)
                    BitmapUtils.createTempFile(mContext, snapshot)
                else
                    BitmapUtils.createBase64(snapshot)
                payload.putString("uri", uri)

                val event = AndroidCallbackEvent(this@MLRNMapView, callbackID, payload)
                mManager.handleEvent(event)
            }
        })
    }

    fun getCenter(): WritableMap {
        val center = mapboxMap!!.cameraPosition.target

        val array: WritableArray = WritableNativeArray()
        array.pushDouble(center!!.longitude)
        array.pushDouble(center.latitude)
        val payload: WritableMap = WritableNativeMap()
        payload.putArray("center", array)

        return payload
    }

    fun showAttribution() {
        val manager = AttributionDialogManager(mContext, this.mapboxMap!!)
        manager.onClick(this)
    }

    fun setSourceVisibility(
        visible: Boolean, sourceId: String,
        sourceLayerId: String?
    ) {
        if (this.mapboxMap == null) {
            return
        }
        mapboxMap!!.getStyle { style ->
            val layers = style.layers
            for (layer in layers) {
                val layerSourceInfo = LayerSourceInfo(layer)
                if (layerSourceInfo.sourceId == sourceId && (sourceLayerId == null
                            || sourceLayerId == layerSourceInfo.sourceLayerId)
                ) {
                    layer.setProperties(PropertyFactory.visibility(if (visible) Property.VISIBLE else Property.NONE))
                }
            }
        }
    }

    fun init() {
        // Required for rendering properly in Android Oreo
        getViewTreeObserver().dispatchOnGlobalLayout()
    }

    override fun isDestroyed(): Boolean {
        return mDestroyed
    }

    fun getStyle(onStyleLoaded: OnStyleLoaded) {
        if (this.mapboxMap == null) {
            return
        }

        mapboxMap!!.getStyle(onStyleLoaded)
    }

    private fun updateUISettings() {
        if (this.mapboxMap == null) {
            return
        }

        val uiSettings = mapboxMap!!.uiSettings

        if (mScrollEnabled != null && uiSettings.isScrollGesturesEnabled != mScrollEnabled) {
            uiSettings.isScrollGesturesEnabled = mScrollEnabled!!
            if (!mScrollEnabled!!) {
                mapboxMap!!.gesturesManager.moveGestureDetector.interrupt()
            }
        }

        if (mPitchEnabled != null && uiSettings.isTiltGesturesEnabled != mPitchEnabled) {
            uiSettings.isTiltGesturesEnabled = mPitchEnabled!!
        }

        if (mRotateEnabled != null && uiSettings.isRotateGesturesEnabled != mRotateEnabled) {
            uiSettings.isRotateGesturesEnabled = mRotateEnabled!!
            if (!mRotateEnabled!!) {
                mapboxMap!!.gesturesManager.rotateGestureDetector.interrupt()
            }
        }

        if (mAttributionEnabled != null && uiSettings.isAttributionEnabled != mAttributionEnabled) {
            uiSettings.isAttributionEnabled = mAttributionEnabled!!
        }

        if (mAttributionGravity != null && uiSettings.attributionGravity != mAttributionGravity) {
            uiSettings.attributionGravity = mAttributionGravity!!
        }

        if (mAttributionMargin != null &&
            (uiSettings.attributionMarginLeft != mAttributionMargin!![0] || uiSettings.attributionMarginTop != mAttributionMargin!![1] || uiSettings.attributionMarginRight != mAttributionMargin!![2] || uiSettings.attributionMarginBottom != mAttributionMargin!![3])
        ) {
            uiSettings.setAttributionMargins(
                mAttributionMargin!![0],
                mAttributionMargin!![1],
                mAttributionMargin!![2],
                mAttributionMargin!![3]
            )
        }

        if (mTintColor != null) {
            uiSettings.setAttributionTintColor(mTintColor!!)
        }

        if (mLogoEnabled != null && uiSettings.isLogoEnabled != mLogoEnabled) {
            uiSettings.setLogoEnabled(mLogoEnabled!!)
        }

        if (mLogoGravity != null && uiSettings.logoGravity != mLogoGravity) {
            uiSettings.logoGravity = mLogoGravity!!
        }

        if (mLogoMargins != null &&
            (uiSettings.logoMarginLeft != mLogoMargins!![0] || uiSettings.logoMarginTop != mLogoMargins!![1] || uiSettings.logoMarginRight != mLogoMargins!![2] || uiSettings.logoMarginBottom != mLogoMargins!![3])
        ) {
            uiSettings.setLogoMargins(
                mLogoMargins!![0],
                mLogoMargins!![1],
                mLogoMargins!![2],
                mLogoMargins!![3]
            )
        }

        if (mCompassEnabled != null && uiSettings.isCompassEnabled != mCompassEnabled) {
            uiSettings.setCompassEnabled(mCompassEnabled!!)
        }

        if (mCompassViewPosition != -1 && uiSettings.isCompassEnabled) {
            when (mCompassViewPosition) {
                0 -> uiSettings.compassGravity = Gravity.TOP or Gravity.START
                1 -> uiSettings.compassGravity = Gravity.TOP or Gravity.END
                2 -> uiSettings.compassGravity = Gravity.BOTTOM or Gravity.START
                3 -> uiSettings.compassGravity = Gravity.BOTTOM or Gravity.END
            }
        }

        if (mCompassViewMargins != null && uiSettings.isCompassEnabled) {
            val pixelDensity = resources.displayMetrics.density

            val x = Math.round(mCompassViewMargins!!.getInt("x") * pixelDensity)
            val y = Math.round(mCompassViewMargins!!.getInt("y") * pixelDensity)

            when (uiSettings.compassGravity) {
                Gravity.TOP or Gravity.START -> uiSettings.setCompassMargins(x, y, 0, 0)
                Gravity.TOP or Gravity.END -> uiSettings.setCompassMargins(0, y, x, 0)
                Gravity.BOTTOM or Gravity.START -> uiSettings.setCompassMargins(x, 0, 0, y)
                Gravity.BOTTOM or Gravity.END -> uiSettings.setCompassMargins(0, 0, x, y)
                else -> uiSettings.setCompassMargins(0, y, x, 0)
            }
        }

        if (mZoomEnabled != null && uiSettings.isZoomGesturesEnabled != mZoomEnabled) {
            uiSettings.isZoomGesturesEnabled = mZoomEnabled!!
            if (!mZoomEnabled!!) {
                mapboxMap!!.gesturesManager.standardScaleGestureDetector.interrupt()
            }
        }
    }

    private fun updatePreferredFramesPerSecond() {
        if (mPreferredFramesPerSecond == null) {
            return
        }
        setMaximumFps(mPreferredFramesPerSecond!!)
    }

    val contentInset: DoubleArray
        get() {
            if (mInsets == null) {
                return doubleArrayOf(0.0, 0.0, 0.0, 0.0)
            }
            var top = 0.0
            var right = 0.0
            var bottom = 0.0
            var left = 0.0

            if (mInsets!!.size() == 4) {
                top = mInsets!!.getInt(0).toDouble()
                right = mInsets!!.getInt(1).toDouble()
                bottom = mInsets!!.getInt(2).toDouble()
                left = mInsets!!.getInt(3).toDouble()
            } else if (mInsets!!.size() == 2) {
                top = mInsets!!.getInt(0).toDouble()
                right = mInsets!!.getInt(1).toDouble()
                bottom = top
                left = right
            } else if (mInsets!!.size() == 1) {
                top = mInsets!!.getInt(0).toDouble()
                right = top
                bottom = top
                left = top
            }

            val metrics = mContext.resources.displayMetrics

            return doubleArrayOf(
                left * metrics.scaledDensity,
                top * metrics.scaledDensity,
                right * metrics.scaledDensity,
                bottom * metrics.scaledDensity
            )
        }

    private fun updateInsets() {
        if (this.mapboxMap == null || mInsets == null) {
            return
        }

        val padding = this.contentInset
        val top = padding[1]
        val right = padding[2]
        val bottom = padding[3]
        val left = padding[0]

        mapboxMap!!.setPadding(
            left.toInt(),
            top.toInt(),
            right.toInt(),
            bottom.toInt()
        )
    }

    private fun setLifecycleListeners() {
        val reactContext = mContext as ReactContext

        mLifeCycleListener = object : LifecycleEventListener {
            override fun onHostResume() {
                onResume()
            }

            override fun onHostPause() {
                onPause()
            }

            override fun onHostDestroy() {
                dispose()
            }
        }

        reactContext.addLifecycleEventListener(mLifeCycleListener)
    }

    private fun makeRegionPayload(isAnimated: Boolean?): WritableMap {
        val position = mapboxMap!!.cameraPosition
        if (position.target == null) {
            return WritableNativeMap()
        }
        val latLng = LatLng(position.target!!.latitude, position.target!!.longitude)

        val properties: WritableMap = WritableNativeMap()

        properties.putDouble("zoomLevel", position.zoom)
        properties.putDouble("heading", position.bearing)
        properties.putDouble("pitch", position.tilt)
        properties.putBoolean(
            "animated",
            isAnimated ?: mCameraChangeTracker.isAnimated
        )
        properties.putBoolean("isUserInteraction", mCameraChangeTracker.isUserInteraction)

        try {
            val visibleRegion = mapboxMap!!.projection.visibleRegion
            properties.putArray(
                "visibleBounds",
                GeoJSONUtils.fromLatLngBounds(visibleRegion.latLngBounds)
            )
        } catch (ex: Exception) {
            Logger.e(
                LOG_TAG,
                String.format(
                    "An error occurred while attempting to make the region: %s",
                    ex.message
                )
            )
        }

        return GeoJSONUtils.toPointFeature(latLng, properties)
    }

    fun sendRegionChangeEvent(isAnimated: Boolean) {
        val event: IEvent = MapChangeEvent(
            this, EventTypes.REGION_DID_CHANGE,
            makeRegionPayload(isAnimated)
        )

        mManager.handleEvent(event)
        mCameraChangeTracker.setReason(CameraChangeTracker.EMPTY)
    }

    private fun removeAllSourcesFromMap() {
        if (mSources.isEmpty()) {
            return
        }
        for (key in mSources.keys) {
            val source = mSources[key]
            source!!.removeFromMap(this)
        }
    }

    private fun addAllSourcesToMap() {
        if (mSources.isEmpty()) {
            return
        }
        for (key in mSources.keys) {
            val source = mSources.get(key)
            source!!.addToMap(this)
        }
    }

    private val allTouchableSources: MutableList<MLRNSource<*>>
        get() {
            val sources: MutableList<MLRNSource<*>> =
                ArrayList()

            for (key in mSources.keys) {
                val source = mSources[key]
                if (source != null && source.hasPressListener()) {
                    sources.add(source)
                }
            }

            return sources
        }

    private val allShapeSources: MutableList<MLRNShapeSource?>
        get() {
            val shapeSources: MutableList<MLRNShapeSource?> =
                ArrayList()

            for (key in mSources.keys) {
                val source = mSources[key]

                if (source is MLRNShapeSource) {
                    shapeSources.add(source)
                }
            }

            return shapeSources
        }

    private fun getTouchableSourceWithHighestZIndex(sources: MutableList<MLRNSource<*>>?): MLRNSource<*>? {
        if (sources == null || sources.isEmpty()) {
            return null
        }

        if (sources.size == 1) {
            return sources[0]
        }

        val layerToSourceMap: MutableMap<String?, MLRNSource<*>?> = HashMap()
        for (source in sources) {
            val layerIDs = source.getLayerIDs()

            for (layerID in layerIDs) {
                layerToSourceMap.put(layerID, source)
            }
        }

        val mapboxLayers = mapboxMap!!.style!!.getLayers()
        for (i in mapboxLayers.indices.reversed()) {
            val mapboxLayer = mapboxLayers.get(i)

            val layerID = mapboxLayer.getId()
            if (layerToSourceMap.containsKey(layerID)) {
                return layerToSourceMap.get(layerID)
            }
        }

        return null
    }

    private fun hasSetCenterCoordinate(): Boolean {
        val cameraPosition = mapboxMap!!.cameraPosition
        val center = cameraPosition.target
        return center!!.latitude != 0.0 && center.longitude != 0.0
    }

    private val mapRotation: Double
        get() {
            val cameraPosition = mapboxMap!!.cameraPosition
            return cameraPosition.bearing
        }

    fun sendRegionDidChangeEvent() {
        handleMapChangedEvent(EventTypes.REGION_DID_CHANGE)
        mCameraChangeTracker.setReason(CameraChangeTracker.EMPTY)
    }

    private fun handleMapChangedEvent(eventType: String) {
        if (!canHandleEvent(eventType)) return

        val event: IEvent?

        when (eventType) {
            EventTypes.REGION_WILL_CHANGE, EventTypes.REGION_DID_CHANGE, EventTypes.REGION_IS_CHANGING -> event =
                MapChangeEvent(this, eventType, makeRegionPayload(null))

            else -> event = MapChangeEvent(this, eventType)
        }

        mManager.handleEvent(event)
    }

    private fun canHandleEvent(event: String?): Boolean {
        return mHandledMapChangedEvents == null || mHandledMapChangedEvents!!.contains(event)
    }

    fun setHandledMapChangedEvents(eventsWhiteList: ArrayList<String?>) {
        this.mHandledMapChangedEvents = HashSet(eventsWhiteList)
    }

    private fun sendUserLocationUpdateEvent(location: Location?) {
        if (location == null) {
            return
        }
        val event: IEvent = MapChangeEvent(
            this,
            EventTypes.USER_LOCATION_UPDATED,
            makeLocationChangePayload(location)
        )
        mManager.handleEvent(event)
    }

    private fun makeLocationChangePayload(location: Location): WritableMap {
        val positionProperties: WritableMap = WritableNativeMap()
        val coords: WritableMap = WritableNativeMap()

        coords.putDouble("longitude", location.longitude)
        coords.putDouble("latitude", location.latitude)
        coords.putDouble("altitude", location.altitude)
        coords.putDouble("accuracy", location.accuracy.toDouble())
        // A better solution will be to pull the heading from the compass engine,
        // unfortunately the api is not publicly available in the mapbox sdk
        coords.putDouble("heading", location.bearing.toDouble())
        coords.putDouble("course", location.bearing.toDouble())
        coords.putDouble("speed", location.speed.toDouble())

        positionProperties.putMap("coords", coords)
        positionProperties.putDouble("timestamp", location.time.toDouble())
        return positionProperties
    }

    /**
     * Adds the marker image to the map for use as a SymbolLayer icon
     */
    private fun setUpImage(loadedStyle: Style) {
        loadedStyle.addImage(
            "MARKER_IMAGE_ID", BitmapFactory.decodeResource(
                this.resources, R.drawable.red_marker
            )
        )
    }

    /**
     * PointAnnotations are rendered to a canvas, but react native Image component
     * is
     * implemented on top of Fresco, and fresco will not load images when their view
     * is
     * not attached to the window. So we'll have an offscreen view where we add
     * those views
     * so they can rendered full to canvas.
     */
    fun offscreenAnnotationViewContainer(): ViewGroup? {
        if (mOffscreenAnnotationViewContainer == null) {
            mOffscreenAnnotationViewContainer = FrameLayout(context)
            val flParams = LayoutParams(0, 0)
            flParams.setMargins(-10000, -10000, -10000, -10000)
            mOffscreenAnnotationViewContainer!!.setLayoutParams(flParams)
            addView(mOffscreenAnnotationViewContainer)
        }
        return mOffscreenAnnotationViewContainer
    }

    fun getMarkerViewManager(map: MapLibreMap): MarkerViewManager {
        if (markerViewManager == null) {
            if (map == null) {
                throw Error("makerViewManager should be called one the map has loaded")
            }
            markerViewManager = MarkerViewManager(this, map)
        }
        return markerViewManager!!
    }

    val locationComponentManager: LocationComponentManager
        get() {
            if (mLocationComponentManager == null) {
                mLocationComponentManager = LocationComponentManager(this, mContext)
            }
            return mLocationComponentManager!!
        }

    var tintColor: Int?
        get() = mTintColor
        set(tintColor) {
            if (mTintColor === tintColor) return
            mTintColor = tintColor
            updateUISettings()
            if (mLocationComponentManager == null) return
            mLocationComponentManager!!.update(this.mapboxMap!!.style!!)
        }

    companion object {
        const val LOG_TAG: String = "MLRNMapView"
    }
}
