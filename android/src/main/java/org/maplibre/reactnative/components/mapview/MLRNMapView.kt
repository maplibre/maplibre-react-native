package org.maplibre.reactnative.components.mapview

import android.content.Context
import android.graphics.BitmapFactory
import android.graphics.PointF
import android.graphics.RectF
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
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.EventDispatcher
import com.google.gson.JsonObject
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
import org.maplibre.android.maps.MapLibreMapOptions
import org.maplibre.android.maps.MapView
import org.maplibre.android.maps.OnMapReadyCallback
import org.maplibre.android.maps.Style
import org.maplibre.android.maps.Style.OnStyleLoaded
import org.maplibre.android.plugins.annotation.OnSymbolClickListener
import org.maplibre.android.plugins.annotation.OnSymbolDragListener
import org.maplibre.android.plugins.annotation.Symbol
import org.maplibre.android.plugins.annotation.SymbolManager
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
import org.maplibre.reactnative.events.MapChangeEvent
import org.maplibre.reactnative.events.MapPressEvent
import org.maplibre.reactnative.modules.MLRNModule
import org.maplibre.reactnative.utils.BitmapUtils
import org.maplibre.reactnative.utils.ConvertUtils
import org.maplibre.reactnative.utils.GeoJSONUtils
import org.maplibre.reactnative.utils.GeoViewport
import kotlin.math.roundToInt

open class MLRNMapView(
    context: Context, manager: MLRNMapViewManager, options: MapLibreMapOptions?
) : MapView(
    context, options
), OnMapReadyCallback, MapLibreMap.OnMapClickListener, MapLibreMap.OnMapLongClickListener,
    MapView.OnCameraIsChangingListener, MapView.OnCameraDidChangeListener,
    MapView.OnWillStartLoadingMapListener, MapView.OnDidFailLoadingMapListener,
    MapView.OnDidFinishLoadingMapListener, MapView.OnWillStartRenderingFrameListener,
    MapView.OnWillStartRenderingMapListener, MapView.OnDidFinishRenderingFrameListener,
    MapView.OnDidFinishRenderingMapListener, MapView.OnDidFinishLoadingStyleListener,
    MapView.OnStyleImageMissingListener {
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

    private var mapStyle: String
    private var insets: ReadableArray? = null
    private var preferredFramesPerSecond: Int? = null

    private var scrollEnabled: Boolean? = null
    private var zoomEnabled: Boolean? = null
    private var rotateEnabled: Boolean? = null
    private var pitchEnabled: Boolean? = null

    var tintColor: Int? = null

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

    private var markerViewManager: MarkerViewManager? = null
    private var offscreenAnnotationViewContainer: ViewGroup? = null

    private var annotationClicked = false

    val locationComponentManager: LocationComponentManager by lazy {
        LocationComponentManager(this, context)
    }

    val eventDispatcher: EventDispatcher?
        get() {
            val reactContext = context as ReactContext

            return UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
        }

    val surfaceId: Int
        get() {
            val reactContext = context as ReactContext

            return UIManagerHelper.getSurfaceId(reactContext)
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

    val featureCount: Int get() = features()!!.size

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

    fun animateCamera(cameraUpdate: CameraUpdate, callback: MapLibreMap.CancelableCallback?) {
        mapLibreMap!!.animateCamera(cameraUpdate, callback)
    }

    fun moveCamera(cameraUpdate: CameraUpdate, callback: MapLibreMap.CancelableCallback?) {
        mapLibreMap!!.moveCamera(cameraUpdate, callback)
    }

    fun moveCamera(cameraUpdate: CameraUpdate) {
        mapLibreMap!!.moveCamera(cameraUpdate)
    }

    fun easeCamera(
        cameraUpdate: CameraUpdate,
        duration: Int,
        easingInterpolator: Boolean,
        callback: MapLibreMap.CancelableCallback?
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
        }

        updatePreferredFramesPerSecond()
        updateInsets()
        updateUISettings()

        mapLibreMap.addOnCameraMoveStartedListener { reason ->
            cameraChangeTracker.setReason(reason)
            handleMapChangedEvent("onRegionWillChange", true)
        }

        mapLibreMap.addOnCameraMoveListener {
            if (markerViewManager != null) {
                markerViewManager!!.updateMarkers()
            }
        }

        mapLibreMap.addOnMoveListener(object : MapLibreMap.OnMoveListener {
            override fun onMoveBegin(detector: MoveGestureDetector) {
                cameraChangeTracker.setReason(CameraChangeTracker.USER_GESTURE)
                handleMapChangedEvent("onRegionWillChange", true)
            }

            override fun onMove(detector: MoveGestureDetector) {
                cameraChangeTracker.setReason(CameraChangeTracker.USER_GESTURE)
                handleMapChangedEvent("onRegionIsChanging")
            }

            override fun onMoveEnd(detector: MoveGestureDetector) {
            }
        })

        mapLibreMap.addOnCameraIdleListener { sendRegionDidChangeEvent() }
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


    override fun onMapClick(latLng: LatLng): Boolean {
        if (annotationClicked) {
            annotationClicked = false
            return true
        }

        val screenPoint = mapLibreMap!!.projection.toScreenLocation(latLng)
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
                        hits[source.getID()]!!, latLng, screenPoint
                    )
                )
                return true
            }
        }

        val event = MapPressEvent(surfaceId, id, "onPress", latLng, screenPoint)
        eventDispatcher?.dispatchEvent(event)

        return false
    }

    override fun onMapLongClick(latLng: LatLng): Boolean {
        if (annotationClicked) {
            annotationClicked = false
            return true
        }
        val screenPoint = mapLibreMap!!.projection.toScreenLocation(latLng)

        val event = MapPressEvent(surfaceId, id, "onLongPress", latLng, screenPoint)
        eventDispatcher?.dispatchEvent(event)

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
        handleMapChangedEvent("onRegionIsChanging")
    }

    override fun onWillStartLoadingMap() {
        handleMapChangedEvent("onWillStartLoadingMap")
    }

    override fun onDidFinishLoadingMap() {
        handleMapChangedEvent("onDidFinishLoadingMap")
    }

    override fun onDidFailLoadingMap(errorMessage: String?) {
        handleMapChangedEvent("onDidFailLoadingMap")
    }


    override fun onWillStartRenderingFrame() {
        handleMapChangedEvent("onWillStartRenderingFrame")
    }

    override fun onDidFinishRenderingFrame(
        fully: Boolean, frameEncodingTime: Double, frameRenderingTime: Double
    ) {
        if (fully) {
            handleMapChangedEvent("onDidFinishRenderingFrameFully")
        } else {
            handleMapChangedEvent("onDidFinishRenderingFrame")
        }
    }

    override fun onWillStartRenderingMap() {
        handleMapChangedEvent("onWillStartRenderingMap")
    }

    override fun onDidFinishRenderingMap(fully: Boolean) {
        if (fully) {
            for (preRenderMethod in preRenderMethods) {
                val methodID: Int = preRenderMethod.first!!
                val args = preRenderMethod.second
                manager.receiveCommand(this, methodID, args)
            }
            preRenderMethods.clear()
            handleMapChangedEvent("onDidFinishRenderingMapFully")
        } else {
            handleMapChangedEvent("onDidFinishRenderingMap")
        }
    }

    override fun onDidFinishLoadingStyle() {
        handleMapChangedEvent("onDidFinishLoadingStyle")
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

    fun setReactPreferredFramesPerSecond(preferredFramesPerSecond: Int?) {
        this.preferredFramesPerSecond = preferredFramesPerSecond
        updatePreferredFramesPerSecond()
    }

    fun setReactScrollEnabled(scrollEnabled: Boolean) {
        this.scrollEnabled = scrollEnabled
        updateUISettings()
    }

    fun setReactZoomEnabled(zoomEnabled: Boolean) {
        this.zoomEnabled = zoomEnabled
        updateUISettings()
    }

    fun setReactRotateEnabled(rotateEnabled: Boolean) {
        this.rotateEnabled = rotateEnabled
        updateUISettings()
    }

    fun setReactPitchEnabled(pitchEnabled: Boolean) {
        this.pitchEnabled = pitchEnabled
        updateUISettings()
    }

    fun setReactTintColor(value: Int?) {
        tintColor = value
        updateUISettings()
        if (mapLibreMap?.style != null) {
            locationComponentManager.update(mapLibreMap!!.style!!)
        }
    }

    private fun setOrnamentPosition(
        position: ReadableMap?,
        defaultGravityKey: (MapLibreMapOptions) -> Int,
        defaultMarginsKey: (MapLibreMapOptions) -> IntArray,
        setGravity: (Int) -> Unit,
        setMargins: (IntArray) -> Unit
    ) {
        if (position == null) {
            val defaults = MapLibreMapOptions.createFromAttributes(context)
            setGravity(defaultGravityKey(defaults))
            setMargins(defaultMarginsKey(defaults).copyOf(4))
        } else {
            var gravity = Gravity.NO_GRAVITY
            if (position.hasKey("left")) gravity = gravity or Gravity.START
            if (position.hasKey("right")) gravity = gravity or Gravity.END
            if (position.hasKey("top")) gravity = gravity or Gravity.TOP
            if (position.hasKey("bottom")) gravity = gravity or Gravity.BOTTOM
            val density = this.displayDensity
            val margins = intArrayOf(
                if (position.hasKey("left")) (density * position.getInt("left")).roundToInt() else 0,
                if (position.hasKey("top")) (density * position.getInt("top")).roundToInt() else 0,
                if (position.hasKey("right")) (density * position.getInt("right")).roundToInt() else 0,
                if (position.hasKey("bottom")) (density * position.getInt("bottom")).roundToInt() else 0
            )
            setGravity(gravity)
            setMargins(margins)
        }
        updateUISettings()
    }

    fun setReactAttribution(value: Boolean) {
        attributionEnabled = value
        updateUISettings()
    }

    fun setReactAttributionPosition(position: ReadableMap?) {
        setOrnamentPosition(
            position,
            { it.attributionGravity },
            { it.attributionMargins },
            { attributionGravity = it },
            { attributionMargin = it })
    }

    fun setReactLogo(value: Boolean) {
        logoEnabled = value
        updateUISettings()
    }

    fun setReactLogoPosition(position: ReadableMap?) {
        setOrnamentPosition(
            position,
            { it.logoGravity },
            { it.logoMargins },
            { logoGravity = it },
            { logoMargins = it })
    }

    fun setReactCompass(value: Boolean) {
        compassEnabled = value
        updateUISettings()
    }

    fun setReactCompassPosition(position: ReadableMap?) {
        setOrnamentPosition(
            position,
            { it.compassGravity },
            { it.compassMargins },
            { compassGravity = it },
            { compassMargins = it })
    }

    fun getCenter(): WritableMap {
        val cameraPosition = mapLibreMap!!.cameraPosition
        val center = cameraPosition.target!!

        val payload: WritableMap = WritableNativeMap()
        payload.putDouble("longitude", center.longitude)
        payload.putDouble("latitude", center.latitude)

        return payload;
    }

    fun getZoom(): Double {
        val cameraPosition = mapLibreMap!!.cameraPosition

        return cameraPosition.zoom
    }

    fun getBearing(): Double {
        val cameraPosition = mapLibreMap!!.cameraPosition

        return cameraPosition.bearing
    }

    fun getPitch(): Double {
        val cameraPosition = mapLibreMap!!.cameraPosition

        return cameraPosition.tilt
    }

    fun getBounds(): WritableArray {
        val visibleRegion = mapLibreMap!!.projection.visibleRegion
        return GeoJSONUtils.fromLatLngBounds(visibleRegion.latLngBounds)
    }

    fun getViewState(): WritableMap {
        val payload = this.getCenter()
        payload.putDouble("zoom", getZoom())
        payload.putDouble("bearing", getBearing())
        payload.putDouble("pitch", getPitch())
        payload.putArray("bounds", getBounds())

        return payload
    }

    fun queryRenderedFeaturesAtPoint(
        point: PointF, layers: ReadableArray?, filter: Expression?,
    ): WritableMap {
        val features = mapLibreMap!!.queryRenderedFeatures(
            point,
            filter,
            *(layers?.let { Array(layers.size()) { layers.getString(it) } } ?: emptyArray()))


        val featureCollection = FeatureCollection.fromFeatures(features)
        val jsonObject: JsonObject =
            com.google.gson.JsonParser.parseString(featureCollection.toJson()).asJsonObject
        return ConvertUtils.toWritableMap(jsonObject)
    }


    fun queryRenderedFeaturesInRect(
        rect: RectF, layers: ReadableArray?, filter: Expression?,
    ): WritableMap {
        val features = mapLibreMap!!.queryRenderedFeatures(
            rect,
            filter,
            *(layers?.let { Array(layers.size()) { layers.getString(it) } } ?: emptyArray()))

        val featureCollection = FeatureCollection.fromFeatures(features)
        val jsonObject =
            com.google.gson.JsonParser.parseString(featureCollection.toJson()).asJsonObject
        return ConvertUtils.toWritableMap(jsonObject)
    }

    fun project(mapCoordinate: LatLng): WritableMap {
        val pointInView = mapLibreMap!!.projection.toScreenLocation(mapCoordinate)
        val density = this.displayDensity
        pointInView.x /= density
        pointInView.y /= density
        val payload: WritableMap = WritableNativeMap()

        val array: WritableArray = WritableNativeArray()
        array.pushDouble(pointInView.x.toDouble())
        array.pushDouble(pointInView.y.toDouble())
        payload.putArray("pointInView", array)

        return payload
    }

    fun unproject(pointInView: PointF): WritableMap {
        val density = this.displayDensity
        pointInView.x *= density
        pointInView.y *= density

        val mapCoordinate = mapLibreMap!!.projection.fromScreenLocation(pointInView)
        val payload: WritableMap = WritableNativeMap()

        val array: WritableArray = WritableNativeArray()
        array.pushDouble(mapCoordinate.longitude)
        array.pushDouble(mapCoordinate.latitude)
        payload.putArray("coordinateFromView", array)

        return payload
    }

    fun takeSnap(writeToDisk: Boolean, callback: (WritableMap) -> Unit) {
        if (this.mapLibreMap == null) {
            throw Error("takeSnap should only be called after the map has rendered")
        }

        mapLibreMap!!.snapshot { snapshot ->
            val payload: WritableMap = WritableNativeMap()
            val uri = if (writeToDisk) BitmapUtils.createTempFile(context, snapshot)
            else BitmapUtils.createBase64(snapshot)
            payload.putString("uri", uri)

            callback(payload)
        }
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

        if (scrollEnabled != null && uiSettings.isScrollGesturesEnabled != scrollEnabled) {
            uiSettings.isScrollGesturesEnabled = scrollEnabled!!

            if (!scrollEnabled!!) {
                mapLibreMap!!.gesturesManager.moveGestureDetector.interrupt()
            }
        }

        if (zoomEnabled != null && uiSettings.isZoomGesturesEnabled != zoomEnabled) {
            uiSettings.isZoomGesturesEnabled = zoomEnabled!!

            if (!zoomEnabled!!) {
                mapLibreMap!!.gesturesManager.standardScaleGestureDetector.interrupt()
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

        if (compassGravity != null && uiSettings.compassGravity != compassGravity) {
            uiSettings.compassGravity = compassGravity!!
        }

        if (compassMargins != null && (uiSettings.compassMarginLeft != compassMargins!![0] || uiSettings.compassMarginTop != compassMargins!![1] || uiSettings.compassMarginRight != compassMargins!![2] || uiSettings.compassMarginBottom != compassMargins!![3])) {
            uiSettings.setCompassMargins(
                compassMargins!![0], compassMargins!![1], compassMargins!![2], compassMargins!![3]
            )
        }
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

    private fun makeViewState(isAnimated: Boolean?): WritableMap {
        val position = mapLibreMap!!.cameraPosition
        val viewState: WritableMap = WritableNativeMap()

        if (position.target == null) {
            return viewState
        }

        viewState.putDouble("longitude", position.target!!.longitude)
        viewState.putDouble("latitude", position.target!!.latitude)

        viewState.putDouble("zoom", position.zoom)
        viewState.putDouble("bearing", position.bearing)
        viewState.putDouble("pitch", position.tilt)

        try {
            val visibleRegion = mapLibreMap!!.projection.visibleRegion
            viewState.putArray(
                "bounds", GeoJSONUtils.fromLatLngBounds(visibleRegion.latLngBounds)
            )
        } catch (ex: Exception) {
            Logger.e(
                LOG_TAG, String.format(
                    "An error occurred while attempting to make the region: %s", ex.message
                )
            )
        }

        viewState.putBoolean(
            "animated", isAnimated ?: cameraChangeTracker.isAnimated
        )
        viewState.putBoolean("userInteraction", cameraChangeTracker.isUserInteraction)

        return viewState
    }

    fun sendRegionChangeEvent(isAnimated: Boolean) {
        val event = MapChangeEvent(
            surfaceId, id, "onRegionDidChange", makeViewState(isAnimated)
        )
        eventDispatcher?.dispatchEvent(event)

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
        handleMapChangedEvent("onRegionDidChange", true)
        cameraChangeTracker.setReason(CameraChangeTracker.EMPTY)
    }

    private fun handleMapChangedEvent(eventName: String, withViewState: Boolean? = null) {
        val event = if (withViewState == true) {
            MapChangeEvent(surfaceId, id, eventName, makeViewState(null))
        } else {
            MapChangeEvent(surfaceId, id, eventName)
        }

        eventDispatcher?.dispatchEvent(event)
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
