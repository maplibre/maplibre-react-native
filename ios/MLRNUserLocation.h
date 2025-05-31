//
//  MLRNUserLocation.h
//  MLRN

#import <CoreLocation/CoreLocation.h>
#import <Foundation/Foundation.h>
#import <MapLibre/MLNUserLocationAnnotationView.h>

@interface MLRNUserLocation : NSObject

+ (id)sharedInstance;

- (MLNUserLocationAnnotationView*)hiddenUserAnnotation;

@end
