#import <React/RCTComponent.h>
#import "MLRNLayer.h"
#import <UIKit/UIKit.h>
@import MapLibre;

@interface MLRNSource : UIView

extern NSString * _Nonnull const DEFAULT_SOURCE_ID;

@property (nonatomic, strong) NSMutableArray<id<RCTComponent>> *reactSubviews;
@property (nonatomic, strong) NSMutableArray<MLRNLayer*> *layers;
@property (nonatomic, strong) MLNSource *source;
@property (nonatomic, strong) MLRNMapView *map;
@property (nonatomic, strong) NSDictionary<NSString *, NSNumber *> *hitbox;

@property (nonatomic, copy) NSString *id;
@property (nonatomic, assign) BOOL hasPressListener;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

- (void)addToMap;
- (void)removeFromMap;
- (nullable MLNSource*)makeSource;
- (NSArray<NSString *> *)getLayerIDs;

+ (BOOL)isDefaultSource:(NSString*)sourceID;

@end
