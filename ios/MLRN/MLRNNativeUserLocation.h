//
//  MLRNCamera.h
//  MLRN
//
//  Created by Nick Italiano on 6/22/18.
//  Copyright © 2018 Mapbox Inc. All rights reserved.
//
#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

@class MLRNMapView;

@interface MLRNNativeUserLocation : UIView

@property (nonatomic, strong) MLRNMapView *map;
@property (nonatomic) BOOL iosShowsUserHeadingIndicator;

@end
