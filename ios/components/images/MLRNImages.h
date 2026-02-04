#import <React/RCTBridge.h>
#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

#import <MapLibre/MapLibre.h>

@class MLRNMapView;

@interface MLRNImages : UIView

@property (nonatomic, weak) RCTBridge *bridge;

@property (nonatomic, strong) MLRNMapView *_Nullable map;
@property (nonatomic, strong, nonnull) NSMutableArray<id<RCTComponent>> *reactSubviews;

@property (nonatomic, strong, nonnull) NSDictionary *images;

@property (nonatomic, copy, nullable) RCTDirectEventBlock onImageMissing;

- (void)addToMap;
- (void)removeFromMap;

- (BOOL)addMissingImageToStyle:(NSString *_Nonnull)imageName;
- (void)sendImageMissingEvent:(NSString *_Nonnull)imageName;

- (void)insertReactSubview:(id<RCTComponent> _Nullable)subview atIndex:(NSInteger)atIndex;
- (void)removeReactSubview:(id<RCTComponent> _Nullable)subview;

@end
