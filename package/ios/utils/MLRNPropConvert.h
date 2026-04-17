#pragma once

#import "MLRNFollyConvert.h"

/**
 * Macros for safely converting folly::dynamic props to Objective-C types.
 *
 * In the New Architecture, missing optional props may be passed as null
 * (folly::dynamic::Type::NULLT) which convertFollyDynamicToId() converts to
 * NSNull instead of nil. These macros check for null before conversion.
 */

// Convert object-type props (NSDictionary), returns nil for null/non-object
#define MLRN_DYNAMIC_TO_DICT(prop) ((!prop.isNull() && prop.isObject()) ? convertFollyDynamicToId(prop) : nil)

// Convert array-type props (NSArray), returns nil for null/non-array
#define MLRN_DYNAMIC_TO_ARRAY(prop) ((!prop.isNull() && prop.isArray()) ? convertFollyDynamicToId(prop) : nil)
