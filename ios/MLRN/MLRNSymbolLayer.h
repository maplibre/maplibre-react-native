#import <React/RCTComponent.h>
#import "MLRNVectorLayer.h"

@interface MLRNSymbolLayer : MLRNVectorLayer<RCTInvalidating>

@property (nonatomic, strong) NSMutableArray<id<RCTComponent>> *reactSubviews;

@property (nonatomic, assign) BOOL snapshot;
@property (nonatomic, copy) NSString *sourceLayerID;

@end
