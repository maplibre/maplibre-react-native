#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>


@class MLRNMapView;

@import MapLibre;

@interface MLRNLayer<T> : UIView

@property (nonatomic, weak, nullable) RCTBridge* bridge;

@property (nonatomic, strong, nullable) MLNStyleLayer *styleLayer;
@property (nonatomic, strong, nullable) MLNStyle *style;
@property (nonatomic, weak, nullable) MLRNMapView* map;
@property (nonatomic, strong, nullable) NSDictionary *reactStyle;
@property (nonatomic, strong, nullable) NSArray *filter;

@property (nonatomic, copy, nullable) NSString *id;
@property (nonatomic, copy, nullable) NSString *sourceID;

@property (nonatomic, copy, nullable) NSString *aboveLayerID;
@property (nonatomic, copy, nullable) NSString *belowLayerID;
@property (nonatomic, copy, nullable) NSNumber *layerIndex;

@property (nonatomic, copy, nullable) NSNumber *maxZoomLevel;
@property (nonatomic, copy, nullable) NSNumber *minZoomLevel;

- (void)addToMap:(nonnull MLRNMapView*)map style:(nonnull MLNStyle*)style;
- (void)addedToMap;
- (void)removeFromMap:(nonnull MLNStyle*)style;
- (nullable T)makeLayer:(nonnull MLNStyle*)style;
- (void)addStyles;
- (void)insertAbove:(nonnull NSString*)layer;
- (void)insertBelow:(nonnull NSString*)layer;
- (void)insertAtIndex:(NSUInteger)index;
- (void)insertLayer;
- (void)setZoomBounds;

- (BOOL)isAddedToMap;

- (nullable MLNSource*)layerWithSourceIDInStyle:(nonnull MLNStyle*) style;

@end
