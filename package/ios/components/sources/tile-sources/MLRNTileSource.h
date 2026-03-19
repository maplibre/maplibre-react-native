#import "MLRNSource.h"

#import <MapLibre/MapLibre.h>

@interface MLRNTileSource : MLRNSource

@property (nonatomic, copy) NSString *url;
@property (nonatomic, strong) NSArray<NSString *> *tileUrlTemplates;
@property (nonatomic, copy) NSString *attribution;

@property (nonatomic, strong) NSNumber *minZoomLevel;
@property (nonatomic, strong) NSNumber *maxZoomLevel;

@property (nonatomic, strong) NSNumber *scheme;

- (NSDictionary<MLNTileSourceOption, id> *)getOptions;

@end
