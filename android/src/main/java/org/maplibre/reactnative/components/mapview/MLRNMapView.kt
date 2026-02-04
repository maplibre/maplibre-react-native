package org.maplibre.reactnative.components.mapview

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.BitmapFactory
import android.graphics.PointF
import android.graphics.RectF
import android.os.Handler
import android.os.Looper
import android.util.AttributeSet
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.EventDispatcher
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.camera.CameraUpdate
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.gestures.MoveGestureDetector
import org.maplibre.android.log.Logger
import org.maplibre.android.maps.AttributionDialogManager
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.MapLibreMapOptions
import org.maplibre.android.maps.MapView
import org.maplibre.android.maps.OnMapReadyCallback
import org.maplibre.android.maps.Style
import org.maplibre.android.maps.Style.OnStyleLoaded
import org.maplibre.android.plugins.annotation.OnSymbolDragListener
import org.maplibre.android.plugins.annotation.Symbol
import org.maplibre.android.plugins.annotation.SymbolManager
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.layers.Layer
import org.maplibre.android.style.layers.Property
import org.maplibre.android.style.layers.PropertyFactory
import org.maplibre.geojson.Feature
import org.maplibre.reactnative.R
import org.maplibre.reactnative.components.AbstractMapFeature
import org.maplibre.reactnative.components.annotations.markerview.MLRNMarkerView
import org.maplibre.reactnative.components.annotations.markerview.MarkerViewManager
import org.maplibre.reactnative.components.annotations.pointannotation.MLRNPointAnnotation
import org.maplibre.reactnative.components.camera.MLRNCamera
import org.maplibre.reactnative.components.images.MLRNImages
import org.maplibre.reactnative.components.layers.MLRNLayer
import org.maplibre.reactnative.components.layers.style.MLRNStyle
import org.maplibre.reactnative.components.layers.style.MLRNStyleFactory
import org.maplibre.reactnative.components.location.LocationComponentManager
import org.maplibre.reactnative.components.location.MLRNNativeUserLocation
import org.maplibre.reactnative.components.mapview.helpers.CameraChangeTracker
import org.maplibre.reactnative.components.mapview.helpers.LayerSourceInfo
import org.maplibre.reactnative.components.sources.MLRNPressableSource
import org.maplibre.reactnative.components.sources.MLRNSource
import org.maplibre.reactnative.events.MapChangeEvent
import org.maplibre.reactnative.events.MapPressEvent
import org.maplibre.reactnative.utils.BitmapUtils
import org.maplibre.reactnative.utils.ConvertUtils
import org.maplibre.reactnative.utils.GeoJSONUtils
import kotlin.math.roundToInt

sealed class MapChild {
    data class FeatureChild(
        val feature: AbstractMapFeature,
    ) : MapChild()

    data class ViewChild(
        val view: View,
    ) : MapChild()

    fun toView(): View? =
        when (this) {
            is FeatureChild -> feature
            is ViewChild -> view
        }
}

open class MLRNMapView(
    context: Context,
    options: MapLibreMapOptions?,
) : MapView(
        context,
        options,
    ),
    OnMapReadyCallback,
    MapLibreMap.OnMapClickListener,
    MapLibreMap.OnMapLongClickListener,
    MapView.OnCameraIsChangingListener,
    MapView.OnCameraDidChangeListener,
    MapView.OnWillStartLoadingMapListener,
    MapView.OnDidFailLoadingMapListener,
    MapView.OnDidFinishLoadingMapListener,
    MapView.OnWillStartRenderingFrameListener,
    MapView.OnWillStartRenderingMapListener,
    MapView.OnDidFinishRenderingFrameListener,
    MapView.OnDidFinishRenderingMapListener,
    MapView.OnDidFinishLoadingStyleListener,
    MapView.OnStyleImageMissingListener {
    constructor(context: Context) : this(context, options = null)

    @Suppress("UNUSED_PARAMETER")
    constructor(context: Context, attrs: AttributeSet?) : this(context, options = null)

    @Suppress("UNUSED_PARAMETER")
    constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : this(
        context,
        options = null,
    )

    private val handler: Handler
    private var lifeCycleListener: LifecycleEventListener? = null
    private var paused = false
    private var destroyed = false

    private var camera: MLRNCamera? = null
    private val children: MutableList<MapChild>
    private var queuedChildren: MutableList<MapChild>?
    private val pointAnnotations: MutableMap<String, MLRNPointAnnotation>
    private val sources: MutableMap<String, MLRNSource<*>>
    private val images: MutableList<MLRNImages>

    private val cameraChangeTracker = CameraChangeTracker()

    var mapLibreMap: MapLibreMap? = null
        private set

    private var mapStyle: String? = null
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
    private var compassHiddenFacingNorth: Boolean? = null

    private var symbolManager: SymbolManager? = null

    private var activePointAnnotationAnnotationId: Long? = null
    private var pointAnnotationClicked = false

    private var markerViewManager: MarkerViewManager? = null
    private var offscreenAnnotationViewContainer: ViewGroup? = null

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

    fun addFeature(
        childView: View?,
        childPosition: Int,
    ) {
        val child: MapChild? =
            when (childView) {
                is MLRNCamera -> {
                    camera = childView
                    MapChild.FeatureChild(childView)
                }

                is MLRNSource<*> -> {
                    sources[childView.getID()] = childView
                    MapChild.FeatureChild(childView)
                }

                is MLRNPointAnnotation -> {
                    pointAnnotations[childView.mapLibreId!!] = childView
                    MapChild.FeatureChild(childView)
                }

                is MLRNImages -> {
                    images.add(childView)
                    MapChild.FeatureChild(childView)
                }

                is MLRNNativeUserLocation, is MLRNMarkerView, is MLRNLayer -> {
                    MapChild.FeatureChild(childView)
                }

                is ViewGroup -> {
                    MapChild.ViewChild(childView)
                }

                else -> {
                    null
                }
            }

        if (child != null) {
            if (queuedChildren == null) {
                when (child) {
                    is MapChild.FeatureChild -> {
                        child.feature.addToMap(this)
                    }

                    is MapChild.ViewChild -> {
                        addView(child.view)
                    }
                }

                children.add(childPosition, child)
            } else {
                queuedChildren!!.add(childPosition, child)
            }
        }
    }

    fun removeFeature(childPosition: Int) {
        val child = children()[childPosition]

        when (child) {
            is MapChild.FeatureChild -> {
                when (child.feature) {
                    is MLRNSource<*> -> {
                        sources.remove(child.feature.getID())
                    }

                    is MLRNPointAnnotation -> {
                        if (child.feature.annotationId == activePointAnnotationAnnotationId) {
                            activePointAnnotationAnnotationId = null
                        }

                        child.feature.mapLibreId?.let { pointAnnotations.remove(it) }
                    }

                    is MLRNImages -> {
                        images.remove(child.feature)
                    }
                }

                child.feature.removeFromMap(this)
            }

            is MapChild.ViewChild -> {
                removeView(child.view)
            }
        }

        children().remove(child)
    }

    private fun children() = queuedChildren?.takeIf { it.isNotEmpty() } ?: children

    val featureCount: Int get() = children().size

    fun getFeatureAt(i: Int): MapChild = children()[i]

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

    val cameraPosition: CameraPosition
        get() = mapLibreMap!!.cameraPosition

    fun moveCamera(
        cameraUpdate: CameraUpdate,
        callback: MapLibreMap.CancelableCallback?,
    ) {
        mapLibreMap!!.moveCamera(cameraUpdate, callback)
    }

    fun getPointAnnotationByMarkerID(markerID: Long): MLRNPointAnnotation? {
        for (key in pointAnnotations.keys) {
            val annotation = pointAnnotations[key]

            if (annotation != null && markerID == annotation.annotationId) {
                return annotation
            }
        }

        return null
    }

    fun getSymbolManager(): SymbolManager = symbolManager!!

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

        sources = HashMap()
        images = ArrayList()
        pointAnnotations = HashMap()
        children = ArrayList()
        queuedChildren = ArrayList()

        handler = Handler(Looper.getMainLooper())

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

    fun waitForLayer(
        layerID: String,
        callback: FoundLayerCallback,
    ) {
        val layer = mapLibreMap!!.style!!.getLayer(layerID)
        if (layer != null) {
            callback.found(layer)
        } else {
            val waiters = layerWaiters.computeIfAbsent(layerID) { _: String? -> ArrayList() }
            waiters.add(callback)
        }
    }

    override fun onMapReady(mapLibreMap: MapLibreMap) {
        this.mapLibreMap = mapLibreMap

        mapStyle?.let { style ->
            mapLibreMap.setStyle(
                if (ConvertUtils.isJSONValid(style)) {
                    Style.Builder().fromJson(style)
                } else {
                    Style
                        .Builder()
                        .fromUri(style)
                },
            )
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

        mapLibreMap.addOnMoveListener(
            object : MapLibreMap.OnMoveListener {
                override fun onMoveBegin(detector: MoveGestureDetector) {
                    cameraChangeTracker.setReason(CameraChangeTracker.USER_GESTURE)
                    handleMapChangedEvent("onRegionWillChange", true)
                }

                override fun onMove(detector: MoveGestureDetector) {
                    cameraChangeTracker.setReason(CameraChangeTracker.USER_GESTURE)
                    handleMapChangedEvent("onRegionIsChanging", true)
                }

                override fun onMoveEnd(detector: MoveGestureDetector) {
                }
            },
        )

        mapLibreMap.addOnCameraIdleListener { sendRegionDidChangeEvent() }
    }

    fun reflow() {
        handler.post {
            measure(
                MeasureSpec.makeMeasureSpec(measuredWidth, MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(measuredHeight, MeasureSpec.EXACTLY),
            )
            layout(left, top, right, bottom)
        }
    }

    fun createSymbolManager(style: Style) {
        symbolManager = SymbolManager(this, this.mapLibreMap!!, style)
        symbolManager!!.setIconAllowOverlap(true)
        symbolManager!!.addClickListener { symbol ->
            onMarkerClick(symbol)
            true
        }
        symbolManager!!.addDragListener(
            object : OnSymbolDragListener {
                override fun onAnnotationDragStarted(symbol: Symbol) {
                    pointAnnotationClicked = true
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
                    pointAnnotationClicked = false
                    val selectedMarkerID = symbol.id
                    val annotation = getPointAnnotationByMarkerID(selectedMarkerID)
                    annotation?.onDragEnd()
                }
            },
        )
        mapLibreMap!!.addOnMapClickListener(this)
        mapLibreMap!!.addOnMapLongClickListener(this)
    }

    fun addQueuedFeatures() {
        queuedChildren?.let {
            for (i in it.indices) {
                val child = it[i]

                when (child) {
                    is MapChild.FeatureChild -> {
                        child.feature.addToMap(this)
                    }

                    is MapChild.ViewChild -> {
                        addView(child.view)
                    }
                }

                children.add(child)
            }

            queuedChildren = null
        }
    }

    @SuppressLint("ClickableViewAccessibility")
    override fun onTouchEvent(ev: MotionEvent?): Boolean {
        val result = super.onTouchEvent(ev)

        if (result && scrollEnabled == true) {
            requestDisallowInterceptTouchEvent(true)
        }

        return result
    }

    override fun onLayout(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
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
        if (pointAnnotationClicked) {
            pointAnnotationClicked = false
        }

        if (activePointAnnotationAnnotationId != null) {
            val active = pointAnnotations.values.find { it.annotationId == activePointAnnotationAnnotationId }
            if (active != null) {
                deselectAnnotation(active)
            }
        }

        val screenPoint = mapLibreMap!!.projection.toScreenLocation(latLng)

        val hits: MutableMap<String, MutableList<Feature>?> = HashMap()
        val hitPressableSources: MutableList<MLRNPressableSource<*>> = ArrayList()
        for (pressableSource in this.pressableSources) {
            val hitbox = pressableSource.hitbox ?: continue

            val pointWithHitbox =
                RectF(
                    screenPoint.x - hitbox.left,
                    screenPoint.y - hitbox.top,
                    screenPoint.x + hitbox.right,
                    screenPoint.y + hitbox.bottom,
                )

            val features =
                mapLibreMap!!.queryRenderedFeatures(pointWithHitbox, *pressableSource.getLayerIDs())
            if (features.isNotEmpty()) {
                hits[pressableSource.getID()] = features
                hitPressableSources.add(pressableSource)
            }
        }

        if (hits.isNotEmpty()) {
            val source = getPressableSourceWithHighestZIndex(hitPressableSources)
            if (source != null && source.hasOnPress) {
                hits[source.getID()]?.let {
                    source.onPress(it, latLng, screenPoint)
                }

                return true
            }
        }

        val event = MapPressEvent(surfaceId, id, "onPress", latLng, screenPoint)
        eventDispatcher?.dispatchEvent(event)

        return false
    }

    override fun onMapLongClick(latLng: LatLng): Boolean {
        if (pointAnnotationClicked) {
            pointAnnotationClicked = false
        }

        val screenPoint = mapLibreMap!!.projection.toScreenLocation(latLng)

        val event = MapPressEvent(surfaceId, id, "onLongPress", latLng, screenPoint)
        eventDispatcher?.dispatchEvent(event)

        return false
    }

    fun onMarkerClick(symbol: Symbol) {
        pointAnnotationClicked = true
        val selectedMarkerID = symbol.id

        var activeAnnotation: MLRNPointAnnotation? = null
        var nextActiveAnnotation: MLRNPointAnnotation? = null

        for (key in pointAnnotations.keys) {
            val pointAnnotation = pointAnnotations[key]
            val currentAnnotationId = pointAnnotation!!.annotationId

            if (activePointAnnotationAnnotationId == currentAnnotationId) {
                activeAnnotation = pointAnnotation
            }

            if (selectedMarkerID == currentAnnotationId && activePointAnnotationAnnotationId != currentAnnotationId) {
                nextActiveAnnotation = pointAnnotation
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
        activePointAnnotationAnnotationId = annotation.annotationId
        annotation.onSelect(true)
    }

    fun deselectAnnotation(annotation: MLRNPointAnnotation) {
        activePointAnnotationAnnotationId = null
        annotation.onDeselect()
    }

    override fun onCameraDidChange(animated: Boolean) {
        cameraChangeTracker.isAnimating = animated
    }

    override fun onCameraIsChanging() {
        handleMapChangedEvent("onRegionIsChanging", true)
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
        markerViewManager?.updateMarkers()
        handleMapChangedEvent("onWillStartRenderingFrame")
    }

    override fun onDidFinishRenderingFrame(
        fully: Boolean,
        frameEncodingTime: Double,
        frameRenderingTime: Double,
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
            handleMapChangedEvent("onDidFinishRenderingMapFully")
        } else {
            handleMapChangedEvent("onDidFinishRenderingMap")
        }
    }

    override fun onDidFinishLoadingStyle() {
        handleMapChangedEvent("onDidFinishLoadingStyle")
        applyLight()
    }

    override fun onStyleImageMissing(id: String) {
        for (images in images) {
            if (images.addMissingImageToStyle(id, this.mapLibreMap!!)) {
                return
            }
        }

        for (images in images) {
            images.sendImageMissingEvent(id)
        }
    }

    private val displayDensity: Float
        get() = context.resources.displayMetrics.density

    fun setReactMapStyle(value: String?) {
        if (value != null) {
            mapStyle = value

            mapLibreMap?.let { map ->
                removeAllSourcesFromMap()

                mapStyle?.let { style ->
                    map.setStyle(
                        if (ConvertUtils.isJSONValid(style)) {
                            Style.Builder().fromJson(style)
                        } else {
                            Style
                                .Builder()
                                .fromUri(style)
                        },
                    ) {
                        addAllSourcesToMap()
                    }
                }
            }
        }
    }

    private var reactLight: ReadableMap? = null

    fun setReactLight(value: ReadableMap?) {
        reactLight = value
        applyLight()
    }

    private fun applyLight() {
        val reactLightProps = reactLight
        val map = mapLibreMap
        val style = map?.style

        if (style != null && reactLightProps != null) {
            val light = style.light
            MLRNStyleFactory.setLightLayerStyle(light, MLRNStyle(context, reactLightProps, map))
        }
    }

    fun setReactContentInset(value: ReadableMap?) {
        if (value != null) {
            val arr = Arguments.createArray()
            arr.pushDouble(if (value.hasKey("top")) value.getDouble("top") else 0.0)
            arr.pushDouble(if (value.hasKey("right")) value.getDouble("right") else 0.0)
            arr.pushDouble(if (value.hasKey("bottom")) value.getDouble("bottom") else 0.0)
            arr.pushDouble(if (value.hasKey("left")) value.getDouble("left") else 0.0)
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
        setMargins: (IntArray) -> Unit,
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
            val margins =
                intArrayOf(
                    if (position.hasKey("left")) (density * position.getInt("left")).roundToInt() else 0,
                    if (position.hasKey("top")) (density * position.getInt("top")).roundToInt() else 0,
                    if (position.hasKey("right")) (density * position.getInt("right")).roundToInt() else 0,
                    if (position.hasKey("bottom")) (density * position.getInt("bottom")).roundToInt() else 0,
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
            { attributionMargin = it },
        )
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
            { logoMargins = it },
        )
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
            { compassMargins = it },
        )
    }

    fun setReactCompassHiddenFacingNorth(value: Boolean) {
        compassHiddenFacingNorth = value
        updateUISettings()
    }

    fun getCenter(): WritableArray {
        val cameraPosition = mapLibreMap!!.cameraPosition
        val center = cameraPosition.target!!

        return GeoJSONUtils.fromLatLng(center)
    }

    fun getZoom(): Double {
        val cameraPosition = mapLibreMap!!.cameraPosition

        return cameraPosition.zoom
    }

    fun getBearing(): Double {
        val cameraPosition = mapLibreMap!!.cameraPosition

        // Convert -0.0 to 0.0
        return cameraPosition.bearing + 0.0
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
        val payload = Arguments.createMap()
        payload.putArray("center", getCenter())
        payload.putDouble("zoom", getZoom())
        payload.putDouble("bearing", getBearing())
        payload.putDouble("pitch", getPitch())
        payload.putArray("bounds", getBounds())

        return payload
    }

    fun queryRenderedFeaturesWithPoint(
        point: PointF,
        layers: ReadableArray?,
        filter: Expression?,
    ): WritableArray {
        val density = this.displayDensity
        val screenPoint = PointF(point.x * density, point.y * density)

        val features =
            mapLibreMap!!.queryRenderedFeatures(
                screenPoint,
                filter,
                *(layers?.let { Array(layers.size()) { layers.getString(it) } } ?: emptyArray()),
            )

        return GeoJSONUtils.fromFeatureList(features)
    }

    fun queryRenderedFeaturesWithRect(
        rect: RectF?,
        layers: ReadableArray?,
        filter: Expression?,
    ): WritableArray {
        val screenRect =
            if (rect == null) {
                val width = this.width.toFloat()
                val height = this.height.toFloat()
                RectF(0f, 0f, width, height)
            } else {
                RectF(
                    rect.left * this.displayDensity,
                    rect.top * this.displayDensity,
                    rect.right * this.displayDensity,
                    rect.bottom * this.displayDensity,
                )
            }

        val features =
            mapLibreMap!!.queryRenderedFeatures(
                screenRect,
                filter,
                *(layers?.let { Array(layers.size()) { layers.getString(it) } } ?: emptyArray()),
            )

        return GeoJSONUtils.fromFeatureList(features)
    }

    fun project(mapCoordinate: LatLng): WritableArray {
        val pointInView = mapLibreMap!!.projection.toScreenLocation(mapCoordinate)
        val density = this.displayDensity
        pointInView.x /= density
        pointInView.y /= density
        val payload: WritableArray = Arguments.createArray()

        payload.pushDouble(pointInView.x.toDouble())
        payload.pushDouble(pointInView.y.toDouble())

        return payload
    }

    fun unproject(pointInView: PointF): WritableArray {
        val density = this.displayDensity
        pointInView.x *= density
        pointInView.y *= density

        val latLng = mapLibreMap!!.projection.fromScreenLocation(pointInView)

        return GeoJSONUtils.fromLatLng(latLng)
    }

    fun takeSnap(
        writeToDisk: Boolean,
        callback: (String) -> Unit,
    ) {
        if (this.mapLibreMap == null) {
            throw Error("takeSnap should only be called after the map has rendered")
        }

        mapLibreMap!!.snapshot { snapshot ->
            val uri =
                if (writeToDisk) {
                    BitmapUtils.createTempFile(context, snapshot)
                } else {
                    BitmapUtils.createBase64(snapshot)
                }

            callback(uri)
        }
    }

    fun showAttribution() {
        val manager = AttributionDialogManager(context, this.mapLibreMap!!)
        manager.onClick(this)
    }

    fun setSourceVisibility(
        visible: Boolean,
        sourceId: String,
        sourceLayerId: String?,
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
        viewTreeObserver.dispatchOnGlobalLayout()
    }

    override fun isDestroyed(): Boolean = destroyed

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

        if (attributionMargin != null &&
            (
                uiSettings.attributionMarginLeft != attributionMargin!![0] || uiSettings.attributionMarginTop != attributionMargin!![1] ||
                    uiSettings.attributionMarginRight != attributionMargin!![2] ||
                    uiSettings.attributionMarginBottom != attributionMargin!![3]
            )
        ) {
            uiSettings.setAttributionMargins(
                attributionMargin!![0],
                attributionMargin!![1],
                attributionMargin!![2],
                attributionMargin!![3],
            )
        }

        if (logoEnabled != null && uiSettings.isLogoEnabled != logoEnabled) {
            uiSettings.setLogoEnabled(logoEnabled!!)
        }

        if (logoGravity != null && uiSettings.logoGravity != logoGravity) {
            uiSettings.logoGravity = logoGravity!!
        }

        if (logoMargins != null &&
            (
                uiSettings.logoMarginLeft != logoMargins!![0] || uiSettings.logoMarginTop != logoMargins!![1] ||
                    uiSettings.logoMarginRight != logoMargins!![2] ||
                    uiSettings.logoMarginBottom != logoMargins!![3]
            )
        ) {
            uiSettings.setLogoMargins(
                logoMargins!![0],
                logoMargins!![1],
                logoMargins!![2],
                logoMargins!![3],
            )
        }

        if (compassEnabled != null && uiSettings.isCompassEnabled != compassEnabled) {
            uiSettings.setCompassEnabled(compassEnabled!!)
        }

        if (compassGravity != null && uiSettings.compassGravity != compassGravity) {
            uiSettings.compassGravity = compassGravity!!
        }

        if (compassMargins != null &&
            (
                uiSettings.compassMarginLeft != compassMargins!![0] || uiSettings.compassMarginTop != compassMargins!![1] ||
                    uiSettings.compassMarginRight != compassMargins!![2] ||
                    uiSettings.compassMarginBottom != compassMargins!![3]
            )
        ) {
            uiSettings.setCompassMargins(
                compassMargins!![0],
                compassMargins!![1],
                compassMargins!![2],
                compassMargins!![3],
            )
        }
        if (compassHiddenFacingNorth != null) {
            uiSettings.setCompassFadeFacingNorth(compassHiddenFacingNorth!!)
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
                bottom * displayDensity,
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
            left.toInt(),
            top.toInt(),
            right.toInt(),
            bottom.toInt(),
        )
    }

    private fun setLifecycleListeners() {
        val reactContext = context as ReactContext

        lifeCycleListener =
            object : LifecycleEventListener {
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
        val viewState: WritableMap = Arguments.createMap()

        if (position.target == null) {
            return viewState
        }

        viewState.putArray(
            "center",
            Arguments.createArray().apply {
                pushDouble(position.target!!.longitude)
                pushDouble(position.target!!.latitude)
            },
        )

        viewState.putDouble("zoom", position.zoom)
        viewState.putDouble("bearing", position.bearing)
        viewState.putDouble("pitch", position.tilt)

        try {
            val visibleRegion = mapLibreMap!!.projection.visibleRegion
            viewState.putArray(
                "bounds",
                GeoJSONUtils.fromLatLngBounds(visibleRegion.latLngBounds),
            )
        } catch (ex: Exception) {
            Logger.e(
                LOG_TAG,
                String.format(
                    "An error occurred while attempting to make the region: %s",
                    ex.message,
                ),
            )
        }

        viewState.putBoolean(
            "animated",
            isAnimated ?: cameraChangeTracker.isAnimated,
        )
        viewState.putBoolean("userInteraction", cameraChangeTracker.isUserInteraction)

        return viewState
    }

    fun sendRegionChangeEvent(isAnimated: Boolean) {
        val event =
            MapChangeEvent(
                surfaceId,
                id,
                "onRegionDidChange",
                makeViewState(isAnimated),
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

    private val pressableSources: MutableList<MLRNPressableSource<*>>
        get() {
            val sources: MutableList<MLRNPressableSource<*>> = ArrayList()

            for (key in this.sources.keys) {
                val source = this.sources[key]
                if (source != null && source is MLRNPressableSource && source.hasOnPress) {
                    sources.add(source)
                }
            }

            return sources
        }

    private fun getPressableSourceWithHighestZIndex(sources: MutableList<MLRNPressableSource<*>>?): MLRNPressableSource<*>? {
        if (sources == null || sources.isEmpty()) {
            return null
        }

        if (sources.size == 1) {
            return sources[0]
        }

        val layerToSourceMap: MutableMap<String?, MLRNPressableSource<*>?> = HashMap()
        for (source in sources) {
            val layerIDs = source.getLayerIDs()

            for (layerID in layerIDs) {
                layerToSourceMap[layerID] = source
            }
        }

        val layers = mapLibreMap!!.style!!.getLayers()
        for (i in layers.indices.reversed()) {
            val layerID = layers[i].getId()

            if (layerToSourceMap.containsKey(layerID)) {
                return layerToSourceMap[layerID]
            }
        }

        return null
    }

    fun sendRegionDidChangeEvent() {
        handleMapChangedEvent("onRegionDidChange", true)
        cameraChangeTracker.setReason(CameraChangeTracker.EMPTY)
    }

    private fun handleMapChangedEvent(
        eventName: String,
        withViewState: Boolean? = null,
    ) {
        val event =
            if (withViewState == true) {
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
            "MARKER_IMAGE_ID",
            BitmapFactory.decodeResource(
                this.resources,
                R.drawable.red_marker,
            ),
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
            offscreenAnnotationViewContainer!!.layoutParams = flParams
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
