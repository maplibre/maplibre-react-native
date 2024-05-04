//
//  RCTMLNMapView.h
//  RCTMLN
//
//  Created by Nick Italiano on 8/23/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <React/RCTComponent.h>
#import "RCTMLNSource.h"
#import "RCTMLNShapeSource.h"
#import "RCTMLNPointAnnotation.h"
#import "RCTMLNLight.h"

@import MapLibre;

@class CameraUpdateQueue;
@class RCTMLNImages;
@class RCTMLNLogging;

@protocol RCTMLNMapViewCamera<NSObject>
- (void)initialLayout;
- (void)didChangeUserTrackingMode:(MLNUserTrackingMode)mode animated:(BOOL)animated;
@end

typedef void (^FoundLayerBlock) (MLNStyleLayer* __nonnull layer);
typedef void (^StyleLoadedBlock) (MLNStyle* __nonnull style);

@interface RCTMLNMapView : MLNMapView<RCTInvalidating>

@property (nonatomic, strong, nonnull) RCTMLNLogging* logging;
@property (nonatomic, strong) CameraUpdateQueue *cameraUpdateQueue;
@property (nonatomic, weak) id<RCTMLNMapViewCamera> reactCamera;
@property (nonatomic, strong) NSMutableArray<id<RCTComponent>> *reactSubviews;
@property (nonatomic, strong) NSMutableArray<RCTMLNSource*> *sources;
@property (nonatomic, strong) NSMutableArray<RCTMLNImages*> *images;
@property (nonatomic, strong) NSMutableArray<RCTMLNLayer*> *layers;
@property (nonatomic, strong) NSMutableArray<RCTMLNPointAnnotation*> *pointAnnotations;
@property (nonatomic, strong) RCTMLNLight *light;
@property (nonatomic, copy) NSArray<NSNumber *> *reactContentInset;

@property (nonatomic, strong) NSMutableDictionary<NSString*, NSMutableArray<FoundLayerBlock>*> *layerWaiters;
@property (nonatomic, strong) NSMutableArray<StyleLoadedBlock> *styleWaiters;

@property (nonatomic, assign) BOOL reactLocalizeLabels;
@property (nonatomic, assign) BOOL reactScrollEnabled;
@property (nonatomic, assign) BOOL reactPitchEnabled;
@property (nonatomic, assign) BOOL reactRotateEnabled;
@property (nonatomic, assign) BOOL reactAttributionEnabled;
@property (nonatomic, strong) NSDictionary<NSString *, NSNumber *> *reactAttributionPosition;
@property (nonatomic, assign) BOOL reactLogoEnabled;
@property (nonatomic, assign) BOOL reactCompassEnabled;
@property (nonatomic, assign) BOOL reactZoomEnabled;

@property (nonatomic, assign) NSInteger *reactCompassViewPosition;
@property (nonatomic, assign) CGPoint reactCompassViewMargins;

@property (nonatomic, copy) NSString *reactStyleURL;
@property (nonatomic, assign) NSInteger reactPreferredFramesPerSecond;

@property (nonatomic, assign) MLNCoordinateBounds maxBounds;

@property (nonatomic, assign) BOOL isUserInteraction;
@property (nonatomic, assign) BOOL useNativeUserLocationAnnotationView;

@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@property (nonatomic, copy) RCTBubblingEventBlock onLongPress;
@property (nonatomic, copy) RCTBubblingEventBlock onMapChange;


- (void)layerAdded:(MLNStyleLayer*) layer;

- (CLLocationDistance)getMetersPerPixelAtLatitude:(double)latitude withZoom:(double)zoomLevel;
- (CLLocationDistance)altitudeFromZoom:(double)zoomLevel;
- (CLLocationDistance)altitudeFromZoom:(double)zoomLevel atLatitude:(CLLocationDegrees)latitude;
- (CLLocationDistance)altitudeFromZoom:(double)zoomLevel atLatitude:(CLLocationDegrees)latitude atPitch:(CGFloat)pitch;
- (RCTMLNPointAnnotation*)getRCTPointAnnotation:(MLNPointAnnotation*)mlnAnnotation;
- (NSArray<RCTMLNSource *> *)getAllTouchableSources;
- (NSArray<RCTMLNSource *> *)getAllShapeSources;
- (NSArray<RCTMLNImages *> *)getAllImages;
- (RCTMLNSource *)getTouchableSourceWithHighestZIndex:(NSArray<RCTMLNSource *> *)touchableSources;
- (NSString *)takeSnap:(BOOL)writeToDisk;
- (void)didChangeUserTrackingMode:(MLNUserTrackingMode)mode animated:(BOOL)animated;

- (void)waitForLayerWithID:(nonnull NSString*)layerID then:(void (^ _Nonnull)(MLNStyleLayer* _Nonnull layer))foundLayer;

- (void)setSourceVisibility:(BOOL)visiblity sourceId:(nonnull NSString*)sourceId sourceLayerId:(nullable NSString*)sourceLayerId;

- (void)notifyStyleLoaded;

@end
