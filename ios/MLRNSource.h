#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>
#import "MLRNLayer.h"
@import MapLibre;

@interface MLRNSource : UIView

extern NSString *_Nonnull const DEFAULT_SOURCE_ID;

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

+ (BOOL)isDefaultSource:(nonnull NSString *)sourceID;

@end
