#import "MLRNSymbolLayer.h"
#import "MLRNStyle.h"

#import <React/RCTLog.h>

@implementation MLRNSymbolLayer

- (MLNSymbolStyleLayer*)makeLayer:(MLNStyle*)style
{
    MLNSource *source = [self layerWithSourceIDInStyle: style];
    if (source == nil) { return nil; }
    MLNSymbolStyleLayer *layer = [[MLNSymbolStyleLayer alloc] initWithIdentifier:self.id source:source];
    layer.sourceLayerIdentifier = self.sourceLayerID;
    return layer;
}

- (void)addStyles
{
    MLRNStyle *style = [[MLRNStyle alloc] initWithMLNStyle:self.style];
    style.bridge = self.bridge;
    [style symbolLayer:(MLNSymbolStyleLayer*)self.styleLayer withReactStyle:self.reactStyle isValid:^{ return [self isAddedToMap];
    }];
}

@end
