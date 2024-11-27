//
//  BaseSource.m
//  MLRN
//

#import "MLRNTileSource.h"

@implementation MLRNTileSource

- (NSDictionary<MLNTileSourceOption, id>*)getOptions {
    NSMutableDictionary<MLNTileSourceOption, id> *options = [[NSMutableDictionary alloc] init];
    
    if (self.maxZoomLevel != nil) {
        options[MLNTileSourceOptionMaximumZoomLevel] = self.maxZoomLevel;
    }
    
    if (self.minZoomLevel != nil) {
        options[MLNTileSourceOptionMinimumZoomLevel] = self.minZoomLevel;
    }
    
    if (self.tms) {
        options[MLNTileSourceOptionTileCoordinateSystem] = [NSNumber numberWithUnsignedInteger:MLNTileCoordinateSystemTMS];
    }
    
    if (self.attribution != nil) {
        options[MLNTileSourceOptionAttributionHTMLString] = self.attribution;
    }
    
    return options;
}
@end
