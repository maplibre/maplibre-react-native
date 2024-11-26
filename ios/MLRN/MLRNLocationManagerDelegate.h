//
//  MLRNLocationManagerDelegate.h
//  MLRN
//
//  Created by Nick Italiano on 6/21/18.
//  Copyright © 2018 Mapbox Inc. All rights reserved.
//

#import <CoreLocation/CoreLocation.h>

#import "MLRNLocation.h"

@class MLRNLocationManager;

@protocol MLRNLocationManagerDelegate<NSObject>

- (void)locationManager:(MLRNLocationManager *)locationManager didUpdateLocation:(MLRNLocation *)location;

@end

