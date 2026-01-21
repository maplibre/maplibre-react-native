#import <React/RCTViewManager.h>

/**
 * Base view manager for MapLibre layers
 * Provides common property mappings for all layer types
 */
@interface MLRNLayerManager : RCTViewManager

/**
 * Subclasses must implement this to return the appropriate layer instance
 */
- (UIView *)createLayerView;

@end
