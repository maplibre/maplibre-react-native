#import "MLRNFillLayerManager.h"
#import "MLRNFillLayer.h"

@implementation MLRNFillLayerManager

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(sourceLayerID, NSString);

RCT_EXPORT_VIEW_PROPERTY(id, NSString);
RCT_EXPORT_VIEW_PROPERTY(sourceID, NSString);
RCT_EXPORT_VIEW_PROPERTY(filter, NSArray);

RCT_EXPORT_VIEW_PROPERTY(aboveLayerID, NSString);
RCT_EXPORT_VIEW_PROPERTY(belowLayerID, NSString);
RCT_EXPORT_VIEW_PROPERTY(layerIndex, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(reactStyle, NSDictionary);

RCT_EXPORT_VIEW_PROPERTY(maxZoomLevel, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(minZoomLevel, NSNumber);

- (UIView*)view
{
    MLRNFillLayer *layer = [MLRNFillLayer new];
    layer.bridge = self.bridge;
    return layer;
}

@end
