#import "MLRNLineLayer.h"
#import "MLRNStyle.h"
#import <React/RCTLog.h>

@implementation MLRNLineLayer

- (MLNLineStyleLayer*)makeLayer:(MLNStyle*)style
{
    MLNSource *source = [self layerWithSourceIDInStyle:style];
    if (source == nil) { return nil; }
    MLNLineStyleLayer *layer = [[MLNLineStyleLayer alloc] initWithIdentifier:self.id source:source];
    layer.sourceLayerIdentifier = self.sourceLayerID;
    return layer;
}

- (void)addStyles
{
    MLRNStyle *style = [[MLRNStyle alloc] initWithMLNStyle:self.style];
    style.bridge = self.bridge;
    [style lineLayer:(MLNLineStyleLayer *)self.styleLayer withReactStyle:self.reactStyle isValid:^{
        return [self isAddedToMap];
    }];
}

@end
