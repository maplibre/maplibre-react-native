//
//  CameraUpdateQueue.h
//  RCTMLN
//
//  Created by Nick Italiano on 9/6/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "CameraStop.h"
#import "CameraUpdateItem.h"
#import "RCTMLNMapView.h"

@interface CameraUpdateQueue : NSObject

- (void)enqueue:(CameraStop* _Nonnull)cameraUpdateItem;
- (CameraStop* _Nonnull)dequeue;
- (void)flush;
- (BOOL)isEmpty;
- (void)execute:(RCTMLNMapView* _Nonnull)mapView;

@end
