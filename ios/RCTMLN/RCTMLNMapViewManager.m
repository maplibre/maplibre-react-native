//
//  RCTMLNMapViewManager.m
//  RCTMLN
//
//  Created by Nick Italiano on 8/23/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <React/RCTUIManager.h>

#import "RCTMLNMapViewManager.h"
#import "RCTMLNMapView.h"
#import "RCTMLNEventTypes.h"
#import "RCTMLNEvent.h"
#import "RCTMLNMapTouchEvent.h"
#import "RCTMLNUtils.h"
#import "CameraStop.h"
#import "CameraUpdateQueue.h"
#import "RCTMLNUserLocation.h"
#import "FilterParser.h"
#import "RCTMLNImages.h"

@interface RCTMLNMapViewManager() <MLNMapViewDelegate>
@end

@implementation RCTMLNMapViewManager


RCT_EXPORT_MODULE(RCTMLNMapView)

- (BOOL)requiresMainQueueSetup
{
    return YES;
}

// prevents SDK from crashing and cluttering logs
// since we don't have access to the frame right away
- (CGRect)defaultFrame
{
    return [[UIScreen mainScreen] bounds];
}

- (UIView *)view
{
    RCTMLNMapView *mapView = [[RCTMLNMapView alloc] initWithFrame:[self defaultFrame]];
    mapView.delegate = self;


    // setup map gesture recongizers
    UITapGestureRecognizer *doubleTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:nil];
    doubleTap.numberOfTapsRequired = 2;
    
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(didTapMap:)];
    [tap requireGestureRecognizerToFail:doubleTap];
    
    UILongPressGestureRecognizer *longPress = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(didLongPressMap:)];
    
    // this allows the internal annotation gestures to take precedents over the map tap gesture
    for (int i = 0; i < mapView.gestureRecognizers.count; i++) {
        UIGestureRecognizer *gestuerReconginer = mapView.gestureRecognizers[i];
        
        if ([gestuerReconginer isKindOfClass:[UITapGestureRecognizer class]]) {
            [tap requireGestureRecognizerToFail:gestuerReconginer];
        }
    }
    
    [mapView addGestureRecognizer:doubleTap];
    [mapView addGestureRecognizer:tap];
    [mapView addGestureRecognizer:longPress];
    
    return mapView;
}

#pragma mark - React View Props

RCT_REMAP_VIEW_PROPERTY(localizeLabels, reactLocalizeLabels, BOOL)
RCT_REMAP_VIEW_PROPERTY(scrollEnabled, reactScrollEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(pitchEnabled, reactPitchEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(rotateEnabled, reactRotateEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(attributionEnabled, reactAttributionEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(attributionPosition, reactAttributionPosition, NSDictionary)
RCT_REMAP_VIEW_PROPERTY(logoEnabled, reactLogoEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(logoPosition, reactLogoPosition, NSDictionary)
RCT_REMAP_VIEW_PROPERTY(compassEnabled, reactCompassEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(zoomEnabled, reactZoomEnabled, BOOL)

RCT_REMAP_VIEW_PROPERTY(compassViewPosition, reactCompassViewPosition, NSInteger *)
RCT_REMAP_VIEW_PROPERTY(compassViewMargins, reactCompassViewMargins, CGPoint)

RCT_REMAP_VIEW_PROPERTY(contentInset, reactContentInset, NSArray)
RCT_REMAP_VIEW_PROPERTY(styleURL, reactStyleURL, NSString)
RCT_REMAP_VIEW_PROPERTY(preferredFramesPerSecond, reactPreferredFramesPerSecond, NSInteger)

RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLongPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMapChange, RCTBubblingEventBlock)

#pragma mark - React Methods

RCT_EXPORT_METHOD(getPointInView:(nonnull NSNumber*)reactTag
                  atCoordinate:(NSArray<NSNumber*>*)coordinate
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        id view = viewRegistry[reactTag];
        
        if (![view isKindOfClass:[RCTMLNMapView class]]) {
            RCTLogError(@"Invalid react tag, could not find RCTMLNMapView");
            return;
        }
        
        RCTMLNMapView *reactMapView = (RCTMLNMapView*)view;

        CGPoint pointInView = [reactMapView convertCoordinate:CLLocationCoordinate2DMake([coordinate[1] doubleValue], [coordinate[0] doubleValue])
                                                 toPointToView:reactMapView];

        resolve(@{ @"pointInView": @[@(pointInView.x), @(pointInView.y)] });
    }];
}

RCT_EXPORT_METHOD(getCoordinateFromView:(nonnull NSNumber*)reactTag
                  atPoint:(CGPoint)point
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
    id view = viewRegistry[reactTag];
    
    if (![view isKindOfClass:[RCTMLNMapView class]]) {
      RCTLogError(@"Invalid react tag, could not find RCTMLNMapView");
      return;
    }
    
    RCTMLNMapView *reactMapView = (RCTMLNMapView*)view;
    
    CLLocationCoordinate2D coordinate = [reactMapView convertPoint:point
                                            toCoordinateFromView:reactMapView];
    
    resolve(@{ @"coordinateFromView": @[@(coordinate.longitude), @(coordinate.latitude)] });
  }];
}


RCT_EXPORT_METHOD(takeSnap:(nonnull NSNumber*)reactTag
                  writeToDisk:(BOOL)writeToDisk
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        id view = viewRegistry[reactTag];
        
        if (![view isKindOfClass:[RCTMLNMapView class]]) {
            RCTLogError(@"Invalid react tag, could not find RCTMLNMapView");
            return;
        }
        
        RCTMLNMapView *reactMapView = (RCTMLNMapView*)view;
        NSString *uri = [reactMapView takeSnap:writeToDisk];
        resolve(@{ @"uri": uri });
    }];
}

RCT_EXPORT_METHOD(getVisibleBounds:(nonnull NSNumber*)reactTag
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        id view = viewRegistry[reactTag];
        
        if (![view isKindOfClass:[RCTMLNMapView class]]) {
            RCTLogError(@"Invalid react tag, could not find RCTMLNMapView");
            return;
        }
        
        RCTMLNMapView *reactMapView = (RCTMLNMapView*)view;
        resolve(@{ @"visibleBounds": [RCTMLNUtils fromCoordinateBounds:reactMapView.visibleCoordinateBounds] });
    }];
}

RCT_EXPORT_METHOD(getZoom:(nonnull NSNumber*)reactTag
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        id view = viewRegistry[reactTag];

        if (![view isKindOfClass:[RCTMLNMapView class]]) {
            RCTLogError(@"Invalid react tag, could not find RCTMLNMapView");
            return;
        }

        RCTMLNMapView *reactMapView = (RCTMLNMapView*)view;
        resolve(@{ @"zoom": @(reactMapView.zoomLevel) });
    }];
}

RCT_EXPORT_METHOD(getCenter:(nonnull NSNumber*)reactTag
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        id view = viewRegistry[reactTag];

        if (![view isKindOfClass:[RCTMLNMapView class]]) {
            RCTLogError(@"Invalid react tag, could not find RCTMLNMapView");
            return;
        }

        RCTMLNMapView *reactMapView = (RCTMLNMapView*)view;
        resolve(@{ @"center": @[@(reactMapView.centerCoordinate.longitude), @(reactMapView.centerCoordinate.latitude)]});
    }];
}

RCT_EXPORT_METHOD(queryRenderedFeaturesAtPoint:(nonnull NSNumber*)reactTag
                  atPoint:(NSArray<NSNumber*>*)point
                  withFilter:(NSArray*)filter
                  withLayerIDs:(NSArray<NSString*>*)layerIDs
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        id view = viewRegistry[reactTag];
        
        if (![view isKindOfClass:[RCTMLNMapView class]]) {
            RCTLogError(@"Invalid react tag, could not find RCTMLNMapView");
            return;
        }
        
        NSSet *layerIDSet = nil;
        if (layerIDs != nil && layerIDs.count > 0) {
            layerIDSet = [NSSet setWithArray:layerIDs];
        }
        
        RCTMLNMapView *reactMapView = (RCTMLNMapView*)view;
        NSPredicate* predicate = [FilterParser parse:filter];
        NSArray<id<MLNFeature>> *shapes = [reactMapView visibleFeaturesAtPoint:CGPointMake([point[0] floatValue], [point[1] floatValue])
                                                        inStyleLayersWithIdentifiers:layerIDSet
                                                        predicate:predicate];
        
        NSMutableArray<NSDictionary*> *features = [[NSMutableArray alloc] init];
        for (int i = 0; i < shapes.count; i++) {
            [features addObject:shapes[i].geoJSONDictionary];
        }

        resolve(@{
          @"data": @{ @"type": @"FeatureCollection", @"features": features }
        });
    }];
}

RCT_EXPORT_METHOD(queryRenderedFeaturesInRect:(nonnull NSNumber*)reactTag
                  withBBox:(NSArray<NSNumber*>*)bbox
                  withFilter:(NSArray*)filter
                  withLayerIDs:(NSArray<NSString*>*)layerIDs
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        id view = viewRegistry[reactTag];
        
        if (![view isKindOfClass:[RCTMLNMapView class]]) {
            RCTLogError(@"Invalid react tag, could not find RCTMLNMapView");
            return;
        }
        
        RCTMLNMapView *reactMapView = (RCTMLNMapView*)view;
        
        // bbox[top, right, bottom, left]
        CGFloat width = [bbox[1] floatValue] - [bbox[3] floatValue];
        CGFloat height = [bbox[0] floatValue] - [bbox[2] floatValue];
        CGRect rect = CGRectMake([bbox[3] floatValue], [bbox[2] floatValue], width, height);
        
        NSSet *layerIDSet = nil;
        if (layerIDs != nil && layerIDs.count > 0) {
            layerIDSet = [NSSet setWithArray:layerIDs];
        }
        
        NSPredicate* predicate = [FilterParser parse:filter];
        NSArray<id<MLNFeature>> *shapes = [reactMapView visibleFeaturesInRect:rect
                                                        inStyleLayersWithIdentifiers:layerIDSet
                                                        predicate:predicate];
        
        NSArray<NSDictionary*>* features = [self featuresToJSON:shapes];
        
        resolve(@{ @"data": @{ @"type": @"FeatureCollection", @"features": features }});
    }];
}

RCT_EXPORT_METHOD(showAttribution:(nonnull NSNumber *)reactTag
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        id view = viewRegistry[reactTag];
        
        if (![view isKindOfClass:[RCTMLNMapView class]]) {
            RCTLogError(@"Invalid react tag, could not find RCTMLNMapView");
            return;
        }
        
        __weak RCTMLNMapView *reactMapView = (RCTMLNMapView*)view;
        [reactMapView showAttribution:reactMapView];
        resolve(nil);
    }];
}

RCT_EXPORT_METHOD(setSourceVisibility:(nonnull NSNumber *)reactTag
                  visible:(BOOL)visible
                  sourceId:(nonnull NSString*)sourceId
                  sourceLayerId:(nullable NSString*)sourceLayerId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        id view = viewRegistry[reactTag];
        
        if (![view isKindOfClass:[RCTMLNMapView class]]) {
            RCTLogError(@"Invalid react tag, could not find RCTMLNMapView");
            return;
        }
        
        __weak RCTMLNMapView *reactMapView = (RCTMLNMapView*)view;
        [reactMapView setSourceVisibility:visible sourceId:sourceId sourceLayerId:sourceLayerId];
        resolve(nil);
    }];
}

#pragma mark - UIGestureRecognizers

- (void)didTapMap:(UITapGestureRecognizer *)recognizer
{
    RCTMLNMapView *mapView = (RCTMLNMapView*)recognizer.view;    
    CGPoint screenPoint = [recognizer locationInView:mapView];
    NSArray<RCTMLNSource *> *touchableSources = [mapView getAllTouchableSources];
    
    NSMutableDictionary<NSString *, NSArray<id<MLNFeature>>* > *hits = [[NSMutableDictionary alloc] init];
    NSMutableArray<RCTMLNSource *> *hitTouchableSources = [[NSMutableArray alloc] init];
    for (RCTMLNSource *touchableSource in touchableSources) {
        NSDictionary<NSString *, NSNumber *> *hitbox = touchableSource.hitbox;
        float halfWidth = [hitbox[@"width"] floatValue] / 2.f;
        float halfHeight = [hitbox[@"height"] floatValue] / 2.f;
        
        CGFloat top = screenPoint.y - halfHeight;
        CGFloat left = screenPoint.x - halfWidth;
        CGRect hitboxRect = CGRectMake(left, top, [hitbox[@"width"] floatValue], [hitbox[@"height"] floatValue]);
        
        NSArray<id<MLNFeature>> *features = [mapView visibleFeaturesInRect:hitboxRect
                                                     inStyleLayersWithIdentifiers:[NSSet setWithArray:[touchableSource getLayerIDs]]
                                                     predicate:nil];
        
        if (features.count > 0) {
            hits[touchableSource.id] = features;
            [hitTouchableSources addObject:touchableSource];
        }
    }
    
    if (hits.count > 0) {
        RCTMLNSource *source = [mapView getTouchableSourceWithHighestZIndex:hitTouchableSources];
        if (source != nil && source.hasPressListener) {
            NSArray* geoJSONDicts = [self featuresToJSON: hits[source.id]];
            
            NSString *eventType = RCT_MAPBOX_VECTOR_SOURCE_LAYER_PRESS;
            if ([source isKindOfClass:[RCTMLNShapeSource class]]) {
                eventType = RCT_MAPBOX_SHAPE_SOURCE_LAYER_PRESS;
            }

            CLLocationCoordinate2D coordinate = [mapView convertPoint:screenPoint
                                                    toCoordinateFromView:mapView];
            
            RCTMLNEvent *event = [RCTMLNEvent makeEvent:eventType withPayload: @{
                @"features": geoJSONDicts,
                @"point": @{
                        @"x": [NSNumber numberWithDouble: screenPoint.x],
                        @"y":[NSNumber numberWithDouble: screenPoint.y]
                },
                @"coordinates": @{
                        @"latitude": [NSNumber numberWithDouble: coordinate.latitude],
                        @"longitude": [NSNumber numberWithDouble: coordinate.longitude]
                }
            }];
            [self fireEvent:event withCallback:source.onPress];
            return;
        }
    }
    
    if (mapView.onPress == nil) {
        return;
    }
    
    RCTMLNMapTouchEvent *event = [RCTMLNMapTouchEvent makeTapEvent:mapView withPoint:screenPoint];
    [self fireEvent:event withCallback:mapView.onPress];
}

- (void)didLongPressMap:(UILongPressGestureRecognizer *)recognizer
{
    RCTMLNMapView *mapView = (RCTMLNMapView*)recognizer.view;
    
    if (mapView == nil || mapView.onPress == nil || recognizer.state != UIGestureRecognizerStateBegan) {
        return;
    }
    
    RCTMLNMapTouchEvent *event = [RCTMLNMapTouchEvent makeLongPressEvent:mapView withPoint:[recognizer locationInView:mapView]];
    [self fireEvent:event withCallback:mapView.onLongPress];
}

#pragma mark - MLNMapViewDelegate

- (MLNAnnotationView *)mapView:(MLNMapView *)mapView viewForAnnotation:(id<MLNAnnotation>)annotation
{
    if ([annotation isKindOfClass:[MLNUserLocation class]] && mapView.userLocation != nil) {
        RCTMLNMapView* reactMapView = ((RCTMLNMapView *) mapView);
        if (reactMapView.useNativeUserLocationAnnotationView) {
            return nil;
        }
        return [[RCTMLNUserLocation sharedInstance] hiddenUserAnnotation];
    }
    else if ([annotation isKindOfClass:[RCTMLNPointAnnotation class]]) {
        RCTMLNPointAnnotation *rctAnnotation = (RCTMLNPointAnnotation *)annotation;
        return [rctAnnotation getAnnotationView];
    }
    return nil;
}

- (void)mapView:(MLNMapView *)mapView didChangeUserTrackingMode:(MLNUserTrackingMode)mode animated:(BOOL)animated
{
    RCTMLNMapView* reactMapView = ((RCTMLNMapView *) mapView);
    [reactMapView didChangeUserTrackingMode:mode animated:animated];
}

- (void)mapView:(MLNMapView *)mapView didSelectAnnotation:(nonnull id<MLNAnnotation>)annotation
{
    if ([annotation isKindOfClass:[RCTMLNPointAnnotation class]]) {
        RCTMLNPointAnnotation *rctAnnotation = (RCTMLNPointAnnotation *)annotation;
        
        if (rctAnnotation.onSelected != nil) {
            RCTMLNMapTouchEvent *event = [RCTMLNMapTouchEvent makeAnnotationTapEvent:rctAnnotation];
            rctAnnotation.onSelected([event toJSON]);
        }
    }
}

- (void)mapView:(MLNMapView *)mapView didDeselectAnnotation:(nonnull id<MLNAnnotation>)annotation
{
    if ([annotation isKindOfClass:[RCTMLNPointAnnotation class]]) {
        RCTMLNPointAnnotation *rctAnnotation = (RCTMLNPointAnnotation *)annotation;
        
        if (rctAnnotation.onDeselected != nil) {
            rctAnnotation.onDeselected(nil);
        }
    }
}

- (BOOL)mapView:(MLNMapView *)mapView annotationCanShowCallout:(id<MLNAnnotation>)annotation {
    if ([annotation isKindOfClass:[RCTMLNPointAnnotation class]]) {
        RCTMLNPointAnnotation *rctAnnotation = (RCTMLNPointAnnotation *)annotation;
        return rctAnnotation.calloutView != nil;
    }
    return NO;
}

- (UIView<MLNCalloutView> *)mapView:(MLNMapView *)mapView calloutViewForAnnotation:(id<MLNAnnotation>)annotation
{
    if ([annotation isKindOfClass:[RCTMLNPointAnnotation class]]) {
        RCTMLNPointAnnotation *rctAnnotation = (RCTMLNPointAnnotation *)annotation;
        return rctAnnotation.calloutView;
    }
    return nil;
}

- (BOOL)mapView:(MLNMapView *)mapView shouldChangeFromCamera:(MLNMapCamera *)oldCamera toCamera:(MLNMapCamera *)newCamera 
{
    RCTMLNMapView* reactMapView = ((RCTMLNMapView *) mapView);
    return MLNCoordinateBoundsIsEmpty(reactMapView.maxBounds) || MLNCoordinateInCoordinateBounds(newCamera.centerCoordinate, reactMapView.maxBounds);
}

- (void)mapView:(MLNMapView *)mapView regionWillChangeWithReason:(MLNCameraChangeReason)reason animated:(BOOL)animated
{
    ((RCTMLNMapView *) mapView).isUserInteraction = (BOOL)(reason & ~MLNCameraChangeReasonProgrammatic);
    NSDictionary *payload = [self _makeRegionPayload:mapView animated:animated];
    [self reactMapDidChange:mapView eventType:RCT_MAPBOX_REGION_WILL_CHANGE_EVENT andPayload:payload];
}

- (void)mapViewRegionIsChanging:(MLNMapView *)mapView
{
    NSDictionary *payload = [self _makeRegionPayload:mapView animated:false];
    [self reactMapDidChange:mapView eventType:RCT_MAPBOX_REGION_IS_CHANGING andPayload:payload];
}

- (void)mapView:(MLNMapView *)mapView regionDidChangeWithReason:(MLNCameraChangeReason)reason animated:(BOOL)animated
{    
    if (((reason & MLNCameraChangeReasonTransitionCancelled) == MLNCameraChangeReasonTransitionCancelled)
        && ((reason & MLNCameraChangeReasonGesturePan) != MLNCameraChangeReasonGesturePan)) return;

    ((RCTMLNMapView *) mapView).isUserInteraction = (BOOL)(reason & ~MLNCameraChangeReasonProgrammatic);
    
    NSDictionary *payload = [self _makeRegionPayload:mapView animated:animated];
    [self reactMapDidChange:mapView eventType:RCT_MAPBOX_REGION_DID_CHANGE andPayload:payload];
}

- (void)mapViewWillStartLoadingMap:(MLNMapView *)mapView
{
    [self reactMapDidChange:mapView eventType:RCT_MAPBOX_WILL_START_LOADING_MAP];
}

- (void)mapViewDidFinishLoadingMap:(MLNMapView *)mapView
{
    [self reactMapDidChange:mapView eventType:RCT_MAPBOX_DID_FINISH_LOADING_MAP];
}

- (void)mapViewDidFailLoadingMap:(MLNMapView *)mapView withError:(NSError *)error
{
    NSLog(@"Failed loading map %@", error);
    [self reactMapDidChange:mapView eventType:RCT_MAPBOX_DID_FAIL_LOADING_MAP];
}

- (void)mapViewWillStartRenderingFrame:(MLNMapView *)mapView
{
    [self reactMapDidChange:mapView eventType:RCT_MAPBOX_WILL_START_RENDERING_FRAME];
}

- (void)mapViewDidFinishRenderingFrame:(MLNMapView *)mapView fullyRendered:(BOOL)fullyRendered
{
    if (fullyRendered) {
        [self reactMapDidChange:mapView eventType:RCT_MAPBOX_DID_FINISH_RENDERING_FRAME_FULLY];
    } else {
        [self reactMapDidChange:mapView eventType:RCT_MAPBOX_DID_FINSIH_RENDERING_FRAME];
    }
}

- (void)mapViewWillStartRenderingMap:(MLNMapView *)mapView
{
    [self reactMapDidChange:mapView eventType:RCT_MAPBOX_WILL_START_RENDERING_MAP];
}

- (void)mapViewDidFinishRenderingMap:(MLNMapView *)mapView fullyRendered:(BOOL)fullyRendered
{
    if (fullyRendered) {
        [self reactMapDidChange:mapView eventType:RCT_MAPBOX_DID_FINISH_RENDERING_MAP_FULLY];
    } else {
        [self reactMapDidChange:mapView eventType:RCT_MAPBOX_DID_FINISH_RENDERING_MAP];
    }
}

- (void)mapView:(MLNMapView *)mapView didFinishLoadingStyle:(MLNStyle *)style
{
    RCTMLNMapView *reactMapView = (RCTMLNMapView*)mapView;
    if(reactMapView.reactLocalizeLabels == true) {
        [style localizeLabelsIntoLocale:nil];
    }
    
    for (int i = 0; i < reactMapView.sources.count; i++) {
        RCTMLNSource *source = reactMapView.sources[i];
        source.map = reactMapView;
    }
    for (int i = 0; i < reactMapView.layers.count; i++) {
        RCTMLNLayer *layer = reactMapView.layers[i];
        layer.map = reactMapView;
    }
    
    if (reactMapView.light != nil) {
        reactMapView.light.map = reactMapView;
    }
    
    [reactMapView notifyStyleLoaded];
    [self reactMapDidChange:reactMapView eventType:RCT_MAPBOX_DID_FINISH_LOADING_STYLE];
}

-(UIImage *)mapView:(MLNMapView *)mapView didFailToLoadImage:(NSString *)imageName
{
    RCTMLNMapView* reactMapView = ((RCTMLNMapView *) mapView);
    NSArray<RCTMLNImages *> *allImages = [reactMapView getAllImages];
    for (RCTMLNImages *images in allImages) {
        if([images addMissingImageToStyle:imageName]) {
            // The image was added inside addMissingImageToStyle so we can return nil
            return nil;
        }
    }
    
    for (RCTMLNImages *images in allImages) {
        [images sendImageMissingEvent:imageName];
    }
    return nil;
}

- (void)reactMapDidChange:(MLNMapView*)mapView eventType:(NSString*)type
{
    [self reactMapDidChange:mapView eventType:type andPayload:nil];
}

- (void)reactMapDidChange:(MLNMapView*)mapView eventType:(NSString*)type andPayload:(NSDictionary*)payload
{
    RCTMLNMapView *reactMapView = (RCTMLNMapView*)mapView;
    RCTMLNEvent *event = [RCTMLNEvent makeEvent:type withPayload:payload];
    [self fireEvent:event withCallback:reactMapView.onMapChange];
}

- (NSDictionary*)_makeRegionPayload:(MLNMapView*)mapView animated:(BOOL)animated
{
    RCTMLNMapView *rctMapView = (RCTMLNMapView *)mapView;
    MLNPointFeature *feature = [[MLNPointFeature alloc] init];
    feature.coordinate = mapView.centerCoordinate;
    feature.attributes = @{
                            @"zoomLevel": [NSNumber numberWithDouble:mapView.zoomLevel],
                            @"heading": [NSNumber numberWithDouble:mapView.camera.heading],
                            @"pitch": [NSNumber numberWithDouble:mapView.camera.pitch],
                            @"animated": [NSNumber numberWithBool:animated],
                            @"isUserInteraction": @(rctMapView.isUserInteraction),
                            @"visibleBounds": [RCTMLNUtils fromCoordinateBounds:mapView.visibleCoordinateBounds]
                         };
    return feature.geoJSONDictionary;
}

- (NSArray<NSDictionary*> *) featuresToJSON:(NSArray<id<MLNFeature>> *) features
{
    NSMutableArray<NSDictionary*> *json = [[NSMutableArray alloc] init];
     for(id<MLNFeature> feature in features) {
        [json addObject:feature.geoJSONDictionary];
    }
    return json;
}

@end
