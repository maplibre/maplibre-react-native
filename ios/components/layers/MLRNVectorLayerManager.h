#import "MLRNLayerManager.h"

/**
 * Base view manager for MapLibre vector layers
 * Extends MLRNLayerManager with vector-specific properties (filter, source-layer)
 * Used by: Circle, Fill, FillExtrusion, Line, Symbol, and Heatmap layers
 */
@interface MLRNVectorLayerManager : MLRNLayerManager

@end
