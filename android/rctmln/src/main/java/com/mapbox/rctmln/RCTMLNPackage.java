package com.mapbox.rctmln;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.mapbox.rctmln.components.annotation.RCTMLNCalloutManager;
import com.mapbox.rctmln.components.annotation.RCTMLNPointAnnotationManager;
import com.mapbox.rctmln.components.annotation.RCTMLNMarkerViewManager;
import com.mapbox.rctmln.components.camera.RCTMLNCameraManager;
import com.mapbox.rctmln.components.images.RCTMLNImagesManager;
import com.mapbox.rctmln.components.location.RCTMLNNativeUserLocationManager;
import com.mapbox.rctmln.components.mapview.RCTMLNMapViewManager;
import com.mapbox.rctmln.components.mapview.RCTMLNAndroidTextureMapViewManager;
import com.mapbox.rctmln.components.styles.layers.RCTMLNBackgroundLayerManager;
import com.mapbox.rctmln.components.styles.layers.RCTMLNCircleLayerManager;
import com.mapbox.rctmln.components.styles.layers.RCTMLNFillExtrusionLayerManager;
import com.mapbox.rctmln.components.styles.layers.RCTMLNFillLayerManager;
import com.mapbox.rctmln.components.styles.layers.RCTMLNHeatmapLayerManager;
import com.mapbox.rctmln.components.styles.layers.RCTMLNLineLayerManager;
import com.mapbox.rctmln.components.styles.layers.RCTMLNRasterLayerManager;
import com.mapbox.rctmln.components.styles.layers.RCTMLNSymbolLayerManager;
import com.mapbox.rctmln.components.styles.light.RCTMLNLightManager;
import com.mapbox.rctmln.components.styles.sources.RCTMLNImageSourceManager;
import com.mapbox.rctmln.components.styles.sources.RCTMLNRasterSourceManager;
import com.mapbox.rctmln.components.styles.sources.RCTMLNShapeSourceManager;
import com.mapbox.rctmln.components.styles.sources.RCTMLNVectorSourceManager;
import com.mapbox.rctmln.modules.RCTMLNLocationModule;
import com.mapbox.rctmln.modules.RCTMLNLogging;
import com.mapbox.rctmln.modules.RCTMLNModule;
import com.mapbox.rctmln.modules.RCTMLNOfflineModule;
import com.mapbox.rctmln.modules.RCTMLNSnapshotModule;

/**
 * Created by nickitaliano on 8/18/17.
 */

public class RCTMLNPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactApplicationContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new RCTMLNModule(reactApplicationContext));
        modules.add(new RCTMLNOfflineModule(reactApplicationContext));
        modules.add(new RCTMLNSnapshotModule(reactApplicationContext));
        modules.add(new RCTMLNLocationModule(reactApplicationContext));
        modules.add(new RCTMLNLogging(reactApplicationContext));

        return modules;
    }

    @Deprecated
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactApplicationContext) {
        List<ViewManager> managers = new ArrayList<>();

        // components
        managers.add(new RCTMLNCameraManager(reactApplicationContext));
        managers.add(new RCTMLNMapViewManager(reactApplicationContext));
        managers.add(new RCTMLNMarkerViewManager(reactApplicationContext));
        managers.add(new RCTMLNAndroidTextureMapViewManager(reactApplicationContext));
        managers.add(new RCTMLNLightManager());
        managers.add(new RCTMLNPointAnnotationManager(reactApplicationContext));
        managers.add(new RCTMLNCalloutManager());
        managers.add(new RCTMLNNativeUserLocationManager());

        // sources
        managers.add(new RCTMLNVectorSourceManager(reactApplicationContext));
        managers.add(new RCTMLNShapeSourceManager(reactApplicationContext));
        managers.add(new RCTMLNRasterSourceManager(reactApplicationContext));
        managers.add(new RCTMLNImageSourceManager());

        // images
        managers.add(new RCTMLNImagesManager(reactApplicationContext));

        // layers
        managers.add(new RCTMLNFillLayerManager());
        managers.add(new RCTMLNFillExtrusionLayerManager());
        managers.add(new RCTMLNHeatmapLayerManager());
        managers.add(new RCTMLNLineLayerManager());
        managers.add(new RCTMLNCircleLayerManager());
        managers.add(new RCTMLNSymbolLayerManager());
        managers.add(new RCTMLNRasterLayerManager());
        managers.add(new RCTMLNBackgroundLayerManager());

        return managers;
    }
}
