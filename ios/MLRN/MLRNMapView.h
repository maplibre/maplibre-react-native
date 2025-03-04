#import <React/RCTComponent.h>
#import "MLRNLight.h"
#import "MLRNPointAnnotation.h"
#import "MLRNShapeSource.h"
#import "MLRNSource.h"

@import MapLibre;

@class CameraUpdateQueue;
@class MLRNImages;
@class MLRNLogging;

@protocol MLRNMapViewCamera <NSObject>
- (void)initialLayout;
- (void)didChangeUserTrackingMode:(MLNUserTrackingMode)mode animated:(BOOL)animated;
@end

typedef void (^FoundLayerBlock)(MLNStyleLayer *__nonnull layer);
typedef void (^StyleLoadedBlock)(MLNStyle *__nonnull style);

@interface MLRNMapView : MLNMapView <RCTInvalidating>

@property (nonatomic, strong, nonnull) MLRNLogging *logging;
@property (nonatomic, strong, nonnull) CameraUpdateQueue *cameraUpdateQueue;
@property (nonatomic, weak) id<MLRNMapViewCamera> reactCamera;
@property (nonatomic, strong, nonnull) NSMutableArray<id<RCTComponent>> *reactSubviews;
@property (nonatomic, strong, nonnull) NSMutableArray<MLRNSource *> *sources;
@property (nonatomic, strong, nonnull) NSMutableArray<MLRNImages *> *images;
@property (nonatomic, strong, nonnull) NSMutableArray<MLRNLayer *> *layers;
@property (nonatomic, strong, nonnull) NSMutableArray<MLRNPointAnnotation *> *pointAnnotations;
@property (nonatomic, strong, nullable) MLRNLight *light;
@property (nonatomic, copy, nullable) NSArray<NSNumber *> *reactContentInset;

@property (nonatomic, strong, nonnull)
    NSMutableDictionary<NSString *, NSMutableArray<FoundLayerBlock> *> *layerWaiters;
@property (nonatomic, strong, nonnull) NSMutableArray<StyleLoadedBlock> *styleWaiters;

@property (nonatomic, assign) BOOL reactLocalizeLabels;
@property (nonatomic, assign) BOOL reactScrollEnabled;
@property (nonatomic, assign) BOOL reactPitchEnabled;
@property (nonatomic, assign) BOOL reactRotateEnabled;
@property (nonatomic, assign) BOOL reactAttributionEnabled;
@property (nonatomic, strong, nullable)
    NSDictionary<NSString *, NSNumber *> *reactAttributionPosition;
@property (nonatomic, assign) BOOL reactLogoEnabled;
@property (nonatomic, assign) BOOL reactCompassEnabled;
@property (nonatomic, assign) BOOL reactZoomEnabled;

@property (nonatomic, assign) NSInteger reactCompassViewPosition;
@property (nonatomic, assign) CGPoint reactCompassViewMargins;

@property (nonatomic, copy, nullable) NSString *reactMapStyle;
@property (nonatomic, assign) NSInteger reactPreferredFramesPerSecond;

@property (nonatomic, assign) MLNCoordinateBounds maxBounds;

@property (nonatomic, assign) BOOL isUserInteraction;
@property (nonatomic, assign) BOOL useNativeUserLocationAnnotationView;

@property (nonatomic, copy, nullable) RCTBubblingEventBlock onPress;
@property (nonatomic, copy, nullable) RCTBubblingEventBlock onLongPress;
@property (nonatomic, copy, nullable) RCTBubblingEventBlock onMapChange;

- (void)layerAdded:(nonnull MLNStyleLayer *)layer;

- (CLLocationDistance)getMetersPerPixelAtLatitude:(double)latitude withZoom:(double)zoomLevel;
- (CLLocationDistance)altitudeFromZoom:(double)zoomLevel;
- (CLLocationDistance)altitudeFromZoom:(double)zoomLevel atLatitude:(CLLocationDegrees)latitude;
- (CLLocationDistance)altitudeFromZoom:(double)zoomLevel
                            atLatitude:(CLLocationDegrees)latitude
                               atPitch:(CGFloat)pitch;
- (nonnull MLRNPointAnnotation *)getRCTPointAnnotation:(nonnull MLNPointAnnotation *)mlnAnnotation;
- (nonnull NSArray<MLRNSource *> *)getAllTouchableSources;
- (nonnull NSArray<MLRNSource *> *)getAllShapeSources;
- (nonnull NSArray<MLRNImages *> *)getAllImages;
- (nonnull MLRNSource *)getTouchableSourceWithHighestZIndex:
    (nonnull NSArray<MLRNSource *> *)touchableSources;
- (nonnull NSString *)takeSnap:(BOOL)writeToDisk;
- (void)didChangeUserTrackingMode:(MLNUserTrackingMode)mode animated:(BOOL)animated;

- (void)waitForLayerWithID:(nonnull NSString *)layerID
                      then:(void (^_Nonnull)(MLNStyleLayer *_Nonnull layer))foundLayer;

- (void)setSourceVisibility:(BOOL)visiblity
                   sourceId:(nonnull NSString *)sourceId
              sourceLayerId:(nullable NSString *)sourceLayerId;

- (void)notifyStyleLoaded;

@end
