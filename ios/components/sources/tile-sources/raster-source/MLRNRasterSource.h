#import "MLRNTileSource.h"

#import <MapLibre/MapLibre.h>

@interface MLRNRasterSource : MLRNTileSource

@property (nonatomic, strong) NSNumber *tileSize;

@end
