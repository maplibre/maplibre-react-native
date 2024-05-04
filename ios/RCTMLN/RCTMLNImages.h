#import <React/RCTBridge.h>
#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

@import MapLibre;

@class RCTMLNMapView;

@interface RCTMLNImages : UIView

@property (nonatomic, weak) RCTBridge *bridge;

@property (nonatomic, strong) RCTMLNMapView *map;

@property (nonatomic, strong) NSDictionary<NSString *, NSString *> *images;
@property (nonatomic, strong) NSArray<NSString *> *nativeImages;

@property (nonatomic, copy) RCTBubblingEventBlock onImageMissing;
@property (nonatomic, assign) BOOL hasOnImageMissing;

- (BOOL)addMissingImageToStyle:(NSString *)imageName;
- (void)sendImageMissingEvent:(NSString *)imageName;

@end

