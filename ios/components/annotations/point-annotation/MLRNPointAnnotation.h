#import <React/RCTComponent.h>
#import <React/RCTView.h>
#import <UIKit/UIKit.h>
#import "MLRNCallout.h"

#import <MapLibre/MapLibre.h>

@interface MLRNPointAnnotation : MLNAnnotationView <MLNAnnotation>

@property (nonatomic, weak) MLNMapView *map;
@property (nonatomic, strong) MLRNCallout *calloutView;

@property (nonatomic, copy) NSString *id;
@property (nonatomic, copy) NSString *reactTitle;
@property (nonatomic, copy) NSString *reactSnippet;

@property (nonatomic, copy) NSArray<NSNumber *> *reactLngLat;
@property (nonatomic, assign) CLLocationCoordinate2D coordinate;

@property (nonatomic, copy) NSDictionary<NSString *, NSNumber *> *anchor;
@property (nonatomic, copy) NSDictionary<NSString *, NSNumber *> *offset;

@property (nonatomic, copy) void (^reactOnSelected)(NSDictionary *event);
@property (nonatomic, copy) void (^reactOnDeselected)(NSDictionary *event);
@property (nonatomic, copy) void (^reactOnDragStart)(NSDictionary *event);
@property (nonatomic, copy) void (^reactOnDrag)(NSDictionary *event);
@property (nonatomic, copy) void (^reactOnDragEnd)(NSDictionary *event);

@property (nonatomic, assign) BOOL reactSelected;
@property (nonatomic, assign) BOOL reactDraggable;
@property (nonatomic, assign) BOOL hasExplicitZIndex;
@property (nonatomic, assign) CGFloat explicitZIndex;

// For Fabric: track custom child count without adding to view hierarchy
@property (nonatomic, assign) NSInteger customChildCount;

- (MLNAnnotationView *)getAnnotationView;
- (NSDictionary *)makeEventPayload;
- (void)setZIndex:(CGFloat)zIndex;

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex;
- (void)removeReactSubview:(UIView *)subview;

@end
