#import <Foundation/Foundation.h>

@interface MLRNEventTypes : NSObject

extern NSString *const RCT_MLRN_PRESS;
extern NSString *const RCT_MLRN_LONG_PRESS;

extern NSString *const RCT_MLRN_USER_LOCATION_UPDATE;
extern NSString *const RCT_MLRN_USER_TRACKING_MODE_CHANGE;

extern NSString *const RCT_MLRN_REGION_WILL_CHANGE;
extern NSString *const RCT_MLRN_REGION_IS_CHANGING;
extern NSString *const RCT_MLRN_REGION_DID_CHANGE;

extern NSString *const RCT_MLRN_ANNOTATION_TAP;

extern NSString *const RCT_MLRN_OFFLINE_PROGRESS;
extern NSString *const RCT_MLRN_OFFLINE_ERROR;
extern NSString *const RCT_MLRN_OFFLINE_TILE_LIMIT;

extern NSString *const RCT_MLRN_SHAPE_SOURCE_LAYER_PRESS;
extern NSString *const RCT_MLRN_VECTOR_SOURCE_LAYER_PRESS;

extern NSString *const RCT_MLRN_USER_LOCATION_UPDATE;

extern NSString *const RCT_MLRN_MISSING_IMAGE;

@end
