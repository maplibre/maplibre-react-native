package org.maplibre.reactnative

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import org.maplibre.reactnative.components.annotations.MLRNCalloutManager
import org.maplibre.reactnative.components.annotations.MLRNMarkerViewManager
import org.maplibre.reactnative.components.annotations.MLRNPointAnnotationManager
import org.maplibre.reactnative.components.camera.MLRNCameraManager
import org.maplibre.reactnative.components.camera.MLRNCameraModule
import org.maplibre.reactnative.components.images.MLRNImagesManager
import org.maplibre.reactnative.components.layers.MLRNBackgroundLayerManager
import org.maplibre.reactnative.components.layers.MLRNCircleLayerManager
import org.maplibre.reactnative.components.layers.MLRNFillExtrusionLayerManager
import org.maplibre.reactnative.components.layers.MLRNFillLayerManager
import org.maplibre.reactnative.components.layers.MLRNHeatmapLayerManager
import org.maplibre.reactnative.components.layers.MLRNLineLayerManager
import org.maplibre.reactnative.components.layers.MLRNRasterLayerManager
import org.maplibre.reactnative.components.layers.MLRNSymbolLayerManager
import org.maplibre.reactnative.components.location.MLRNNativeUserLocationManager
import org.maplibre.reactnative.components.mapview.MLRNAndroidTextureMapViewManager
import org.maplibre.reactnative.components.mapview.MLRNMapViewManager
import org.maplibre.reactnative.components.mapview.MLRNMapViewModule
import org.maplibre.reactnative.components.sources.imagesource.MLRNImageSourceManager
import org.maplibre.reactnative.components.sources.shapesource.MLRNShapeSourceManager
import org.maplibre.reactnative.components.sources.shapesource.MLRNShapeSourceModule
import org.maplibre.reactnative.components.sources.tilesources.rastersource.MLRNRasterSourceManager
import org.maplibre.reactnative.components.sources.tilesources.vectorsource.MLRNVectorSourceManager
import org.maplibre.reactnative.components.sources.tilesources.vectorsource.MLRNVectorSourceModule
import org.maplibre.reactnative.modules.MLRNLocationModule
import org.maplibre.reactnative.modules.MLRNLogModule
import org.maplibre.reactnative.modules.MLRNModule
import org.maplibre.reactnative.modules.MLRNOfflineModule
import org.maplibre.reactnative.modules.MLRNSnapshotModule
import org.maplibre.reactnative.utils.ReactTagResolver

class MLRNPackage : BaseReactPackage() {
    override fun getModule(
        name: String,
        reactContext: ReactApplicationContext
    ): NativeModule? {
        when (name) {
            MLRNModule.REACT_CLASS -> return MLRNModule(reactContext)
            MLRNMapViewModule.NAME -> return MLRNMapViewModule(
                reactContext,
                getReactTagResolver(reactContext)
            )

            MLRNCameraModule.NAME -> return MLRNCameraModule(
                reactContext,
                getReactTagResolver(reactContext)
            )

            MLRNShapeSourceModule.NAME -> return MLRNShapeSourceModule(
                reactContext,
                getReactTagResolver(reactContext)
            )

            MLRNVectorSourceModule.NAME -> return MLRNVectorSourceModule(
                reactContext,
                getReactTagResolver(reactContext)
            )

            MLRNOfflineModule.NAME -> return MLRNOfflineModule(reactContext)
            MLRNSnapshotModule.NAME -> return MLRNSnapshotModule(reactContext)
            MLRNLocationModule.NAME -> return MLRNLocationModule(reactContext)
            MLRNLogModule.NAME -> return MLRNLogModule(reactContext)
        }

        return null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()

            moduleInfos[MLRNModule.REACT_CLASS] = ReactModuleInfo(
                MLRNModule.REACT_CLASS,
                MLRNModule.REACT_CLASS,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = false
            )

            moduleInfos[MLRNMapViewModule.NAME] = ReactModuleInfo(
                MLRNMapViewModule.NAME,
                MLRNMapViewModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )

            moduleInfos[MLRNCameraModule.NAME] = ReactModuleInfo(
                MLRNCameraModule.NAME,
                MLRNCameraModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )

            moduleInfos[MLRNShapeSourceModule.NAME] = ReactModuleInfo(
                MLRNShapeSourceModule.NAME,
                MLRNShapeSourceModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )

            moduleInfos[MLRNVectorSourceModule.NAME] = ReactModuleInfo(
                MLRNVectorSourceModule.NAME,
                MLRNVectorSourceModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )

            moduleInfos[MLRNOfflineModule.NAME] = ReactModuleInfo(
                MLRNOfflineModule.NAME,
                MLRNOfflineModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )

            moduleInfos[MLRNSnapshotModule.NAME] = ReactModuleInfo(
                MLRNSnapshotModule.NAME,
                MLRNSnapshotModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )

            moduleInfos[MLRNLocationModule.NAME] = ReactModuleInfo(
                MLRNLocationModule.NAME,
                MLRNLocationModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )

            moduleInfos[MLRNLogModule.NAME] = ReactModuleInfo(
                MLRNLogModule.NAME,
                MLRNLogModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )

            moduleInfos
        }
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        val managers: MutableList<ViewManager<*, *>> = ArrayList()

        // components
        managers.add(MLRNCameraManager(reactContext))
        managers.add(MLRNMapViewManager(reactContext))
        managers.add(MLRNMarkerViewManager(reactContext))
        managers.add(MLRNAndroidTextureMapViewManager(reactContext))
        managers.add(MLRNPointAnnotationManager(reactContext))
        managers.add(MLRNCalloutManager())
        managers.add(MLRNNativeUserLocationManager())

        // sources
        managers.add(MLRNImageSourceManager(reactContext))
        managers.add(MLRNShapeSourceManager(reactContext))
        managers.add(MLRNRasterSourceManager(reactContext))
        managers.add(MLRNVectorSourceManager(reactContext))

        // images
        managers.add(MLRNImagesManager(reactContext))

        // layers
        managers.add(MLRNFillLayerManager())
        managers.add(MLRNFillExtrusionLayerManager())
        managers.add(MLRNHeatmapLayerManager())
        managers.add(MLRNLineLayerManager())
        managers.add(MLRNCircleLayerManager())
        managers.add(MLRNSymbolLayerManager())
        managers.add(MLRNRasterLayerManager())
        managers.add(MLRNBackgroundLayerManager())

        return managers
    }

    private var reactTagResolver: ReactTagResolver? = null

    private fun getReactTagResolver(context: ReactApplicationContext): ReactTagResolver {
        val reactTagResolver = reactTagResolver
        if (reactTagResolver == null) {
            val result = ReactTagResolver(context)
            this.reactTagResolver = result
            return result
        }
        return reactTagResolver
    }
}
