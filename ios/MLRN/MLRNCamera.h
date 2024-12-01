#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>
#import "MLRNMapView.h"

@class MLRNMapView;

@interface MLRNCamera : UIView<MLRNMapViewCamera>

@property (nonatomic, strong) NSDictionary<NSString *, id> *stop;
@property (nonatomic, strong) NSDictionary<NSString *, id> *defaultStop;
@property (nonatomic, strong) MLRNMapView *map;

@property (nonatomic, assign) BOOL followUserLocation;
@property (nonatomic, copy) NSString *followUserMode;
@property (nonatomic, copy) NSNumber *followZoomLevel;
@property (nonatomic, copy) NSNumber *followPitch;
@property (nonatomic, copy) NSNumber *followHeading;

@property (nonatomic, copy) NSNumber *maxZoomLevel;
@property (nonatomic, copy) NSNumber *minZoomLevel;

@property (nonatomic, copy) NSString *maxBounds;

@property (nonatomic, copy) NSString *alignment;
@property (nonatomic, copy, readonly) NSNumber *cameraAnimationMode;

@property (nonatomic, copy) RCTBubblingEventBlock onUserTrackingModeChange;

@end
