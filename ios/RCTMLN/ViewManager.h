//
//  ViewManager.h
//  RCTMLN
//
//  Created by Nick Italiano on 8/31/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <React/RCTViewManager.h>
#import "RCTMLNEvent.h"

@interface ViewManager : RCTViewManager

-(void)fireEvent:(RCTMLNEvent*)event withCallback:(RCTBubblingEventBlock)callback;

@end
