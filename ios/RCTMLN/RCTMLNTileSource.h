//
//  RCTMLNTileSource.h
//  RCTMLN
//

#import "RCTMLNSource.h"
@import MapLibre;

@interface RCTMLNTileSource : RCTMLNSource

@property (nonatomic, copy) NSString *url;
@property (nonatomic, strong) NSArray<NSString *> *tileUrlTemplates;
@property (nonatomic, copy) NSString *attribution;

@property (nonatomic, strong) NSNumber *minZoomLevel;
@property (nonatomic, strong) NSNumber *maxZoomLevel;

@property (nonatomic, assign) BOOL tms;

- (NSDictionary<MLNTileSourceOption, id>*)getOptions;

@end
