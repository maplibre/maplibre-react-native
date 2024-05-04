//
//  MLNOfflineModule.h
//  RCTMLN
//
//  Created by Nick Italiano on 10/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@import MapLibre;

@interface MLNOfflineModule : RCTEventEmitter<RCTBridgeModule>

extern NSString *const RCT_MAPBOX_OFFLINE_CALLBACK_PROGRESS;
extern NSString *const RCT_MAPBOX_OFFLINE_CALLBACK_ERROR;

@end
