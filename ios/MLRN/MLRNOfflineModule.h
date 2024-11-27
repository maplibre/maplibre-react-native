//
//  MLRNOfflineModule.h
//  MLRN
//
//  Created by Nick Italiano on 10/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@import MapLibre;

@interface MLRNOfflineModule : RCTEventEmitter<RCTBridgeModule>

extern NSString *const RCT_MAPBOX_OFFLINE_CALLBACK_PROGRESS;
extern NSString *const RCT_MAPBOX_OFFLINE_CALLBACK_ERROR;

@end
