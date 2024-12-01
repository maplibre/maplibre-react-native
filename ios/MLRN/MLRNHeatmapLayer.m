#import "MLRNHeatmapLayer.h"
#import "MLRNStyle.h"

@implementation MLRNHeatmapLayer

- (MLNHeatmapStyleLayer*)makeLayer:(MLNStyle*)style
{
    MLNSource *source = [self layerWithSourceIDInStyle:style];
    if (source == nil) { return nil; }
    MLNHeatmapStyleLayer *layer = [[MLNHeatmapStyleLayer alloc] initWithIdentifier:self.id source:source];
    layer.sourceLayerIdentifier = self.sourceLayerID;
    return layer;
}

- (void)addStyles
{
    MLRNStyle *style = [[MLRNStyle alloc] initWithMLNStyle:self.style];
    style.bridge = self.bridge;
    [style heatmapLayer:(MLNHeatmapStyleLayer *)self.styleLayer withReactStyle:self.reactStyle isValid:^{
        return [self isAddedToMap];
    }];
}

@end
