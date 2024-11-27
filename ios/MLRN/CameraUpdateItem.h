//
//  CameraUpdateItem.h
//  MLRN
//
//  Created by Nick Italiano on 9/6/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "CameraStop.h"
#import "MLRNMapView.h"

@interface CameraUpdateItem : NSObject

@property (nonatomic, strong) CameraStop* _Nonnull cameraStop;

- (void)execute:(MLRNMapView* _Nonnull)mapView withCompletionHandler:(nullable void (^)(void))completionHandler;

@end
