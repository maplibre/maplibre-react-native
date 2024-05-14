//
//  MLNFaux3DUserLocationAnnotationView.h
//  RCTMLN
//
//  Created by Nick Italiano on 12/20/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <UIKit/UIKit.h>
@import MapLibre;

extern const CGFloat MLNUserLocationAnnotationDotSize;
extern const CGFloat MLNUserLocationAnnotationHaloSize;

extern const CGFloat MLNUserLocationAnnotationPuckSize;
extern const CGFloat MLNUserLocationAnnotationArrowSize;

// Threshold in radians between heading indicator rotation updates.
extern const CGFloat MLNUserLocationHeadingUpdateThreshold;

@interface MLNFaux3DUserLocationAnnotationView : MLNUserLocationAnnotationView

@end
