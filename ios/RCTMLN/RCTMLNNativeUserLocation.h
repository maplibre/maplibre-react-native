//
//  RCTMLNCamera.h
//  RCTMLN
//
//  Created by Nick Italiano on 6/22/18.
//  Copyright © 2018 Mapbox Inc. All rights reserved.
//
#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

@class RCTMLNMapView;

@interface RCTMLNNativeUserLocation : UIView

@property (nonatomic, strong) RCTMLNMapView *map;
@property (nonatomic) BOOL iosShowsUserHeadingIndicator;

@end
