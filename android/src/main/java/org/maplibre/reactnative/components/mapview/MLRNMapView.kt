package org.maplibre.reactnative.components.mapview

import android.content.Context
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
import org.maplibre.reactnative.components.mapview.helpers.LayerSourceInfo
import org.maplibre.reactnative.components.styles.layers.MLRNLayer
import org.maplibre.reactnative.components.styles.light.MLRNLight
import org.maplibre.reactnative.components.styles.sources.MLRNShapeSource
import org.maplibre.reactnative.components.styles.sources.MLRNSource
import org.maplibre.reactnative.components.styles.sources.MLRNSource.OnPressEvent
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
    context: Context, manager: MLRNMapViewManager, options: MapLibreMapOptions?
) : MapView(
    context, options
), OnMapReadyCallback, OnMapClickListener, OnMapLongClickListener, OnCameraIsChangingListener,
    OnCameraDidChangeListener, OnDidFailLoadingMapListener, OnDidFinishLoadingMapListener,
    OnWillStartRenderingFrameListener, OnWillStartRenderingMapListener,
    OnDidFinishRenderingFrameListener, OnDidFinishRenderingMapListener,
    OnDidFinishLoadingStyleListener, OnStyleImageMissingListener {
    private val manager: MLRNMapViewManager
    private val handler: Handler
    private var lifeCycleListener: LifecycleEventListener? = null
    private var paused = false
    private var destroyed = false

    private var camera: MLRNCamera? = null
    private val features: MutableList<AbstractMapFeature>
    private var queuedFeatures: MutableList<AbstractMapFeature>?
    private val pointAnnotations: MutableMap<String?, MLRNPointAnnotation?>
    private val sources: MutableMap<String?, MLRNSource<*>?>
    private val images: MutableList<MLRNImages>

    private val cameraChangeTracker = CameraChangeTracker()
    private val preRenderMethods: MutableList<Pair<Int?, ReadableArray?>> =
        ArrayList<Pair<Int?, ReadableArray?>>()

    var mapLibreMap: MapLibreMap? = null
        private set

    private var localizationPlugin: LocalizationPlugin? = null

    private var mapStyle: String

    private var preferredFramesPerSecond: Int? = null
    private var localizeLabels = false
    private var scrollEnabled: Boolean? = null
    private var pitchEnabled: Boolean? = null
    private var rotateEnabled: Boolean? = null
    private var zoomEnabled: Boolean? = null

    private var attributionEnabled: Boolean? = null
    private var attributionGravity: Int? = null
    private var attributionMargin: IntArray? = null

    private var logoEnabled: Boolean? = null
    private var logoGravity: Int? = null
    private var logoMargins: IntArray? = null

    private var compassEnabled: Boolean? = null
    private var compassGravity: Int? = null
    private var compassMargins: IntArray? = null


    private var symbolManager: SymbolManager? = null

    private var activeMarkerID: Long = -1

    private var insets: ReadableArray? = null

    private var handledMapChangedEvents: HashSet<String?>? = null

    private var markerViewManager: MarkerViewManager? = null
    private var offscreenAnnotationViewContainer: ViewGroup? = null

    private var annotationClicked = false

    public val locationComponentManager: LocationComponentManager by lazy {
        LocationComponentManager(this, context)
    }


    var tintColor: Int? = null
        set(value) {
            if (field == value) return
            field = value
            updateUISettings()
            if (mapLibreMap?.style != null) {
                locationComponentManager.update(mapLibreMap!!.style!!)
            }
        }

    override fun onResume() {
        super.onResume()
        paused = false
    }

    override fun onPause() {
        super.onPause()
        paused = true
    }

    override fun onDestroy() {
        super.onDestroy()
        destroyed = true
    }

    fun enqueuePreRenderMapMethod(methodID: Int?, args: ReadableArray?) {
        preRenderMethods.add(Pair<Int?, ReadableArray?>(methodID, args))
    }

    fun addFeature(childView: View?, childPosition: Int) {
        var feature: AbstractMapFeature? = null

        when (childView) {
            is MLRNSource<*> -> {
                sources.put(childView.getID(), childView)
                feature = childView as AbstractMapFeature
            }

            is MLRNImages -> {
                images.add(childView)
                feature = childView as AbstractMapFeature
            }

            is MLRNLight -> {
                feature = childView as AbstractMapFeature
            }

            is MLRNNativeUserLocation -> {
                feature = childView as AbstractMapFeature
            }

            is MLRNPointAnnotation -> {
                pointAnnotations.put(childView.getID(), childView)
                feature = childView as AbstractMapFeature
            }

            is MLRNMarkerView -> {
                feature = childView as AbstractMapFeature
            }

            is MLRNCamera -> {
                camera = childView
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
            if (queuedFeatures == null) {
                feature.addToMap(this)
                features.add(childPosition, feature)
            } else {
                queuedFeatures!!.add(childPosition, feature)
            }
        }
    }

    fun removeFeature(childPosition: Int) {
        val feature = features()!![childPosition]

        when (feature) {
            is MLRNSource<*> -> {
                sources.remove(feature.getID())
            }

            is MLRNPointAnnotation -> {
                if (feature.mapboxID == activeMarkerID) {
                    activeMarkerID = -1
                }

                pointAnnotations.remove(feature.getID())
            }

            is MLRNImages -> {
                images.remove(feature)
            }
        }

        feature.removeFromMap(this)
        features()!!.remove(feature)
    }

    private fun features(): MutableList<AbstractMapFeature>? {
        return if (queuedFeatures != null && !queuedFeatures!!.isEmpty()) {
            queuedFeatures
        } else {
            features
        }
    }

    val featureCount: Int
        get() = features()!!.size

    fun getFeatureAt(i: Int): AbstractMapFeature? {
        return features()!![i]
    }

    @Synchronized
    fun dispose() {
        if (destroyed) {
            return
        }

        if (!layerWaiters.isEmpty()) {
            layerWaiters.clear()
        }

        val reactContext = context as ReactContext
        reactContext.removeLifecycleEventListener(lifeCycleListener)

        if (!paused) {
            onPause()
        }

        onStop()
        onDestroy()
    }

    fun getVisibleRegion(center: LatLng?, zoomLevel: Double): VisibleRegion {
        val metrics = context.resources.displayMetrics
        val contentPadding = mapLibreMap!!.padding

        val mapWidth =
            ((mapLibreMap!!.width * 0.75 - (contentPadding[0] + contentPadding[2])) / metrics.scaledDensity).toInt()
        val mapHeight =
            ((mapLibreMap!!.height * 0.75 - (contentPadding[1] + contentPadding[3])) / metrics.scaledDensity).toInt()
        val region = GeoViewport.getRegion(center, zoomLevel.toInt(), mapWidth, mapHeight)
        return region
    }

    val cameraPosition: CameraPosition
        get() = mapLibreMap!!.cameraPosition

    fun animateCamera(cameraUpdate: CameraUpdate, callback: CancelableCallback?) {
        mapLibreMap!!.animateCamera(cameraUpdate, callback)
    }

    fun moveCamera(cameraUpdate: CameraUpdate, callback: CancelableCallback?) {
        mapLibreMap!!.moveCamera(cameraUpdate, callback)
    }

    fun moveCamera(cameraUpdate: CameraUpdate) {
        mapLibreMap!!.moveCamera(cameraUpdate)
    }

    fun easeCamera(
        cameraUpdate: CameraUpdate,
        duration: Int,
        easingInterpolator: Boolean,
        callback: CancelableCallback?
    ) {
        mapLibreMap!!.easeCamera(cameraUpdate, duration, easingInterpolator, callback)
    }

    fun easeCamera(cameraUpdate: CameraUpdate) {
        mapLibreMap!!.easeCamera(cameraUpdate)
    }

    fun getPointAnnotationByID(annotationID: String?): MLRNPointAnnotation? {
        if (annotationID == null) {
            return null
        }

        for (key in pointAnnotations.keys) {
            val annotation = pointAnnotations[key]

            if (annotation != null && annotationID == annotation.getID()) {
                return annotation
            }
        }

        return null
    }

    fun getPointAnnotationByMarkerID(markerID: Long): MLRNPointAnnotation? {
        for (key in pointAnnotations.keys) {
            val annotation = pointAnnotations[key]

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

        this.manager = manager

        sources = HashMap()
        images = ArrayList()
        pointAnnotations = HashMap()
        queuedFeatures = ArrayList()
        features = ArrayList()

        handler = Handler()

        mapStyle = MLRNModule.DEFAULT_STYLE_URL

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
        val layer = mapLibreMap!!.style!!.getLayer(layerID)
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

    override fun onMapReady(mapLibreMap: MapLibreMap) {
        this.mapLibreMap = mapLibreMap

        if (isJSONValid(mapStyle)) {
            mapLibreMap.setStyle(Style.Builder().fromJson(mapStyle))
        } else {
            mapLibreMap.setStyle(Style.Builder().fromUri(mapStyle))
        }

        reflow()

        mapLibreMap.getStyle { style ->
            createSymbolManager(style)
            setUpImage(style)
            addQueuedFeatures()
            setupLocalization(style)
        }

        updatePreferredFramesPerSecond()
        updateInsets()
        updateUISettings()

        mapLibreMap.addOnCameraIdleListener { sendRegionDidChangeEvent() }

        mapLibreMap.addOnCameraMoveStartedListener { reason ->
            cameraChangeTracker.setReason(reason)
            handleMapChangedEvent(EventTypes.REGION_WILL_CHANGE)
        }

        mapLibreMap.addOnCameraMoveListener {
            if (markerViewManager != null) {
                markerViewManager!!.updateMarkers()
            }
        }

        mapLibreMap.addOnMoveListener(object : OnMoveListener {
            override fun onMoveBegin(detector: MoveGestureDetector) {
                cameraChangeTracker.setReason(CameraChangeTracker.USER_GESTURE)
                handleMapChangedEvent(EventTypes.REGION_WILL_CHANGE)
            }

            override fun onMove(detector: MoveGestureDetector) {
                cameraChangeTracker.setReason(CameraChangeTracker.USER_GESTURE)
                handleMapChangedEvent(EventTypes.REGION_IS_CHANGING)
            }

            override fun onMoveEnd(detector: MoveGestureDetector) {
            }
        })
    }

    fun reflow() {
        handler.post {
            measure(
                MeasureSpec.makeMeasureSpec(measuredWidth, MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(measuredHeight, MeasureSpec.EXACTLY)
            )
            layout(left, top, right, bottom)
        }
    }

    fun createSymbolManager(style: Style) {
        symbolManager = SymbolManager(this, this.mapLibreMap!!, style)
        symbolManager!!.setIconAllowOverlap(true)
        symbolManager!!.addClickListener(object : OnSymbolClickListener {
            override fun onAnnotationClick(symbol: Symbol): Boolean {
                onMarkerClick(symbol)
                return true
            }
        })
        symbolManager!!.addDragListener(object : OnSymbolDragListener {
            override fun onAnnotationDragStarted(symbol: Symbol) {
                annotationClicked = true
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
                annotationClicked = false
                val selectedMarkerID = symbol.id
                val annotation = getPointAnnotationByMarkerID(selectedMarkerID)
                annotation?.onDragEnd()
            }
        })
        mapLibreMap!!.addOnMapClickListener(this)
        mapLibreMap!!.addOnMapLongClickListener(this)
    }

    fun addQueuedFeatures() {
        if (queuedFeatures != null && !queuedFeatures!!.isEmpty()) {
            for (i in queuedFeatures!!.indices) {
                val feature = queuedFeatures!![i]
                feature.addToMap(this)
                features.add(feature)
            }
            queuedFeatures = null
        }
    }

    private fun setupLocalization(style: Style) {
        localizationPlugin = LocalizationPlugin(this, this.mapLibreMap!!, style)
        if (localizeLabels) {
            try {
                localizationPlugin!!.matchMapLanguageWithDeviceDefault()
            } catch (_: Exception) {
                val localeString = Locale.getDefault().toString()
                Logger.w(
                    LOG_TAG, String.format("Could not find matching locale for %s", localeString)
                )
            }
        }
    }

    override fun onTouchEvent(ev: MotionEvent?): Boolean {
        val result = super.onTouchEvent(ev)

        if (result && scrollEnabled == true) {
            requestDisallowInterceptTouchEvent(true)
        }

        return result
    }

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        if (!paused) {
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
        if (annotationClicked) {
            annotationClicked = false
            return true
        }

        val screenPoint = mapLibreMap!!.projection.toScreenLocation(point)
        val touchableSources = this.allTouchableSources

        val hits: MutableMap<String?, MutableList<Feature?>?> = HashMap()
        val hitTouchableSources: MutableList<MLRNSource<*>> = ArrayList()
        for (touchableSource in touchableSources) {
            val hitbox = touchableSource.getTouchHitbox()
            if (hitbox == null) {
                continue
            }

            val halfWidth = hitbox["width"]!!.toFloat() / 2.0f
            val halfHeight = hitbox["height"]!!.toFloat() / 2.0f

            val hitboxF = RectF()
            hitboxF.set(
                screenPoint.x - halfWidth,
                screenPoint.y - halfHeight,
                screenPoint.x + halfWidth,
                screenPoint.y + halfHeight
            )

            val features =
                mapLibreMap!!.queryRenderedFeatures(hitboxF, *touchableSource.getLayerIDs())
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
                        hits[source.getID()]!!, point, screenPoint
                    )
                )
                return true
            }
        }

        val event = MapClickEvent(this, point, screenPoint)
        manager.handleEvent(event)
        return false
    }

    override fun onMapLongClick(point: LatLng): Boolean {
        if (annotationClicked) {
            annotationClicked = false
            return true
        }
        val screenPoint = mapLibreMap!!.projection.toScreenLocation(point)
        val event = MapClickEvent(this, point, screenPoint, EventTypes.MAP_LONG_CLICK)
        manager.handleEvent(event)
        return false
    }

    fun onMarkerClick(symbol: Symbol) {
        annotationClicked = true
        val selectedMarkerID = symbol.id

        var activeAnnotation: MLRNPointAnnotation? = null
        var nextActiveAnnotation: MLRNPointAnnotation? = null

        for (key in pointAnnotations.keys) {
            val annotation = pointAnnotations[key]
            val curMarkerID = annotation!!.mapboxID
            if (activeMarkerID == curMarkerID) {
                activeAnnotation = annotation
            }
            if (selectedMarkerID == curMarkerID && activeMarkerID != curMarkerID) {
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
        activeMarkerID = annotation.mapboxID
        annotation.onSelect(true)
    }

    fun deselectAnnotation(annotation: MLRNPointAnnotation) {
        activeMarkerID = -1
        annotation.onDeselect()
    }

    override fun onCameraDidChange(animated: Boolean) {
        cameraChangeTracker.isAnimating = animated
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
        fully: Boolean, frameEncodingTime: Double, frameRenderingTime: Double
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
            for (preRenderMethod in preRenderMethods) {
                val methodID: Int = preRenderMethod.first!!
                val args = preRenderMethod.second
                manager.receiveCommand(this, methodID, args)
            }
            preRenderMethods.clear()
            handleMapChangedEvent(EventTypes.DID_FINISH_RENDERING_MAP_FULLY)
        } else {
            handleMapChangedEvent(EventTypes.DID_FINISH_RENDERING_MAP)
        }
    }

    override fun onDidFinishLoadingStyle() {
        handleMapChangedEvent(EventTypes.DID_FINISH_LOADING_STYLE)
    }

    override fun onStyleImageMissing(id: String) {
        for (images in images) {
            if (images.addMissingImageToStyle(id, this.mapLibreMap!!)) {
                return
            }
        }
        for (images in images) {
            images.sendImageMissingEvent(id, this.mapLibreMap!!)
        }
    }

    private val displayDensity: Float
        get() = context.resources.displayMetrics.density

    fun setReactMapStyle(value: String?) {
        if (value != null) {
            mapStyle = value

            if (mapLibreMap != null) {
                removeAllSourcesFromMap()

                if (isJSONValid(mapStyle)) {
                    mapLibreMap!!.setStyle(
                        Style.Builder().fromJson(mapStyle)
                    ) { addAllSourcesToMap() }
                } else {
                    mapLibreMap!!.setStyle(value) { addAllSourcesToMap() }
                }
            }
        }
    }

    fun setReactPreferredFramesPerSecond(preferredFramesPerSecond: Int?) {
        this.preferredFramesPerSecond = preferredFramesPerSecond
        updatePreferredFramesPerSecond()
    }

    fun setReactContentInset(value: ReadableMap?) {
        if (value != null) {
            val arr = WritableNativeArray()
            arr.pushDouble(value.getDouble("top"))
            arr.pushDouble(value.getDouble("right"))
            arr.pushDouble(value.getDouble("bottom"))
            arr.pushDouble(value.getDouble("left"))
            insets = arr
        } else {
            insets = null
        }
        updateInsets()
    }

    fun setLocalizeLabels(localizeLabels: Boolean) {
        this.localizeLabels = localizeLabels
    }

    fun setReactZoomEnabled(zoomEnabled: Boolean) {
        this.zoomEnabled = zoomEnabled
        updateUISettings()
    }

    fun setReactScrollEnabled(scrollEnabled: Boolean) {
        this.scrollEnabled = scrollEnabled
        updateUISettings()
    }

    fun setReactPitchEnabled(pitchEnabled: Boolean) {
        this.pitchEnabled = pitchEnabled
        updateUISettings()
    }

    fun setReactRotateEnabled(rotateEnabled: Boolean) {
        this.rotateEnabled = rotateEnabled
        updateUISettings()
    }

    fun setReactAttribution(value: Boolean) {
        attributionEnabled = value
        updateUISettings()
    }

    fun setReactAttributionPosition(position: ReadableMap?) {
        if (position == null) {
            // Reset to defaults
            if (attributionGravity != null) {
                val defaultOptions = MapLibreMapOptions.createFromAttributes(context)
                attributionGravity = defaultOptions.attributionGravity
                attributionMargin = defaultOptions.attributionMargins.copyOf(4)
                updateUISettings()
            }
        } else {
            attributionGravity = Gravity.NO_GRAVITY
            if (position.hasKey("left")) {
                attributionGravity = attributionGravity!! or Gravity.START
            }
            if (position.hasKey("right")) {
                attributionGravity = attributionGravity!! or Gravity.END
            }
            if (position.hasKey("top")) {
                attributionGravity = attributionGravity!! or Gravity.TOP
            }
            if (position.hasKey("bottom")) {
                attributionGravity = attributionGravity!! or Gravity.BOTTOM
            }
            val density = this.displayDensity
            attributionMargin = intArrayOf(
                if (position.hasKey("left")) (density * position.getInt("left")).roundToInt() else 0,
                if (position.hasKey("top")) (density * position.getInt("top")).roundToInt() else 0,
                if (position.hasKey("right")) (density * position.getInt("right")).roundToInt() else 0,
                if (position.hasKey("bottom")) (density * position.getInt("bottom")).roundToInt() else 0
            )
            updateUISettings()
        }
    }

    fun setReactLogoEnabled(logoEnabled: Boolean) {
        this.logoEnabled = logoEnabled
        updateUISettings()
    }

    fun setReactLogoPosition(position: ReadableMap?) {
        if (position == null) {
            // Reset to defaults
            if (logoGravity != null) {
                val defaultOptions = MapLibreMapOptions.createFromAttributes(context)
                logoGravity = defaultOptions.logoGravity
                logoMargins = defaultOptions.logoMargins.copyOf(4)
                updateUISettings()
            }
        } else {
            logoGravity = Gravity.NO_GRAVITY
            if (position.hasKey("left")) {
                logoGravity = logoGravity!! or Gravity.START
            }
            if (position.hasKey("right")) {
                logoGravity = logoGravity!! or Gravity.END
            }
            if (position.hasKey("top")) {
                logoGravity = logoGravity!! or Gravity.TOP
            }
            if (position.hasKey("bottom")) {
                logoGravity = logoGravity!! or Gravity.BOTTOM
            }
            val density = this.displayDensity
            logoMargins = intArrayOf(
                if (position.hasKey("left")) (density * position.getInt("left")).roundToInt() else 0,
                if (position.hasKey("top")) (density * position.getInt("top")).roundToInt() else 0,
                if (position.hasKey("right")) (density * position.getInt("right")).roundToInt() else 0,
                if (position.hasKey("bottom")) (density * position.getInt("bottom")).roundToInt() else 0
            )
            updateUISettings()
        }
    }

    fun setReactCompass(value: Boolean) {
        compassEnabled = value
        updateUISettings()
    }

    fun setReactCompassPosition(position: ReadableMap?) {
        if (position == null) {
            // Reset to defaults
            if (compassGravity != null) {
                val defaultOptions = MapLibreMapOptions.createFromAttributes(context)
                compassGravity = defaultOptions.compassGravity
                compassMargins = defaultOptions.compassMargins.copyOf(4)
                updateUISettings()
            }
        } else {
            compassGravity = Gravity.NO_GRAVITY
            if (position.hasKey("left")) {
                compassGravity = compassGravity!! or Gravity.START
            }
            if (position.hasKey("right")) {
                compassGravity = compassGravity!! or Gravity.END
            }
            if (position.hasKey("top")) {
                compassGravity = compassGravity!! or Gravity.TOP
            }
            if (position.hasKey("bottom")) {
                compassGravity = compassGravity!! or Gravity.BOTTOM
            }
            val density = this.displayDensity
            compassMargins = intArrayOf(
                if (position.hasKey("left")) (density * position.getInt("left")).roundToInt() else 0,
                if (position.hasKey("top")) (density * position.getInt("top")).roundToInt() else 0,
                if (position.hasKey("right")) (density * position.getInt("right")).roundToInt() else 0,
                if (position.hasKey("bottom")) (density * position.getInt("bottom")).roundToInt() else 0
            )
            updateUISettings()
        }
    }


    fun queryRenderedFeaturesAtPoint(
        point: PointF, filter: Expression?, layerIDs: MutableList<String?>
    ): WritableMap {
        val features = mapLibreMap!!.queryRenderedFeatures(
            point, filter, *layerIDs.toTypedArray<String?>()
        )

        val payload: WritableMap = WritableNativeMap()
        payload.putString("data", FeatureCollection.fromFeatures(features).toJson())

        return payload;
    }

    fun getZoom(): WritableMap {
        val position = mapLibreMap!!.cameraPosition

        val payload: WritableMap = WritableNativeMap()
        payload.putDouble("zoom", position.zoom)

        return payload;
    }

    fun queryRenderedFeaturesInRect(

        rect: RectF, filter: Expression?, layerIDs: MutableList<String?>
    ): WritableMap {
        val features = mapLibreMap!!.queryRenderedFeatures(
            rect, filter, *layerIDs.toTypedArray<String?>()
        )

        val payload: WritableMap = WritableNativeMap()
        payload.putString("data", FeatureCollection.fromFeatures(features).toJson())

        return payload;
    }

    fun getVisibleBounds(): WritableMap {
        val region = mapLibreMap!!.projection.visibleRegion

        val payload: WritableMap = WritableNativeMap()
        payload.putArray("visibleBounds", GeoJSONUtils.fromLatLngBounds(region.latLngBounds))

        return payload;
    }

    fun getPointInView(mapCoordinate: LatLng): WritableMap {
        val pointInView = mapLibreMap!!.projection.toScreenLocation(mapCoordinate)
        val density = this.displayDensity
        pointInView.x /= density
        pointInView.y /= density
        val payload: WritableMap = WritableNativeMap()

        val array: WritableArray = WritableNativeArray()
        array.pushDouble(pointInView.x.toDouble())
        array.pushDouble(pointInView.y.toDouble())
        payload.putArray("pointInView", array)

        return payload;
    }

    fun getCoordinateFromView(pointInView: PointF): WritableMap {
        val density = this.displayDensity
        pointInView.x *= density
        pointInView.y *= density

        val mapCoordinate = mapLibreMap!!.projection.fromScreenLocation(pointInView)
        val payload: WritableMap = WritableNativeMap()

        val array: WritableArray = WritableNativeArray()
        array.pushDouble(mapCoordinate.longitude)
        array.pushDouble(mapCoordinate.latitude)
        payload.putArray("coordinateFromView", array)

        return payload;
    }

    fun takeSnap(writeToDisk: Boolean): WritableMap {
        if (this.mapLibreMap == null) {
            throw Error("takeSnap should only be called after the map has rendered")
        }

        mapLibreMap!!.snapshot { snapshot ->
            val payload: WritableMap = WritableNativeMap()
            val uri = if (writeToDisk) BitmapUtils.createTempFile(context, snapshot)
            else BitmapUtils.createBase64(snapshot)
            payload.putString("uri", uri)

            TODO("Missing return")
        }
        val todo = WritableNativeMap()
        return todo
    }


    fun getCenter(): WritableMap {
        val center = mapLibreMap!!.cameraPosition.target

        val array: WritableArray = WritableNativeArray()
        array.pushDouble(center!!.longitude)
        array.pushDouble(center.latitude)
        val payload: WritableMap = WritableNativeMap()
        payload.putArray("center", array)

        return payload
    }

    fun showAttribution() {
        val manager = AttributionDialogManager(context, this.mapLibreMap!!)
        manager.onClick(this)
    }

    fun setSourceVisibility(
        visible: Boolean, sourceId: String, sourceLayerId: String?
    ) {
        if (this.mapLibreMap == null) {
            return
        }
        mapLibreMap!!.getStyle { style ->
            val layers = style.layers
            for (layer in layers) {
                val layerSourceInfo = LayerSourceInfo(layer)
                if (layerSourceInfo.sourceId == sourceId && (sourceLayerId == null || sourceLayerId == layerSourceInfo.sourceLayerId)) {
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
        return destroyed
    }

    fun getStyle(onStyleLoaded: OnStyleLoaded) {
        if (this.mapLibreMap == null) {
            return
        }

        mapLibreMap!!.getStyle(onStyleLoaded)
    }

    private fun updateUISettings() {
        if (mapLibreMap == null) {
            return
        }

        val uiSettings = mapLibreMap!!.uiSettings

        if (zoomEnabled != null && uiSettings.isZoomGesturesEnabled != zoomEnabled) {
            uiSettings.isZoomGesturesEnabled = zoomEnabled!!

            if (!zoomEnabled!!) {
                mapLibreMap!!.gesturesManager.standardScaleGestureDetector.interrupt()
            }
        }

        if (scrollEnabled != null && uiSettings.isScrollGesturesEnabled != scrollEnabled) {
            uiSettings.isScrollGesturesEnabled = scrollEnabled!!

            if (!scrollEnabled!!) {
                mapLibreMap!!.gesturesManager.moveGestureDetector.interrupt()
            }
        }

        if (rotateEnabled != null && uiSettings.isRotateGesturesEnabled != rotateEnabled) {
            uiSettings.isRotateGesturesEnabled = rotateEnabled!!

            if (!rotateEnabled!!) {
                mapLibreMap!!.gesturesManager.rotateGestureDetector.interrupt()
            }
        }

        if (pitchEnabled != null && uiSettings.isTiltGesturesEnabled != pitchEnabled) {
            uiSettings.isTiltGesturesEnabled = pitchEnabled!!
        }

        if (tintColor != null) {
            uiSettings.setAttributionTintColor(tintColor!!)
        }

        if (attributionEnabled != null && uiSettings.isAttributionEnabled != attributionEnabled) {
            uiSettings.isAttributionEnabled = attributionEnabled!!
        }

        if (attributionGravity != null && uiSettings.attributionGravity != attributionGravity) {
            uiSettings.attributionGravity = attributionGravity!!
        }

        if (attributionMargin != null && (uiSettings.attributionMarginLeft != attributionMargin!![0] || uiSettings.attributionMarginTop != attributionMargin!![1] || uiSettings.attributionMarginRight != attributionMargin!![2] || uiSettings.attributionMarginBottom != attributionMargin!![3])) {
            uiSettings.setAttributionMargins(
                attributionMargin!![0],
                attributionMargin!![1],
                attributionMargin!![2],
                attributionMargin!![3]
            )
        }

        if (logoEnabled != null && uiSettings.isLogoEnabled != logoEnabled) {
            uiSettings.setLogoEnabled(logoEnabled!!)
        }

        if (logoGravity != null && uiSettings.logoGravity != logoGravity) {
            uiSettings.logoGravity = logoGravity!!
        }

        if (logoMargins != null && (uiSettings.logoMarginLeft != logoMargins!![0] || uiSettings.logoMarginTop != logoMargins!![1] || uiSettings.logoMarginRight != logoMargins!![2] || uiSettings.logoMarginBottom != logoMargins!![3])) {
            uiSettings.setLogoMargins(
                logoMargins!![0], logoMargins!![1], logoMargins!![2], logoMargins!![3]
            )
        }

        if (compassEnabled != null && uiSettings.isCompassEnabled != compassEnabled) {
            uiSettings.setCompassEnabled(compassEnabled!!)
        }

//        if (compassViewPosition != -1 && uiSettings.isCompassEnabled) {
//            when (compassViewPosition) {
//                0 -> uiSettings.compassGravity = Gravity.TOP or Gravity.START
//                1 -> uiSettings.compassGravity = Gravity.TOP or Gravity.END
//                2 -> uiSettings.compassGravity = Gravity.BOTTOM or Gravity.START
//                3 -> uiSettings.compassGravity = Gravity.BOTTOM or Gravity.END
//            }
//        }
//
//        if (compassViewMargins != null && uiSettings.isCompassEnabled) {
//            val pixelDensity = resources.displayMetrics.density
//
//            val x = (compassViewMargins!!.getInt("x") * pixelDensity).roundToInt()
//            val y = (compassViewMargins!!.getInt("y") * pixelDensity).roundToInt()
//
//            when (uiSettings.compassGravity) {
//                Gravity.TOP or Gravity.START -> uiSettings.setCompassMargins(x, y, 0, 0)
//                Gravity.TOP or Gravity.END -> uiSettings.setCompassMargins(0, y, x, 0)
//                Gravity.BOTTOM or Gravity.START -> uiSettings.setCompassMargins(x, 0, 0, y)
//                Gravity.BOTTOM or Gravity.END -> uiSettings.setCompassMargins(0, 0, x, y)
//                else -> uiSettings.setCompassMargins(0, y, x, 0)
//            }
//        }
    }

    private fun updatePreferredFramesPerSecond() {
        if (preferredFramesPerSecond == null) {
            return
        }
        setMaximumFps(preferredFramesPerSecond!!)
    }

    val contentInset: DoubleArray
        get() {
            if (insets == null) {
                return doubleArrayOf(0.0, 0.0, 0.0, 0.0)
            }
            var top = 0.0
            var right = 0.0
            var bottom = 0.0
            var left = 0.0

            if (insets!!.size() == 4) {
                top = insets!!.getInt(0).toDouble()
                right = insets!!.getInt(1).toDouble()
                bottom = insets!!.getInt(2).toDouble()
                left = insets!!.getInt(3).toDouble()
            } else if (insets!!.size() == 2) {
                top = insets!!.getInt(0).toDouble()
                right = insets!!.getInt(1).toDouble()
                bottom = top
                left = right
            } else if (insets!!.size() == 1) {
                top = insets!!.getInt(0).toDouble()
                right = top
                bottom = top
                left = top
            }


            return doubleArrayOf(
                left * displayDensity,
                top * displayDensity,
                right * displayDensity,
                bottom * displayDensity
            )
        }

    private fun updateInsets() {
        if (this.mapLibreMap == null || insets == null) {
            return
        }

        val padding = this.contentInset
        val top = padding[1]
        val right = padding[2]
        val bottom = padding[3]
        val left = padding[0]

        mapLibreMap!!.setPadding(
            left.toInt(), top.toInt(), right.toInt(), bottom.toInt()
        )
    }

    private fun setLifecycleListeners() {
        val reactContext = context as ReactContext

        lifeCycleListener = object : LifecycleEventListener {
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

        reactContext.addLifecycleEventListener(lifeCycleListener)
    }

    private fun makeRegionPayload(isAnimated: Boolean?): WritableMap {
        val position = mapLibreMap!!.cameraPosition
        if (position.target == null) {
            return WritableNativeMap()
        }
        val latLng = LatLng(position.target!!.latitude, position.target!!.longitude)

        val properties: WritableMap = WritableNativeMap()

        properties.putDouble("zoomLevel", position.zoom)
        properties.putDouble("bearing", position.bearing)
        properties.putDouble("pitch", position.tilt)
        properties.putBoolean(
            "animated", isAnimated ?: cameraChangeTracker.isAnimated
        )
        properties.putBoolean("isUserInteraction", cameraChangeTracker.isUserInteraction)

        try {
            val visibleRegion = mapLibreMap!!.projection.visibleRegion
            properties.putArray(
                "visibleBounds", GeoJSONUtils.fromLatLngBounds(visibleRegion.latLngBounds)
            )
        } catch (ex: Exception) {
            Logger.e(
                LOG_TAG, String.format(
                    "An error occurred while attempting to make the region: %s", ex.message
                )
            )
        }

        return GeoJSONUtils.toPointFeature(latLng, properties)
    }

    fun sendRegionChangeEvent(isAnimated: Boolean) {
        val event: IEvent = MapChangeEvent(
            this, EventTypes.REGION_DID_CHANGE, makeRegionPayload(isAnimated)
        )

        manager.handleEvent(event)
        cameraChangeTracker.setReason(CameraChangeTracker.EMPTY)
    }

    private fun removeAllSourcesFromMap() {
        if (sources.isEmpty()) {
            return
        }
        for (key in sources.keys) {
            val source = sources[key]
            source!!.removeFromMap(this)
        }
    }

    private fun addAllSourcesToMap() {
        if (sources.isEmpty()) {
            return
        }
        for (key in sources.keys) {
            val source = sources[key]
            source!!.addToMap(this)
        }
    }

    private val allTouchableSources: MutableList<MLRNSource<*>>
        get() {
            val sources: MutableList<MLRNSource<*>> = ArrayList()

            for (key in this.sources.keys) {
                val source = this.sources[key]
                if (source != null && source.hasPressListener()) {
                    sources.add(source)
                }
            }

            return sources
        }

    private val allShapeSources: MutableList<MLRNShapeSource?>
        get() {
            val shapeSources: MutableList<MLRNShapeSource?> = ArrayList()

            for (key in sources.keys) {
                val source = sources[key]

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

        val mapboxLayers = mapLibreMap!!.style!!.getLayers()
        for (i in mapboxLayers.indices.reversed()) {
            val mapboxLayer = mapboxLayers[i]

            val layerID = mapboxLayer.getId()
            if (layerToSourceMap.containsKey(layerID)) {
                return layerToSourceMap[layerID]
            }
        }

        return null
    }

    private fun hasSetCenterCoordinate(): Boolean {
        val cameraPosition = mapLibreMap!!.cameraPosition
        val center = cameraPosition.target
        return center!!.latitude != 0.0 && center.longitude != 0.0
    }

    private val mapRotation: Double
        get() {
            val cameraPosition = mapLibreMap!!.cameraPosition
            return cameraPosition.bearing
        }

    fun sendRegionDidChangeEvent() {
        handleMapChangedEvent(EventTypes.REGION_DID_CHANGE)
        cameraChangeTracker.setReason(CameraChangeTracker.EMPTY)
    }

    private fun handleMapChangedEvent(eventType: String) {
        if (!canHandleEvent(eventType)) return

        val event = when (eventType) {
            EventTypes.REGION_WILL_CHANGE, EventTypes.REGION_DID_CHANGE, EventTypes.REGION_IS_CHANGING -> MapChangeEvent(
                this, eventType, makeRegionPayload(null)
            )

            else -> MapChangeEvent(this, eventType)
        }

        manager.handleEvent(event)
    }

    private fun canHandleEvent(event: String?): Boolean {
        return handledMapChangedEvents == null || handledMapChangedEvents!!.contains(event)
    }

    fun setHandledMapChangedEvents(eventsWhiteList: ArrayList<String?>) {
        this.handledMapChangedEvents = HashSet(eventsWhiteList)
    }

    private fun sendUserLocationUpdateEvent(location: Location?) {
        if (location == null) {
            return
        }
        val event: IEvent = MapChangeEvent(
            this, EventTypes.USER_LOCATION_UPDATED, makeLocationChangePayload(location)
        )
        manager.handleEvent(event)
    }

    private fun makeLocationChangePayload(location: Location): WritableMap {
        val positionProperties: WritableMap = WritableNativeMap()
        val coords: WritableMap = WritableNativeMap()

        coords.putDouble("longitude", location.longitude)
        coords.putDouble("latitude", location.latitude)
        coords.putDouble("altitude", location.altitude)
        coords.putDouble("accuracy", location.accuracy.toDouble())
        coords.putDouble("bearing", location.bearing.toDouble())
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
     * PointAnnotations are rendered to a canvas, but react native Image component is
     * implemented on top of Fresco, and fresco will not load images when their view is
     * not attached to the window. So we'll have an offscreen view where we add those views
     * so they can rendered full to canvas.
     */
    fun offscreenAnnotationViewContainer(): ViewGroup? {
        if (offscreenAnnotationViewContainer == null) {
            offscreenAnnotationViewContainer = FrameLayout(this.context)
            val flParams = LayoutParams(0, 0)
            flParams.setMargins(-10000, -10000, -10000, -10000)
            offscreenAnnotationViewContainer!!.setLayoutParams(flParams)
            addView(offscreenAnnotationViewContainer)
        }
        return offscreenAnnotationViewContainer
    }

    fun getMarkerViewManager(map: MapLibreMap): MarkerViewManager {
        if (markerViewManager == null) {
            markerViewManager = MarkerViewManager(this, map)
        }
        return markerViewManager!!
    }

    companion object {
        const val LOG_TAG: String = "MLRNMapView"
    }
}
