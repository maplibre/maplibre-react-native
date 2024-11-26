//
//  MLRNRasterSource.h
//  MLRN
//
//  Created by Nick Italiano on 9/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "MLRNTileSource.h"
@import MapLibre;

@interface MLRNRasterSource : MLRNTileSource

@property (nonatomic, strong) NSNumber *tileSize;

@end
