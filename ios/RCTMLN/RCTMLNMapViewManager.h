//
//  RCTMLNMapViewManager.h
//  RCTMLN
//
//  Created by Nick Italiano on 8/23/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "ViewManager.h"
@import MapLibre;

@interface RCTMLNMapViewManager : ViewManager

- (void)didTapMap:(UITapGestureRecognizer *)recognizer;
- (void)didLongPressMap:(UILongPressGestureRecognizer *)recognizer;

@end
