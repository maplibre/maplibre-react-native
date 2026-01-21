#import "MLRNLayerManager.h"

@implementation MLRNLayerManager

RCT_EXPORT_MODULE()

// Standard layer props - common to all layers
RCT_EXPORT_VIEW_PROPERTY(id, NSString);

RCT_REMAP_VIEW_PROPERTY(afterId, aboveLayerID, NSString);
RCT_REMAP_VIEW_PROPERTY(beforeId, belowLayerID, NSString);
RCT_EXPORT_VIEW_PROPERTY(layerIndex, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(reactStyle, NSDictionary);

RCT_REMAP_VIEW_PROPERTY(maxzoom, maxZoomLevel, NSNumber);
RCT_REMAP_VIEW_PROPERTY(minzoom, minZoomLevel, NSNumber);


- (UIView *)view {
  UIView *layer = [self createLayerView];
  if ([layer respondsToSelector:@selector(setBridge:)]) {
    [layer performSelector:@selector(setBridge:) withObject:self.bridge];
  }
  return layer;
}

- (UIView *)createLayerView {
  // Subclasses must override this
  @throw [NSException exceptionWithName:NSInternalInconsistencyException
                                 reason:[NSString stringWithFormat:@"You must override %@ in a subclass", NSStringFromSelector(_cmd)]
                               userInfo:nil];
}

@end
