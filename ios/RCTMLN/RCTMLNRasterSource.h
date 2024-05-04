//
//  RCTMLNRasterSource.h
//  RCTMLN
//
//  Created by Nick Italiano on 9/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNTileSource.h"
@import MapLibre;

@interface RCTMLNRasterSource : RCTMLNTileSource

@property (nonatomic, strong) NSNumber *tileSize;

@end
