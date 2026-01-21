#import "MLRNCircleLayerManager.h"
#import "MLRNCircleLayer.h"
#import "MLRNLayerManager.h"

@implementation MLRNCircleLayerManager

RCT_EXPORT_MODULE()

- (UIView *)createLayerView {
  MLRNCircleLayer *layer = [MLRNCircleLayer new];
  return layer;
}

@end
