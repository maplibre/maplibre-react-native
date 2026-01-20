#import <React/RCTComponent.h>

#import <MapLibre/MapLibre.h>

#import "MLRNPointAnnotation.h"
#import "MLRNSource.h"

@class CameraUpdateQueue;
@class MLRNImages;
@class MLRNLogging;

@protocol MLRNMapViewCamera <NSObject>
- (void)initialLayout;
- (void)didChangeUserTrackingMode:(MLNUserTrackingMode)mode animated:(BOOL)animated;
@end

typedef void (^FoundLayerBlock)(MLNStyleLayer *__nonnull layer);
typedef void (^StyleLoadedBlock)(MLNStyle *__nonnull style);

@interface MLRNMapView : MLNMapView <RCTInvalidating, MLNMapViewDelegate>

- initWithFrame:(CGRect)frame;
- (void)addToMap:(UIView *_Nonnull)subview;
- (void)removeFromMap:(UIView *_Nonnull)subview;

@property (nonatomic, strong, nonnull) MLRNLogging *logging;
@property (nonatomic, strong, nonnull) CameraUpdateQueue *cameraUpdateQueue;
@property (nonatomic, weak) id<MLRNMapViewCamera> reactCamera;
@property (nonatomic, strong, nonnull) NSMutableArray<UIView *> *reactSubviews;
@property (nonatomic, strong, nonnull) NSMutableArray<MLRNSource *> *sources;
@property (nonatomic, strong, nonnull) NSMutableArray<MLRNImages *> *images;
@property (nonatomic, strong, nonnull) NSMutableArray<MLRNLayer *> *layers;
@property (nonatomic, strong, nonnull) NSMutableArray<MLRNPointAnnotation *> *pointAnnotations;

@property (nonatomic, strong, nonnull)
    NSMutableDictionary<NSString *, NSMutableArray<FoundLayerBlock> *> *layerWaiters;
@property (nonatomic, strong, nonnull) NSMutableArray<StyleLoadedBlock> *styleWaiters;

@property (nonatomic, copy, nullable) NSString *reactMapStyle;
@property (nonatomic, copy, nullable) NSDictionary *reactLight;
@property (nonatomic, copy, nullable) NSDictionary<NSString *, NSNumber *> *reactContentInset;
@property (nonatomic, assign) NSInteger reactPreferredFramesPerSecond;

@property (nonatomic, assign) BOOL reactScrollEnabled;
@property (nonatomic, assign) BOOL reactZoomEnabled;
@property (nonatomic, assign) BOOL reactRotateEnabled;
@property (nonatomic, assign) BOOL reactPitchEnabled;

@property (nonatomic, assign) BOOL reactAttributionEnabled;
@property (nonatomic, strong, nullable)
    NSDictionary<NSString *, NSNumber *> *reactAttributionPosition;

@property (nonatomic, assign) BOOL reactLogoEnabled;
@property (nonatomic, strong, nullable) NSDictionary<NSString *, NSNumber *> *reactLogoPosition;

@property (nonatomic, assign) BOOL reactCompassEnabled;
@property (nonatomic, strong, nullable) NSDictionary<NSString *, NSNumber *> *reactCompassPosition;
@property (nonatomic, assign) BOOL reactCompassHiddenFacingNorth;

@property (nonatomic, assign) MLNCoordinateBounds maxBounds;

@property (nonatomic, assign) BOOL isUserInteraction;
@property (nonatomic, assign) BOOL useNativeUserLocationAnnotationView;

@property (nonatomic, copy, nullable) RCTBubblingEventBlock reactOnPress;
@property (nonatomic, copy, nullable) RCTBubblingEventBlock reactOnLongPress;

@property (nonatomic, copy, nullable) RCTDirectEventBlock reactOnRegionWillChange;
@property (nonatomic, copy, nullable) RCTDirectEventBlock reactOnRegionIsChanging;
@property (nonatomic, copy, nullable) RCTDirectEventBlock reactOnRegionDidChange;

@property (nonatomic, copy, nullable) RCTDirectEventBlock reactOnWillStartLoadingMap;
@property (nonatomic, copy, nullable) RCTDirectEventBlock reactOnDidFinishLoadingMap;
@property (nonatomic, copy, nullable) RCTDirectEventBlock reactOnDidFailLoadingMap;

@property (nonatomic, copy, nullable) RCTDirectEventBlock reactOnWillStartRenderingFrame;
@property (nonatomic, copy, nullable) RCTDirectEventBlock reactOnDidFinishRenderingFrame;
@property (nonatomic, copy, nullable) RCTDirectEventBlock reactOnDidFinishRenderingFrameFully;

@property (nonatomic, copy, nullable) RCTDirectEventBlock reactOnWillStartRenderingMap;
@property (nonatomic, copy, nullable) RCTDirectEventBlock reactOnDidFinishRenderingMap;
@property (nonatomic, copy, nullable) RCTDirectEventBlock reactOnDidFinishRenderingMapFully;

@property (nonatomic, copy, nullable) RCTDirectEventBlock reactOnDidFinishLoadingStyle;

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

- (void)waitForLayerWithId:(nonnull NSString *)layerId
                      then:(void (^_Nonnull)(MLNStyleLayer *_Nonnull layer))foundLayer;

- (void)setSourceVisibility:(BOOL)visibility
                   sourceId:(nonnull NSString *)sourceId
              sourceLayerId:(nullable NSString *)sourceLayerId;

- (void)notifyStyleLoaded;

@end
