//
//  RCTMLNPointAnnotation.h
//  RCTMLN
//
//  Created by Nick Italiano on 10/12/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>
#import <React/RCTView.h>
#import "RCTMLNCallout.h"

@import MapLibre;

@interface RCTMLNPointAnnotation : MLNAnnotationView<MLNAnnotation>

@property (nonatomic, weak) MLNMapView *map;
@property (nonatomic, strong) RCTMLNCallout *calloutView;

@property (nonatomic, copy) NSString *id;
@property (nonatomic, copy) NSString *reactTitle;
@property (nonatomic, copy) NSString *reactSnippet;

@property (nonatomic, copy) NSString *reactCoordinate;
@property (nonatomic, assign) CLLocationCoordinate2D coordinate;

@property (nonatomic, copy) NSDictionary<NSString *, NSNumber *> *anchor;

@property (nonatomic, copy) RCTBubblingEventBlock onSelected;
@property (nonatomic, copy) RCTBubblingEventBlock onDeselected;
@property (nonatomic, copy) RCTBubblingEventBlock onDragStart;
@property (nonatomic, copy) RCTBubblingEventBlock onDrag;
@property (nonatomic, copy) RCTBubblingEventBlock onDragEnd;

@property (nonatomic, assign) BOOL reactSelected;
@property (nonatomic, assign) BOOL reactDraggable;

- (MLNAnnotationView *)getAnnotationView;

@end
