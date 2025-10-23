#import "MLRNEventTypes.h"

@implementation MLRNEventTypes

NSString *const RCT_MLRN_PRESS = @"Press";
NSString *const RCT_MLRN_LONG_PRESS = @"LongPress";

NSString *const RCT_MLRN_ANNOTATION_TAP = @"AnnotationTap";

NSString *const RCT_MLRN_OFFLINE_PROGRESS = @"OfflineProgress";
NSString *const RCT_MLRN_OFFLINE_ERROR = @"OfflineError";
NSString *const RCT_MLRN_OFFLINE_TILE_LIMIT = @"OfflineTileLimit";

NSString *const RCT_MLRN_SHAPE_SOURCE_LAYER_PRESS = @"ShapeSourceLayerPress";
NSString *const RCT_MLRN_VECTOR_SOURCE_LAYER_PRESS = @"VectorSourceLayerPress";

NSString *const RCT_MLRN_MISSING_IMAGE = @"MissingImage";

NSString *const RCT_MLRN_USER_LOCATION_UPDATE = @"UserLocationUpdate";

@end
