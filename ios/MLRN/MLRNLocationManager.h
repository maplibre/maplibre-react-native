//
//  MLRNLocationManager.h
//  MLRN
//
//  Created by Nick Italiano on 6/21/18.
//  Copyright © 2018 Mapbox Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "MLRNLocation.h"
#import "MLRNLocationManagerDelegate.h"

typedef void (^MLRNLocationBlock)(MLRNLocation *location);

@interface MLRNLocationManager : NSObject

@property (nonatomic, strong) id<MLRNLocationManagerDelegate> delegate;

+ (id)sharedInstance;

- (void)start:(CLLocationDistance)minDisplacement;
- (void)stop;
- (void)setMinDisplacement:(CLLocationDistance)minDisplacement;
- (BOOL)isEnabled;
- (MLRNLocation *)getLastKnownLocation;
- (void)addListener:(MLRNLocationBlock)listener;
- (void)removeListener:(MLRNLocationBlock)listener;

@end
