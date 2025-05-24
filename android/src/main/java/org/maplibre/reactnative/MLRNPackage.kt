package org.maplibre.reactnative

import android.util.Log
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
import org.maplibre.reactnative.components.images.MLRNImagesManager
import org.maplibre.reactnative.components.location.MLRNNativeUserLocationManager
import org.maplibre.reactnative.components.mapview.MLRNAndroidTextureMapViewManager
import org.maplibre.reactnative.components.mapview.MLRNMapViewManager
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


class MLRNPackage : BaseReactPackage() {
    override fun getModule(
        name: String,
        reactContext: ReactApplicationContext
    ): NativeModule? {
        Log.i("LOOKING FOR NAME", name)

        when (name) {
            MLRNModule.REACT_CLASS -> return MLRNModule(reactContext)
            MLRNOfflineModule.REACT_CLASS -> return MLRNOfflineModule(reactContext)
            MLRNSnapshotModule.REACT_CLASS -> return MLRNSnapshotModule(reactContext)
            MLRNLocationModule.REACT_CLASS -> return MLRNLocationModule(reactContext)
            MLRNLogging.REACT_CLASS -> return MLRNLogging(reactContext)
            ExampleModule.NAME -> return ExampleModule(reactContext)
        }

        return null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()

            moduleInfos[MLRNModule.REACT_CLASS] = ReactModuleInfo(
                MLRNModule.REACT_CLASS,
                MLRNModule.REACT_CLASS,
                false,  // canOverrideExistingModule
                false,  // needsEagerInit
                true,  // hasConstants
                false,  // isCxxModule
                false // isTurboModule
            )

            moduleInfos[MLRNOfflineModule.REACT_CLASS] = ReactModuleInfo(
                MLRNOfflineModule.REACT_CLASS,
                MLRNOfflineModule.REACT_CLASS,
                false,  // canOverrideExistingModule
                false,  // needsEagerInit
                true,  // hasConstants
                false,  // isCxxModule
                false // isTurboModule
            )

            moduleInfos[MLRNSnapshotModule.REACT_CLASS] = ReactModuleInfo(
                MLRNSnapshotModule.REACT_CLASS,
                MLRNSnapshotModule.REACT_CLASS,
                false,  // canOverrideExistingModule
                false,  // needsEagerInit
                true,  // hasConstants
                false,  // isCxxModule
                false // isTurboModule
            )

            moduleInfos[MLRNLocationModule.REACT_CLASS] = ReactModuleInfo(
                MLRNLocationModule.REACT_CLASS,
                MLRNLocationModule.REACT_CLASS,
                false,  // canOverrideExistingModule
                false,  // needsEagerInit
                true,  // hasConstants
                false,  // isCxxModule
                false // isTurboModule
            )

            moduleInfos[MLRNLogging.REACT_CLASS] = ReactModuleInfo(
                MLRNLogging.REACT_CLASS,
                MLRNLogging.REACT_CLASS,
                false,  // canOverrideExistingModule
                false,  // needsEagerInit
                true,  // hasConstants
                false,  // isCxxModule
                false // isTurboModule
            )

            moduleInfos[ExampleModule.NAME] = ReactModuleInfo(
                ExampleModule.NAME,
                ExampleModule.NAME,
                false,  // canOverrideExistingModule
                false,  // needsEagerInit
                false,  // isCxxModule
                true // isTurboModule
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
}
