#import "MLRNHeatmapLayerManager.h"
#import "MLRNHeatmapLayer.h"

@implementation MLRNHeatmapLayerManager

RCT_EXPORT_MODULE()

- (UIView *)createLayerView {
  MLRNHeatmapLayer *layer = [MLRNHeatmapLayer new];
  return layer;
}

@end
