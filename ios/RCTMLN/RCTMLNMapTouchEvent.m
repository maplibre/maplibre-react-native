//
//  RCTMLNTouchEvent.m
//  RCTMLN
//
//  Created by Nick Italiano on 8/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNMapTouchEvent.h"
#import "RCTMLNEventTypes.h"
#import "RCTMLNPointAnnotation.h"
@import MapLibre;

@implementation RCTMLNMapTouchEvent

- (NSDictionary*)payload
{
    MLNPointFeature *feature = [[MLNPointFeature alloc] init];
    feature.coordinate = _coordinate;
    if (_id == nil) {
        feature.attributes = @{
           @"screenPointX": [NSNumber numberWithDouble:_screenPoint.x],
           @"screenPointY":[NSNumber numberWithDouble:_screenPoint.y]
        };
    } else {
        feature.attributes = @{
           @"id": _id,
           @"screenPointX": [NSNumber numberWithDouble:_screenPoint.x],
           @"screenPointY":[NSNumber numberWithDouble:_screenPoint.y]
        };
    }
    return [feature geoJSONDictionary];
}

+ (RCTMLNMapTouchEvent*)makeTapEvent:(MLNMapView*)mapView withPoint:(CGPoint)point
{
    return [RCTMLNMapTouchEvent _fromPoint:point withMapView:mapView andEventType:RCT_MAPBOX_EVENT_TAP];
}

+ (RCTMLNMapTouchEvent*)makeLongPressEvent:(MLNMapView*)mapView withPoint:(CGPoint)point
{
    return [RCTMLNMapTouchEvent _fromPoint:point withMapView:mapView andEventType:RCT_MAPBOX_EVENT_LONGPRESS];
}

+ (RCTMLNMapTouchEvent *)makeAnnotationTapEvent:(RCTMLNPointAnnotation *)pointAnnotation
{
    RCTMLNMapTouchEvent *event = [[RCTMLNMapTouchEvent alloc] init];
    event.type = RCT_MAPBOX_ANNOTATION_TAP;
    event.id = pointAnnotation.id;
    event.coordinate = pointAnnotation.coordinate;
    event.screenPoint = [pointAnnotation.superview convertPoint:pointAnnotation.frame.origin toView:nil];
    return event;
}

+ (RCTMLNMapTouchEvent *)makeAnnotationTapEventOnDrag:(RCTMLNPointAnnotation *)pointAnnotation
{
    RCTMLNMapTouchEvent *event = [[RCTMLNMapTouchEvent alloc] init];
    event.type = RCT_MAPBOX_ANNOTATION_TAP;
    event.id = pointAnnotation.id;
    CGPoint screenPoint = [pointAnnotation.superview convertPoint:pointAnnotation.layer.position toView:nil];
    screenPoint.x -= (pointAnnotation.layer.bounds.size.width * pointAnnotation.layer.anchorPoint.x);
    screenPoint.y -= (pointAnnotation.layer.bounds.size.height * pointAnnotation.layer.anchorPoint.y);
    event.screenPoint = screenPoint;
    event.coordinate =  [pointAnnotation.map convertPoint:pointAnnotation.layer.position toCoordinateFromView:pointAnnotation.map];
    return event;
}

+ (RCTMLNMapTouchEvent*)_fromPoint:(CGPoint)point withMapView:(MLNMapView *)mapView andEventType:(NSString*)eventType
{
    RCTMLNMapTouchEvent *event = [[RCTMLNMapTouchEvent alloc] init];
    event.type = eventType;
    event.coordinate = [mapView convertPoint:point toCoordinateFromView:mapView];
    event.screenPoint = point;
    return event;
}

@end
