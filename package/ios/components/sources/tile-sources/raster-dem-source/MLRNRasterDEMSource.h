#import "MLRNTileSource.h"

#import <MapLibre/MapLibre.h>

@interface MLRNRasterDEMSource : MLRNTileSource

@property (nonatomic, strong) NSNumber *tileSize;
@property (nonatomic, copy) NSString *encoding;

@end

