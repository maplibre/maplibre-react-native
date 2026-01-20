#import "MLRNFillExtrusionLayerManager.h"
#import "MLRNFillExtrusionLayer.h"

@implementation MLRNFillExtrusionLayerManager

RCT_EXPORT_MODULE()

// fill extrusion layer props
RCT_REMAP_VIEW_PROPERTY(source-layer, sourceLayerID, NSString);

// standard layer props
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
  MLRNFillExtrusionLayer *layer = [MLRNFillExtrusionLayer new];
  layer.bridge = self.bridge;
  return layer;
}

@end
