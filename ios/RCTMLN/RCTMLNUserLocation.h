//
//  RCTMLNUserLocation.h
//  RCTMLN

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <MapLibre/MLNUserLocationAnnotationView.h>

@interface RCTMLNUserLocation : NSObject

+ (id)sharedInstance;

- (MLNUserLocationAnnotationView*)hiddenUserAnnotation;

@end
