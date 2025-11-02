#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

@class MLRNMapView;

@interface MLRNNativeUserLocation : UIView

@property (nonatomic, strong) MLRNMapView *map;
@property (nonatomic) BOOL iosShowsUserHeadingIndicator;

@end
