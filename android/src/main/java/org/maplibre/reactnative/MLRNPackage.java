package org.maplibre.reactnative;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.maplibre.reactnative.components.annotation.MLRNCalloutManager;
import org.maplibre.reactnative.components.annotation.MLRNPointAnnotationManager;
import org.maplibre.reactnative.components.annotation.MLRNMarkerViewManager;
import org.maplibre.reactnative.components.camera.MLRNCameraManager;
import org.maplibre.reactnative.components.images.MLRNImagesManager;
import org.maplibre.reactnative.components.location.MLRNNativeUserLocationManager;
import org.maplibre.reactnative.components.mapview.MLRNMapViewManager;
import org.maplibre.reactnative.components.mapview.MLRNAndroidTextureMapViewManager;
import org.maplibre.reactnative.components.styles.layers.MLRNBackgroundLayerManager;
import org.maplibre.reactnative.components.styles.layers.MLRNCircleLayerManager;
import org.maplibre.reactnative.components.styles.layers.MLRNFillExtrusionLayerManager;
import org.maplibre.reactnative.components.styles.layers.MLRNFillLayerManager;
import org.maplibre.reactnative.components.styles.layers.MLRNHeatmapLayerManager;
import org.maplibre.reactnative.components.styles.layers.MLRNLineLayerManager;
import org.maplibre.reactnative.components.styles.layers.MLRNRasterLayerManager;
import org.maplibre.reactnative.components.styles.layers.MLRNSymbolLayerManager;
import org.maplibre.reactnative.components.styles.light.MLRNLightManager;
import org.maplibre.reactnative.components.styles.sources.MLRNImageSourceManager;
import org.maplibre.reactnative.components.styles.sources.MLRNRasterSourceManager;
import org.maplibre.reactnative.components.styles.sources.MLRNShapeSourceManager;
import org.maplibre.reactnative.components.styles.sources.MLRNVectorSourceManager;
import org.maplibre.reactnative.modules.MLRNLocationModule;
import org.maplibre.reactnative.modules.MLRNLogging;
import org.maplibre.reactnative.modules.MLRNModule;
import org.maplibre.reactnative.modules.MLRNOfflineModule;
import org.maplibre.reactnative.modules.MLRNSnapshotModule;

public class MLRNPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactApplicationContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new MLRNModule(reactApplicationContext));
        modules.add(new MLRNOfflineModule(reactApplicationContext));
        modules.add(new MLRNSnapshotModule(reactApplicationContext));
        modules.add(new MLRNLocationModule(reactApplicationContext));
        modules.add(new MLRNLogging(reactApplicationContext));

        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactApplicationContext) {
        List<ViewManager> managers = new ArrayList<>();

        // components
        managers.add(new MLRNCameraManager(reactApplicationContext));
        managers.add(new MLRNMapViewManager(reactApplicationContext));
        managers.add(new MLRNMarkerViewManager(reactApplicationContext));
        managers.add(new MLRNAndroidTextureMapViewManager(reactApplicationContext));
        managers.add(new MLRNLightManager());
        managers.add(new MLRNPointAnnotationManager(reactApplicationContext));
        managers.add(new MLRNCalloutManager());
        managers.add(new MLRNNativeUserLocationManager());

        // sources
        managers.add(new MLRNVectorSourceManager(reactApplicationContext));
        managers.add(new MLRNShapeSourceManager(reactApplicationContext));
        managers.add(new MLRNRasterSourceManager(reactApplicationContext));
        managers.add(new MLRNImageSourceManager());

        // images
        managers.add(new MLRNImagesManager(reactApplicationContext));

        // layers
        managers.add(new MLRNFillLayerManager());
        managers.add(new MLRNFillExtrusionLayerManager());
        managers.add(new MLRNHeatmapLayerManager());
        managers.add(new MLRNLineLayerManager());
        managers.add(new MLRNCircleLayerManager());
        managers.add(new MLRNSymbolLayerManager());
        managers.add(new MLRNRasterLayerManager());
        managers.add(new MLRNBackgroundLayerManager());

        return managers;
    }
}
