#import "MLRNVectorLayerManager.h"

@implementation MLRNVectorLayerManager

// Source prop (required for vector layers)
RCT_REMAP_VIEW_PROPERTY(source, sourceID, NSString);

// Vector layer specific props
RCT_EXPORT_VIEW_PROPERTY(filter, NSArray);
RCT_REMAP_VIEW_PROPERTY(sourceLayer, sourceLayerID, NSString);

@end
