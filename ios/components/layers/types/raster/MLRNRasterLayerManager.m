#import "MLRNRasterLayerManager.h"
#import "MLRNRasterLayer.h"

@implementation MLRNRasterLayerManager

RCT_EXPORT_MODULE()

// Source prop (required for raster layers)
RCT_REMAP_VIEW_PROPERTY(source, sourceID, NSString);

- (UIView *)createLayerView {
  MLRNRasterLayer *layer = [[MLRNRasterLayer alloc] init];
  return layer;
}

@end
