#import <React/RCTBridge.h>
#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

#import <MapLibre/MapLibre.h>

@class MLRNMapView;

@interface MLRNImages : UIView

@property (nonatomic, weak) RCTBridge *bridge;

@property (nonatomic, strong) MLRNMapView *map;
@property (nonatomic, strong, nonnull) NSMutableArray<id<RCTComponent>> *reactSubviews;

@property (nonatomic, strong) NSDictionary *images;

@property (nonatomic, copy) RCTBubblingEventBlock onImageMissing;
@property (nonatomic, assign) BOOL hasOnImageMissing;

- (void)addToMap;
- (void)removeFromMap;
- (BOOL)addMissingImageToStyle:(NSString *)imageName;
- (void)sendImageMissingEvent:(NSString *)imageName;

- (void)insertReactSubview:(id<RCTComponent>_Nullable)subview atIndex:(NSInteger)atIndex;
- (void)removeReactSubview:(id<RCTComponent>_Nullable)subview;

@end
