//
//  ViewManager.h
//  MLRN
//
//  Created by Nick Italiano on 8/31/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <React/RCTViewManager.h>
#import "MLRNEvent.h"

@interface ViewManager : RCTViewManager

-(void)fireEvent:(MLRNEvent*)event withCallback:(RCTBubblingEventBlock)callback;

@end
