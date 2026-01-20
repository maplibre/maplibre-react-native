#import "MLRNBackgroundLayerManager.h"
#import "MLRNBackgroundLayer.h"

@implementation MLRNBackgroundLayerManager

RCT_EXPORT_MODULE()

// standard layer props
RCT_EXPORT_VIEW_PROPERTY(id, NSString);
RCT_REMAP_VIEW_PROPERTY(source, sourceID, NSString);

RCT_REMAP_VIEW_PROPERTY(afterId, aboveLayerID, NSString);
RCT_REMAP_VIEW_PROPERTY(beforeId, belowLayerID, NSString);
RCT_EXPORT_VIEW_PROPERTY(layerIndex, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(reactStyle, NSDictionary);

RCT_REMAP_VIEW_PROPERTY(maxzoom, maxZoomLevel, NSNumber);
RCT_REMAP_VIEW_PROPERTY(minzoom, minZoomLevel, NSNumber);

- (UIView *)view {
  MLRNBackgroundLayer *layer = [[MLRNBackgroundLayer alloc] init];
  layer.bridge = self.bridge;
  return layer;
}

@end
