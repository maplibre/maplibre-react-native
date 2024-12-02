//
//  MLRNUserLocation.h
//  MLRN

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <MapLibre/MLNUserLocationAnnotationView.h>

@interface MLRNUserLocation : NSObject

+ (id)sharedInstance;

- (MLNUserLocationAnnotationView*)hiddenUserAnnotation;

@end
