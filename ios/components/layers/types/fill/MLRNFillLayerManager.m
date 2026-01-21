#import "MLRNFillLayerManager.h"
#import "MLRNFillLayer.h"

@implementation MLRNFillLayerManager

RCT_EXPORT_MODULE();

- (UIView *)createLayerView {
  MLRNFillLayer *layer = [MLRNFillLayer new];
  return layer;
}

@end
