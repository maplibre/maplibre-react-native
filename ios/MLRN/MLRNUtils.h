#import <MapKit/MapKit.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTImageLoader.h>

@import MapLibre;

@interface MLRNUtils: NSObject

+ (CLLocationCoordinate2D)fromFeature:(NSString*)json;
+ (MLNShape*)shapeFromGeoJSON:(NSString*)json;
+ (MLNCoordinateBounds)fromFeatureCollection:(NSString*)json;
+ (NSArray<NSNumber *> *)fromCoordinateBounds:(MLNCoordinateBounds)bounds;
+ (NSTimeInterval)fromMS:(NSNumber*)number;
+ (NSNumber*)clamp:(NSNumber*)value min:(NSNumber*)min max:(NSNumber*)max;
+ (UIColor*)toColor:(id)value;
+ (void)fetchImage:(RCTBridge*)bridge url:(NSString*)url scale:(double)scale callback:(RCTImageLoaderCompletionBlock)callback;
+ (void)fetchImages:(RCTBridge *)bridge style:(MLNStyle *)style objects:(NSDictionary<NSString *, NSString *>*)objects forceUpdate:(BOOL)forceUpdate callback:(void (^)(void))callback;
+ (CGVector)toCGVector:(NSArray<NSNumber*>*)arr;
+ (UIEdgeInsets)toUIEdgeInsets:(NSArray<NSNumber *> *)arr;
+ (NSURL*)styleURLFromStyleJSON:(NSString *)styleJSON;

@end
