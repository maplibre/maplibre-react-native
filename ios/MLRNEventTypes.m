#import "MLRNEventTypes.h"

@implementation MLRNEventTypes

NSString *const RCT_MLRN_PRESS = @"Press";
NSString *const RCT_MLRN_LONG_PRESS = @"LongPress";

NSString *const RCT_MLRN_USER_TRACKING_MODE_CHANGE = @"UserTrackingModeChange";

NSString *const RCT_MLRN_REGION_WILL_CHANGE = @"RegionWillChange";
NSString *const RCT_MLRN_REGION_IS_CHANGING = @"RegionIsChanging";
NSString *const RCT_MLRN_REGION_DID_CHANGE = @"RegionDidChange";

NSString *const RCT_MLRN_WILL_START_LOADING_MAP = @"WillStartLoadingMap";
NSString *const RCT_MLRN_DID_FINISH_LOADING_MAP = @"DidFinishLoadingMap";
NSString *const RCT_MLRN_DID_FAIL_LOADING_MAP = @"DidFaiLoadingMap";

NSString *const RCT_MLRN_WILL_START_RENDERING_FRAME = @"WillStartRenderingFrame";
NSString *const RCT_MLRN_DID_FINISH_RENDERING_FRAME = @"DidFinishRenderingFrame";
NSString *const RCT_MLRN_DID_FINISH_RENDERING_FRAME_FULLY = @"DidFinishRenderingFrameFully";

NSString *const RCT_MLRN_WILL_START_RENDERING_MAP = @"WillStartRenderingMap";
NSString *const RCT_MLRN_DID_FINISH_RENDERING_MAP = @"DidFinishRenderingMap";
NSString *const RCT_MLRN_DID_FINISH_RENDERING_MAP_FULLY = @"DidFinishRenderingMapFully";

NSString *const RCT_MLRN_DID_FINISH_LOADING_STYLE = @"DidFinishLoadingStyle";

NSString *const RCT_MLRN_ANNOTATION_TAP = @"AnnotationTap";

NSString *const RCT_MLRN_OFFLINE_PROGRESS = @"OfflineProgress";
NSString *const RCT_MLRN_OFFLINE_ERROR = @"OfflineError";
NSString *const RCT_MLRN_OFFLINE_TILE_LIMIT = @"OfflineTileLimit";

NSString *const RCT_MLRN_SHAPE_SOURCE_LAYER_PRESS = @"ShapeSourceLayerPress";
NSString *const RCT_MLRN_VECTOR_SOURCE_LAYER_PRESS = @"VectorSourceLayerPress";

NSString *const RCT_MLRN_MISSING_IMAGE = @"MissingImage";

NSString *const RCT_MLRN_USER_LOCATION_UPDATE = @"UserLocationUpdate";

@end
