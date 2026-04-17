#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>
#import "MLRNMapView.h"

@class MLRNMapView;

@interface MLRNCamera : UIView <MLRNMapViewCamera>

@property (nonatomic, strong) MLRNMapView *map;

@property (nonatomic, strong) NSDictionary<NSString *, id> *stop;

@property (nonatomic, strong) NSDictionary<NSString *, id> *initialViewState;

@property (nonatomic, copy) NSNumber *minZoom;
@property (nonatomic, copy) NSNumber *maxZoom;
@property (nonatomic, copy) NSArray<NSNumber *> *maxBounds;

@property (nonatomic, copy) NSString *trackUserLocation;

@property (nonatomic, copy) RCTDirectEventBlock onTrackUserLocationChange;

- (void)handleImperativeStop:(NSDictionary<NSString *, id> *)stop;
- (void)updateCamera;

@end
