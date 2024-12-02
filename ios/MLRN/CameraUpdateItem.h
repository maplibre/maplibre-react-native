#import "CameraStop.h"
#import "MLRNMapView.h"

@interface CameraUpdateItem : NSObject

@property (nonatomic, strong) CameraStop* _Nonnull cameraStop;

- (void)execute:(MLRNMapView* _Nonnull)mapView withCompletionHandler:(nullable void (^)(void))completionHandler;

@end
