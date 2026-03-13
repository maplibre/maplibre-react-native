#import <MapLibre/MapLibre.h>
#import <React/RCTConvert.h>

@interface MLRNUtils : NSObject

+ (CLLocationCoordinate2D)fromFeature:(NSString *)json;

+ (CLLocationCoordinate2D)fromLongitude:(NSNumber *)longitude latitude:(NSNumber *)latitude;

+ (NSArray<NSDictionary *> *)featuresToJSON:(NSArray<id<MLNFeature>> *)features;

+ (MLNShape *)shapeFromGeoJSON:(NSString *)json;

+ (MLNCoordinateBounds)fromFeatureCollection:(NSString *)json;

+ (MLNCoordinateBounds)fromReactBounds:(NSArray<NSNumber *> *)bounds;

+ (NSArray<NSNumber *> *)fromCoordinateBounds:(MLNCoordinateBounds)bounds;

+ (NSTimeInterval)fromMS:(NSNumber *)number;
+ (NSNumber *)clamp:(NSNumber *)value min:(NSNumber *)min max:(NSNumber *)max;

+ (UIColor *)toColor:(id)value;

+ (CGVector)toCGVector:(NSArray<NSNumber *> *)arr;

+ (UIEdgeInsets)toUIEdgeInsets:(NSArray<NSNumber *> *)arr;

+ (NSURL *)styleURLFromMapStyle:(NSString *)mapStyle;
+ (NSURL *)styleURLFromStyleJSON:(NSString *)styleJSON;

@end
