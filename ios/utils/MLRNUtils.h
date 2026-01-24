#import <MapLibre/MapLibre.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTImageLoader.h>

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

+ (void)fetchImage:(RCTBridge *)bridge
               url:(NSString *)url
             scale:(double)scale
               sdf:(Boolean)sdf
          callback:(RCTImageLoaderCompletionBlock)callback;

+ (void)fetchImages:(RCTBridge *)bridge
              style:(MLNStyle *)style
            objects:(NSDictionary<NSString *, NSString *> *)objects
        forceUpdate:(BOOL)forceUpdate
           callback:(void (^)(void))callback;

+ (CGVector)toCGVector:(NSArray<NSNumber *> *)arr;

+ (UIEdgeInsets)toUIEdgeInsets:(NSArray<NSNumber *> *)arr;

+ (NSURL *)styleURLFromMapStyle:(NSString *)mapStyle;
+ (NSURL *)styleURLFromStyleJSON:(NSString *)styleJSON;

@end
