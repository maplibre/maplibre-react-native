#import "MLRNRasterDEMSource.h"

@implementation MLRNRasterDEMSource

- (nullable MLNSource *)makeSource {
  if (self.url != nil) {
    NSURL *url = [NSURL URLWithString:self.url];
    if (self.tileSize != nil) {
      return [[MLNRasterDEMSource alloc] initWithIdentifier:self.id
                                            configurationURL:url
                                                    tileSize:[self.tileSize floatValue]];
    }
    return [[MLNRasterDEMSource alloc] initWithIdentifier:self.id configurationURL:url];
  }
  return [[MLNRasterDEMSource alloc] initWithIdentifier:self.id
                                        tileURLTemplates:self.tileUrlTemplates
                                                 options:[self getOptions]];
}

- (NSDictionary<MLNTileSourceOption, id> *)getOptions {
  NSMutableDictionary<MLNTileSourceOption, id> *options =
      [[NSMutableDictionary alloc] initWithDictionary:[super getOptions]];

  if (self.tileSize != nil) {
    options[MLNTileSourceOptionTileSize] = _tileSize;
  }

  if (self.encoding != nil) {
    MLNDEMEncoding demEncoding = MLNDEMEncodingMapbox;
    if ([self.encoding isEqualToString:@"terrarium"]) {
      demEncoding = MLNDEMEncodingTerrarium;
    }
    options[MLNTileSourceOptionDEMEncoding] = @(demEncoding);
  }

  return options;
}

@end

