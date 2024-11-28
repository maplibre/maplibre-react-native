//
//  CameraUpdateQueue.h
//  MLRN
//
//  Created by Nick Italiano on 9/6/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "CameraStop.h"
#import "CameraUpdateItem.h"
#import "MLRNMapView.h"

@interface CameraUpdateQueue : NSObject

- (void)enqueue:(CameraStop* _Nonnull)cameraUpdateItem;
- (CameraStop* _Nonnull)dequeue;
- (void)flush;
- (BOOL)isEmpty;
- (void)execute:(MLRNMapView* _Nonnull)mapView;

@end
