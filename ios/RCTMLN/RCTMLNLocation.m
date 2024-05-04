//
//  RCTMLNLocation.m
//  RCTMLN
//
//  Created by Nick Italiano on 6/21/18.
//  Copyright © 2018 Mapbox Inc. All rights reserved.
//

#import "RCTMLNLocation.h"

@implementation RCTMLNLocation

- (NSDictionary<NSString *, id> *)toJSON
{
    NSMutableDictionary<NSString *, id> *json = [[NSMutableDictionary alloc] init];
    
    NSMutableDictionary<NSString *, NSNumber *> *coords = [[NSMutableDictionary alloc] init];
    coords[@"longitude"] = @(_location.coordinate.longitude);
    coords[@"latitude"] = @(_location.coordinate.latitude);
    coords[@"altitude"] = @(_location.altitude);
    coords[@"accuracy"] = @(_location.horizontalAccuracy);
    coords[@"heading"] = @(_heading.trueHeading);
    coords[@"course"] = @(_location.course);
    coords[@"speed"] = @(_location.speed);
    
    json[@"coords"] = coords;
    json[@"timestamp"] = @([_location.timestamp timeIntervalSince1970]);
    
    return json;
}

@end
