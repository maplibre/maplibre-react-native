//
//  RCTMLNLocationManagerDelegate.h
//  RCTMLN
//
//  Created by Nick Italiano on 6/21/18.
//  Copyright © 2018 Mapbox Inc. All rights reserved.
//

#import <CoreLocation/CoreLocation.h>

#import "RCTMLNLocation.h"

@class RCTMLNLocationManager;

@protocol RCTMLNLocationManagerDelegate<NSObject>

- (void)locationManager:(RCTMLNLocationManager *)locationManager didUpdateLocation:(RCTMLNLocation *)location;

@end

