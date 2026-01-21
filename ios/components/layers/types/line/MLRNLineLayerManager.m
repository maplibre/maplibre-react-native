#import "MLRNLineLayerManager.h"
#import "MLRNLineLayer.h"

@implementation MLRNLineLayerManager

RCT_EXPORT_MODULE()

- (UIView *)createLayerView {
  MLRNLineLayer *layer = [MLRNLineLayer new];
  return layer;
}

@end
