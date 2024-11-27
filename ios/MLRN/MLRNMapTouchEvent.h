//
//  MLRNTouchEvent.h
//  MLRN
//
//  Created by Nick Italiano on 8/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

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
