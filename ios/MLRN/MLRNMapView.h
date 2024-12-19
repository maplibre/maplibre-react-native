#import <React/RCTComponent.h>
#import "MLRNSource.h"
#import "MLRNShapeSource.h"
#import "MLRNPointAnnotation.h"
#import "MLRNLight.h"

@import MapLibre;

@class CameraUpdateQueue;
@class MLRNImages;
@class MLRNLogging;

@protocol MLRNMapViewCamera<NSObject>
- (void)initialLayout;
- (void)didChangeUserTrackingMode:(MLNUserTrackingMode)mode animated:(BOOL)animated;
@end

typedef void (^FoundLayerBlock) (MLNStyleLayer* __nonnull layer);
typedef void (^StyleLoadedBlock) (MLNStyle* __nonnull style);

@interface MLRNMapView : MLNMapView<RCTInvalidating>

@property (nonatomic, strong, nonnull) MLRNLogging* logging;
@property (nonatomic, strong) CameraUpdateQueue *cameraUpdateQueue;
@property (nonatomic, weak) id<MLRNMapViewCamera> reactCamera;
@property (nonatomic, strong) NSMutableArray<id<RCTComponent>> *reactSubviews;
@property (nonatomic, strong) NSMutableArray<MLRNSource*> *sources;
@property (nonatomic, strong) NSMutableArray<MLRNImages*> *images;
@property (nonatomic, strong) NSMutableArray<MLRNLayer*> *layers;
@property (nonatomic, strong) NSMutableArray<MLRNPointAnnotation*> *pointAnnotations;
@property (nonatomic, strong) MLRNLight *light;
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

@property (nonatomic, copy) NSString *reactMapStyle;
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
- (MLRNPointAnnotation*)getRCTPointAnnotation:(MLNPointAnnotation*)mlnAnnotation;
- (NSArray<MLRNSource *> *)getAllTouchableSources;
- (NSArray<MLRNSource *> *)getAllShapeSources;
- (NSArray<MLRNImages *> *)getAllImages;
- (MLRNSource *)getTouchableSourceWithHighestZIndex:(NSArray<MLRNSource *> *)touchableSources;
- (NSString *)takeSnap:(BOOL)writeToDisk;
- (void)didChangeUserTrackingMode:(MLNUserTrackingMode)mode animated:(BOOL)animated;

- (void)waitForLayerWithID:(nonnull NSString*)layerID then:(void (^ _Nonnull)(MLNStyleLayer* _Nonnull layer))foundLayer;

- (void)setSourceVisibility:(BOOL)visiblity sourceId:(nonnull NSString*)sourceId sourceLayerId:(nullable NSString*)sourceLayerId;

- (void)notifyStyleLoaded;

@end
