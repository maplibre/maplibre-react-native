#import <Foundation/Foundation.h>
#import "MLRNEvent.h"
#import "MLRNPointAnnotation.h"
@import MapLibre;

@interface MLRNMapTouchEvent : MLRNEvent

@property (nonatomic, copy) NSString *id;
@property (nonatomic, assign) CLLocationCoordinate2D coordinate;
@property (nonatomic, assign) CGPoint screenPoint;

+ (MLRNMapTouchEvent*)makeTapEvent:(MLNMapView*)mapView withPoint:(CGPoint)point;
+ (MLRNMapTouchEvent*)makeLongPressEvent:(MLNMapView*)mapView withPoint:(CGPoint)point;
+ (MLRNMapTouchEvent *)makeAnnotationTapEvent:(MLRNPointAnnotation *)pointAnnotation;
+ (MLRNMapTouchEvent *)makeAnnotationTapEventOnDrag:(MLRNPointAnnotation *)pointAnnotation;

@end
