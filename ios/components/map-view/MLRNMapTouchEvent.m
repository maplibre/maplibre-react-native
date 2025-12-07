#import "MLRNMapTouchEvent.h"
#import "MLRNEventTypes.h"
#import "MLRNPointAnnotation.h"
@import MapLibre;

@implementation MLRNMapTouchEvent

- (NSDictionary *)payload {
  MLNPointFeature *feature = [[MLNPointFeature alloc] init];
  feature.coordinate = _coordinate;
  if (_id == nil) {
    feature.attributes = @{
      @"lngLat" : @[
        [NSNumber numberWithDouble:_coordinate.longitude],
        [NSNumber numberWithDouble:_coordinate.latitude]
      ],
      @"point" : @[
        [NSNumber numberWithDouble:_screenPoint.x], [NSNumber numberWithDouble:_screenPoint.y]
      ]
    };
  } else {
    feature.attributes = @{
      @"id" : _id,
      @"lngLat" : @[
        [NSNumber numberWithDouble:_coordinate.longitude],
        [NSNumber numberWithDouble:_coordinate.latitude]
      ],
      @"point" : @[
        [NSNumber numberWithDouble:_screenPoint.x], [NSNumber numberWithDouble:_screenPoint.y]
      ]
    };
  }
  return [feature geoJSONDictionary];
}

+ (MLRNMapTouchEvent *)makeTapEvent:(MLNMapView *)mapView withPoint:(CGPoint)point {
  return [MLRNMapTouchEvent _fromPoint:point withMapView:mapView andEventType:RCT_MLRN_PRESS];
}

+ (MLRNMapTouchEvent *)makeLongPressEvent:(MLNMapView *)mapView withPoint:(CGPoint)point {
  return [MLRNMapTouchEvent _fromPoint:point withMapView:mapView andEventType:RCT_MLRN_LONG_PRESS];
}

+ (MLRNMapTouchEvent *)makeAnnotationTapEvent:(MLRNPointAnnotation *)pointAnnotation {
  MLRNMapTouchEvent *event = [[MLRNMapTouchEvent alloc] init];
  event.type = RCT_MLRN_ANNOTATION_TAP;
  event.id = pointAnnotation.id;
  event.coordinate = pointAnnotation.coordinate;
  event.screenPoint = [pointAnnotation.superview convertPoint:pointAnnotation.frame.origin
                                                       toView:nil];
  return event;
}

+ (MLRNMapTouchEvent *)makeAnnotationTapEventOnDrag:(MLRNPointAnnotation *)pointAnnotation {
  MLRNMapTouchEvent *event = [[MLRNMapTouchEvent alloc] init];
  event.type = RCT_MLRN_ANNOTATION_TAP;
  event.id = pointAnnotation.id;
  CGPoint screenPoint = [pointAnnotation.superview convertPoint:pointAnnotation.layer.position
                                                         toView:nil];
  screenPoint.x -= (pointAnnotation.layer.bounds.size.width * pointAnnotation.layer.anchorPoint.x);
  screenPoint.y -= (pointAnnotation.layer.bounds.size.height * pointAnnotation.layer.anchorPoint.y);
  event.screenPoint = screenPoint;
  event.coordinate = [pointAnnotation.map convertPoint:pointAnnotation.layer.position
                                  toCoordinateFromView:pointAnnotation.map];
  return event;
}

+ (MLRNMapTouchEvent *)_fromPoint:(CGPoint)point
                      withMapView:(MLNMapView *)mapView
                     andEventType:(NSString *)eventType {
  MLRNMapTouchEvent *event = [[MLRNMapTouchEvent alloc] init];
  event.type = eventType;
  event.coordinate = [mapView convertPoint:point toCoordinateFromView:mapView];
  event.screenPoint = point;
  return event;
}

@end
