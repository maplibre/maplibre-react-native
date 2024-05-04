//
//  RCTMLNSymbolLayer.h
//  RCTMLN
//
//  Created by Nick Italiano on 9/19/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <React/RCTComponent.h>
#import "RCTMLNVectorLayer.h"

@interface RCTMLNSymbolLayer : RCTMLNVectorLayer<RCTInvalidating>

@property (nonatomic, strong) NSMutableArray<id<RCTComponent>> *reactSubviews;

@property (nonatomic, assign) BOOL snapshot;
@property (nonatomic, copy) NSString *sourceLayerID;

@end
