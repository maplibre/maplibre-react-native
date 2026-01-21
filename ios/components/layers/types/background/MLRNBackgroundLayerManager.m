#import "MLRNBackgroundLayerManager.h"
#import "MLRNBackgroundLayer.h"

@implementation MLRNBackgroundLayerManager

RCT_EXPORT_MODULE()

- (UIView *)createLayerView {
  MLRNBackgroundLayer *layer = [[MLRNBackgroundLayer alloc] init];
  return layer;
}

@end
