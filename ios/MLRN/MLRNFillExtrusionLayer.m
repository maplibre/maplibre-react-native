#import "MLRNFillExtrusionLayer.h"
#import "MLRNStyle.h"
#import <React/RCTLog.h>

@implementation MLRNFillExtrusionLayer

- (MLNFillExtrusionStyleLayer*)makeLayer:(MLNStyle*)style
{
    MLNSource *source = [self layerWithSourceIDInStyle:style];
    if (source == nil) { return nil; }
    MLNFillExtrusionStyleLayer *layer = [[MLNFillExtrusionStyleLayer alloc] initWithIdentifier:self.id source:source];
    layer.sourceLayerIdentifier = self.sourceLayerID;
    return layer;
}

- (void)addStyles
{
    MLRNStyle *style = [[MLRNStyle alloc] initWithMLNStyle:self.style];
    style.bridge = self.bridge;
    [style fillExtrusionLayer:(MLNFillExtrusionStyleLayer*)self.styleLayer withReactStyle:self.reactStyle isValid:^{ return [self isAddedToMap];
    }];
}

@end
