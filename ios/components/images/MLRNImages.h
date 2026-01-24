#import <React/RCTBridge.h>
#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

#import <MapLibre/MapLibre.h>

@class MLRNMapView;

@interface MLRNImages : UIView

@property (nonatomic, weak) RCTBridge *bridge;

@property (nonatomic, strong) MLRNMapView *map;
@property (nonatomic, strong, nonnull) NSMutableArray<id<RCTComponent>> *reactSubviews;

/**
 * Unified images dictionary where:
 * - Keys are image names used in style expressions
 * - Values can be:
 *   - NSString: Native asset name (loaded from xcassets) or URL string
 *   - NSDictionary: { uri: string, scale?: number, sdf?: boolean }
 */
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
