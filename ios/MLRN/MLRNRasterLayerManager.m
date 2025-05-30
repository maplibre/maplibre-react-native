#import "MLRNRasterLayerManager.h"
#import "MLRNRasterLayer.h"

@implementation MLRNRasterLayerManager

RCT_EXPORT_MODULE()

// standard layer props
RCT_EXPORT_VIEW_PROPERTY(id, NSString);
RCT_EXPORT_VIEW_PROPERTY(sourceID, NSString);

RCT_EXPORT_VIEW_PROPERTY(aboveLayerID, NSString);
RCT_EXPORT_VIEW_PROPERTY(belowLayerID, NSString);
RCT_EXPORT_VIEW_PROPERTY(layerIndex, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(reactStyle, NSDictionary);

RCT_EXPORT_VIEW_PROPERTY(maxZoomLevel, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(minZoomLevel, NSNumber);

- (UIView *)view {
  MLRNRasterLayer *layer = [[MLRNRasterLayer alloc] init];
  layer.bridge = self.bridge;
  return layer;
}

@end
