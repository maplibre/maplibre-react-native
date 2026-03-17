#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

#import "MLRNLayer.h"

#import <MapLibre/MapLibre.h>

@interface MLRNSource : UIView

@property (nonatomic, strong, nonnull) NSMutableArray<id<RCTComponent>> *reactSubviews;
@property (nonatomic, strong, nonnull) NSMutableArray<MLRNLayer *> *layers;
@property (nonatomic, strong, nullable) MLNSource *source;
@property (nonatomic, strong, nullable) MLRNMapView *map;
@property (nonatomic, strong, nonnull) NSDictionary<NSString *, NSNumber *> *hitbox;

@property (nonatomic, copy, nonnull) NSString *id;
@property (nonatomic, assign) BOOL hasPressListener;
@property (nonatomic, copy, nullable) RCTBubblingEventBlock onPress;

- (void)addToMap;
- (void)removeFromMap;
- (nullable MLNSource *)makeSource;
- (nonnull NSArray<NSString *> *)getLayerIDs;

- (void)insertReactSubview:(id<RCTComponent> _Nullable)subview atIndex:(NSInteger)atIndex;
- (void)removeReactSubview:(id<RCTComponent> _Nullable)subview;

@end
