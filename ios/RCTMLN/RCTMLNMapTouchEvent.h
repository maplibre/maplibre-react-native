//
//  RCTMLNTouchEvent.h
//  RCTMLN
//
//  Created by Nick Italiano on 8/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTMLNEvent.h"
#import "RCTMLNPointAnnotation.h"
@import MapLibre;

@interface RCTMLNMapTouchEvent : RCTMLNEvent

@property (nonatomic, copy) NSString *id;
@property (nonatomic, assign) CLLocationCoordinate2D coordinate;
@property (nonatomic, assign) CGPoint screenPoint;

+ (RCTMLNMapTouchEvent*)makeTapEvent:(MLNMapView*)mapView withPoint:(CGPoint)point;
+ (RCTMLNMapTouchEvent*)makeLongPressEvent:(MLNMapView*)mapView withPoint:(CGPoint)point;
+ (RCTMLNMapTouchEvent *)makeAnnotationTapEvent:(RCTMLNPointAnnotation *)pointAnnotation;
+ (RCTMLNMapTouchEvent *)makeAnnotationTapEventOnDrag:(RCTMLNPointAnnotation *)pointAnnotation;

@end
