package org.maplibre.reactnative

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import org.maplibre.reactnative.components.annotation.MLRNCalloutManager
import org.maplibre.reactnative.components.annotation.MLRNMarkerViewManager
import org.maplibre.reactnative.components.annotation.MLRNPointAnnotationManager
import org.maplibre.reactnative.components.camera.MLRNCameraManager
import org.maplibre.reactnative.components.camera.MLRNCameraModule
import org.maplibre.reactnative.components.images.MLRNImagesManager
import org.maplibre.reactnative.components.location.MLRNNativeUserLocationManager
import org.maplibre.reactnative.components.mapview.MLRNAndroidTextureMapViewManager
import org.maplibre.reactnative.components.mapview.MLRNMapViewManager
import org.maplibre.reactnative.components.mapview.MLRNMapViewModule
import org.maplibre.reactnative.components.styles.layers.MLRNBackgroundLayerManager
import org.maplibre.reactnative.components.styles.layers.MLRNCircleLayerManager
import org.maplibre.reactnative.components.styles.layers.MLRNFillExtrusionLayerManager
import org.maplibre.reactnative.components.styles.layers.MLRNFillLayerManager
import org.maplibre.reactnative.components.styles.layers.MLRNHeatmapLayerManager
import org.maplibre.reactnative.components.styles.layers.MLRNLineLayerManager
import org.maplibre.reactnative.components.styles.layers.MLRNRasterLayerManager
import org.maplibre.reactnative.components.styles.layers.MLRNSymbolLayerManager
import org.maplibre.reactnative.components.styles.light.MLRNLightManager
import org.maplibre.reactnative.components.styles.sources.MLRNImageSourceManager
import org.maplibre.reactnative.components.styles.sources.MLRNRasterSourceManager
import org.maplibre.reactnative.components.styles.sources.MLRNShapeSourceManager
import org.maplibre.reactnative.components.styles.sources.MLRNVectorSourceManager
import org.maplibre.reactnative.modules.MLRNLocationModule
import org.maplibre.reactnative.modules.MLRNLogging
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


            MLRNOfflineModule.REACT_CLASS -> return MLRNOfflineModule(reactContext)
            MLRNSnapshotModule.NAME -> return MLRNSnapshotModule(reactContext)
            MLRNLocationModule.REACT_CLASS -> return MLRNLocationModule(reactContext)
            MLRNLogging.REACT_CLASS -> return MLRNLogging(reactContext)
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

            moduleInfos[MLRNOfflineModule.REACT_CLASS] = ReactModuleInfo(
                MLRNOfflineModule.REACT_CLASS,
                MLRNOfflineModule.REACT_CLASS,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = false
            )

            moduleInfos[MLRNSnapshotModule.NAME] = ReactModuleInfo(
                MLRNSnapshotModule.NAME,
                MLRNSnapshotModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )

            moduleInfos[MLRNLocationModule.REACT_CLASS] = ReactModuleInfo(
                MLRNLocationModule.REACT_CLASS,
                MLRNLocationModule.REACT_CLASS,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = false
            )

            moduleInfos[MLRNLogging.REACT_CLASS] = ReactModuleInfo(
                MLRNLogging.REACT_CLASS,
                MLRNLogging.REACT_CLASS,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = false
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
        managers.add(MLRNLightManager())
        managers.add(MLRNPointAnnotationManager(reactContext))
        managers.add(MLRNCalloutManager())
        managers.add(MLRNNativeUserLocationManager())

        // sources
        managers.add(MLRNVectorSourceManager(reactContext))
        managers.add(MLRNShapeSourceManager(reactContext))
        managers.add(MLRNRasterSourceManager(reactContext))
        managers.add(MLRNImageSourceManager())

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
