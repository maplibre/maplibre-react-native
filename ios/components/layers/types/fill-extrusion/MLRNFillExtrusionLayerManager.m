#import "MLRNFillExtrusionLayerManager.h"
#import "MLRNFillExtrusionLayer.h"

@implementation MLRNFillExtrusionLayerManager

RCT_EXPORT_MODULE()

- (UIView *)createLayerView {
  MLRNFillExtrusionLayer *layer = [MLRNFillExtrusionLayer new];
  return layer;
}

@end
