//
//  RCTMLNImageSource.h
//  RCTMLN
//
//  Created by Nick Italiano on 11/29/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNSource.h"

@interface RCTMLNImageSource : RCTMLNSource

@property (nonatomic, copy) NSString *url;
@property (nonatomic, copy) NSArray<NSArray<NSNumber *> *> *coordinates;

@end
