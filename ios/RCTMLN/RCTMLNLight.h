//
//  RCTMLNLight.h
//  RCTMLN
//
//  Created by Nick Italiano on 9/26/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <UIKit/UIKit.h>
@import MapLibre;

@interface RCTMLNLight : UIView

@property (nonatomic, strong) MLNMapView *map;
@property (nonatomic, strong) NSDictionary *reactStyle;

@end
