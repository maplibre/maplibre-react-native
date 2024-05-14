//
//  RCTMLNLocationManager.h
//  RCTMLN
//
//  Created by Nick Italiano on 6/21/18.
//  Copyright © 2018 Mapbox Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "RCTMLNLocation.h"
#import "RCTMLNLocationManagerDelegate.h"

typedef void (^RCTMLNLocationBlock)(RCTMLNLocation *location);

@interface RCTMLNLocationManager : NSObject

@property (nonatomic, strong) id<RCTMLNLocationManagerDelegate> delegate;

+ (id)sharedInstance;

- (void)start:(CLLocationDistance)minDisplacement;
- (void)stop;
- (void)setMinDisplacement:(CLLocationDistance)minDisplacement;
- (BOOL)isEnabled;
- (RCTMLNLocation *)getLastKnownLocation;
- (void)addListener:(RCTMLNLocationBlock)listener;
- (void)removeListener:(RCTMLNLocationBlock)listener;

@end
