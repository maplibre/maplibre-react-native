#import "MLRNTileSource.h"

@implementation MLRNTileSource

- (NSDictionary<MLNTileSourceOption, id> *)getOptions {
  NSMutableDictionary<MLNTileSourceOption, id> *options = [[NSMutableDictionary alloc] init];

  if (self.maxZoomLevel != nil) {
    options[MLNTileSourceOptionMaximumZoomLevel] = self.maxZoomLevel;
  }

  if (self.minZoomLevel != nil) {
    options[MLNTileSourceOptionMinimumZoomLevel] = self.minZoomLevel;
  }

  if (self.scheme != nil) {
    options[MLNTileSourceOptionTileCoordinateSystem] = self.scheme;
  }

  if (self.attribution != nil) {
    options[MLNTileSourceOptionAttributionHTMLString] = self.attribution;
  }

  return options;
}
@end
