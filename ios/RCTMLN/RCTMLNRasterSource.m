//
//  RCTMLNRasterSource.m
//  RCTMLN
//
//  Created by Nick Italiano on 9/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNRasterSource.h"

@implementation RCTMLNRasterSource

- (nullable MLNSource*)makeSource
{
    if (self.url != nil) {
        NSURL *url = [NSURL URLWithString:self.url];
        if (self.tileSize != nil) {
            return [[MLNRasterTileSource alloc] initWithIdentifier:self.id configurationURL:url tileSize:[self.tileSize floatValue]];
        }
        return [[MLNRasterTileSource alloc] initWithIdentifier:self.id configurationURL:url];
    }
    return [[MLNRasterTileSource alloc] initWithIdentifier:self.id tileURLTemplates:self.tileUrlTemplates options:[self getOptions]];
}

- (NSDictionary<MLNTileSourceOption,id> *)getOptions {
    NSMutableDictionary<MLNTileSourceOption, id> *options = [[NSMutableDictionary alloc] initWithDictionary:[super getOptions]];
    
    if (self.tileSize != nil) {
        options[MLNTileSourceOptionTileSize] = _tileSize;
    }
    
    return options;
}

@end
