#import "MLRNFillLayerManager.h"
#import "MLRNFillLayer.h"

@implementation MLRNFillLayerManager

RCT_EXPORT_MODULE();

RCT_REMAP_VIEW_PROPERTY(source-layer, sourceLayerID, NSString);

RCT_EXPORT_VIEW_PROPERTY(id, NSString);
RCT_REMAP_VIEW_PROPERTY(source, sourceID, NSString);
RCT_EXPORT_VIEW_PROPERTY(filter, NSArray);

RCT_REMAP_VIEW_PROPERTY(afterId, aboveLayerID, NSString);
RCT_REMAP_VIEW_PROPERTY(beforeId, belowLayerID, NSString);
RCT_EXPORT_VIEW_PROPERTY(layerIndex, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(reactStyle, NSDictionary);

RCT_REMAP_VIEW_PROPERTY(maxzoom, maxZoomLevel, NSNumber);
RCT_REMAP_VIEW_PROPERTY(minzoom, minZoomLevel, NSNumber);

- (UIView *)view {
  MLRNFillLayer *layer = [MLRNFillLayer new];
  layer.bridge = self.bridge;
  return layer;
}

@end
