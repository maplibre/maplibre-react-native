#import "MLRNSymbolLayerManager.h"
#import "MLRNSymbolLayer.h"

@implementation MLRNSymbolLayerManager

RCT_EXPORT_MODULE()

- (UIView *)createLayerView {
  MLRNSymbolLayer *layer = [MLRNSymbolLayer new];
  return layer;
}

@end
