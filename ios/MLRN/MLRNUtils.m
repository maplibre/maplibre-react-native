#import "MLRNUtils.h"
#import "MLRNImageQueue.h"

@import MapLibre;

@implementation MLRNUtils

static double const MS_TO_S = 0.001;

+ (CLLocationCoordinate2D)fromFeature:(NSString *)jsonStr {
  NSData *data = [jsonStr dataUsingEncoding:NSUTF8StringEncoding];
  MLNPointFeature *feature = (MLNPointFeature *)[MLNShape shapeWithData:data
                                                               encoding:NSUTF8StringEncoding
                                                                  error:nil];
  return feature.coordinate;
}

+ (UIEdgeInsets)toUIEdgeInsets:(NSArray<NSNumber *> *)arr {
  return UIEdgeInsetsMake([arr[0] floatValue], [arr[1] floatValue], [arr[2] floatValue],
                          [arr[3] floatValue]);
}

+ (MLNShape *)shapeFromGeoJSON:(NSString *)jsonStr {
  NSData *data = [jsonStr dataUsingEncoding:NSUTF8StringEncoding];
  NSError *error = nil;
  MLNShape *result = [MLNShape shapeWithData:data encoding:NSUTF8StringEncoding error:&error];
  if (error != nil) {
    RCTLogWarn(@"Failed to convert data to shape error:%@ src:%@", error, jsonStr);
  }
  return result;
}

+ (NSString *)hashURI:(NSString *)uri {
  if (uri == nil) {
    return @"-1";
  }
  NSUInteger hash = [uri hash];
  return [NSString stringWithFormat:@"%lu", (unsigned long)hash];
}

+ (MLNCoordinateBounds)fromFeatureCollection:(NSString *)jsonStr {
  NSData *data = [jsonStr dataUsingEncoding:NSUTF8StringEncoding];
  MLNShapeCollectionFeature *featureCollection =
      (MLNShapeCollectionFeature *)[MLNShapeCollectionFeature shapeWithData:data
                                                                   encoding:NSUTF8StringEncoding
                                                                      error:nil];

  CLLocationCoordinate2D ne = featureCollection.shapes[0].coordinate;
  CLLocationCoordinate2D sw = featureCollection.shapes[1].coordinate;

  return MLNCoordinateBoundsMake(sw, ne);
}

+ (NSArray<NSNumber *> *)fromCoordinateBounds:(MLNCoordinateBounds)bounds {
  return @[
    @[ @(bounds.ne.longitude), @(bounds.ne.latitude) ],
    @[ @(bounds.sw.longitude), @(bounds.sw.latitude) ]
  ];
}

+ (NSTimeInterval)fromMS:(NSNumber *)number {
  return [number doubleValue] * MS_TO_S;
}

+ (NSNumber *)clamp:(NSNumber *)value min:(NSNumber *)min max:(NSNumber *)max {
  if ([value doubleValue] < [min doubleValue]) return min;
  if ([value doubleValue] > [max doubleValue]) return max;
  return value;
}

+ (UIColor *)toColor:(id)value {
  return [RCTConvert UIColor:value];
}

+ (CGVector)toCGVector:(NSArray<NSNumber *> *)arr {
  return CGVectorMake([arr[0] floatValue], [arr[1] floatValue]);
}

+ (void)fetchImage:(RCTBridge *)bridge
               url:(NSString *)url
             scale:(double)scale
             sdf:(Boolean)sdf
          callback:(RCTImageLoaderCompletionBlock)callback {
  [MLRNImageQueue.sharedInstance addImage:url scale:scale bridge:bridge completionHandler:callback];
}

+ (void)fetchImages:(RCTBridge *)bridge
              style:(MLNStyle *)style
            objects:(NSDictionary<NSString *, id> *)objects
        forceUpdate:(BOOL)forceUpdate
           callback:(void (^)(void))callback {
  if (objects == nil) {
    callback();
    return;
  }

  NSArray<NSString *> *imageNames = objects.allKeys;
  if (imageNames.count == 0) {
    callback();
    return;
  }

  __block NSUInteger imagesLeftToLoad = imageNames.count;
  __weak MLNStyle *weakStyle = style;

  void (^imageLoadedBlock)(void) = ^{
    imagesLeftToLoad--;

    if (imagesLeftToLoad == 0) {
      callback();
    }
  };

  for (NSString *imageName in imageNames) {
    UIImage *foundImage = forceUpdate ? nil : [style imageForName:imageName];

    if (forceUpdate || foundImage == nil) {
      NSDictionary *image = objects[imageName];
      BOOL hasScale =
          [image isKindOfClass:[NSDictionary class]] && ([image objectForKey:@"scale"] != nil);
      BOOL hasSdf = [image isKindOfClass:[NSDictionary class]] && ([image objectForKey:@"sdf"] != nil);
      double scale = hasScale ? [[image objectForKey:@"scale"] doubleValue] : 1.0;
      double sdf = hasSdf ? [[image objectForKey:@"sdf"] boolValue] : false;
      [MLRNImageQueue.sharedInstance addImage:objects[imageName]
                                        scale:scale
                                        sdf:sdf
                                       bridge:bridge
                            completionHandler:^(NSError *error, UIImage *image) {
                              if (!image) {
                                RCTLogWarn(@"Failed to fetch image: %@ error:%@", imageName, error);
                              } else {
                                dispatch_async(dispatch_get_main_queue(), ^{
                                  [weakStyle setImage:image forName:imageName];
                                  imageLoadedBlock();
                                });
                              }
                            }];
    } else {
      imageLoadedBlock();
    }
  }
}

+ (NSString *)getStyleJsonTempDirectory {
  static NSString *styleJsonTempDirectory;
  if (!styleJsonTempDirectory) {
    styleJsonTempDirectory =
        [NSTemporaryDirectory() stringByAppendingPathComponent:@"MLRNStyleJSON"];
  }
  return styleJsonTempDirectory;
}

/**
 * Clears cached style-json entries from previous app runs. Can be safely called multiple times as
 * it will only perform the action once per app run.
 *
 * @see styleURLFromStyleJSON:
 */
+ (void)cleanCustomStyleJSONCacheIfNeeded {
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSString *styleJsonTempDirectory = [MLRNUtils getStyleJsonTempDirectory];

  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    if ([fileManager fileExistsAtPath:styleJsonTempDirectory]) {
      [fileManager removeItemAtPath:styleJsonTempDirectory error:NULL];
    }
  });
}

/**
 * Provides a way to convert raw style-json into a file so it can be directly referenced / used as
 * styleURL. It's a crude / alternative approach to support Android's API: Style.Builder.fromJson().
 */
+ (NSURL *)styleURLFromStyleJSON:(NSString *)styleJSON {
  [MLRNUtils cleanCustomStyleJSONCacheIfNeeded];

  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSString *styleJsonTempDirectory = [MLRNUtils getStyleJsonTempDirectory];

  // attempt to create the temporary directory
  if (![fileManager fileExistsAtPath:styleJsonTempDirectory]) {
    NSError *error;
    [fileManager createDirectoryAtPath:styleJsonTempDirectory
           withIntermediateDirectories:YES
                            attributes:nil
                                 error:&error];
    if (error) {
      RCTLogError(@"Failed to create temporary directory '%@' for storing style-json. Error: %@",
                  styleJsonTempDirectory, error);
      return nil;
    }
  }

  // Determine filename based on the md5 hash of the style-json.
  // This way, the written file can also act as a cached entry in case
  // the same style-json is used again.
  NSString *hashedFilename = [RCTMD5Hash(styleJSON) stringByAppendingPathExtension:@"json"];

  // Construct temporary file path (tempdir + md5 hash for filename)
  NSString *styleJsonTempPath =
      [styleJsonTempDirectory stringByAppendingPathComponent:hashedFilename];
  NSURL *styleJsonTempURL = [NSURL fileURLWithPath:styleJsonTempPath isDirectory:false];

  // Write style-json to temporary file in case it doesn't already exist
  if (![fileManager fileExistsAtPath:styleJsonTempPath isDirectory:false]) {
    NSError *error;
    [styleJSON writeToURL:styleJsonTempURL
               atomically:YES
                 encoding:NSUTF8StringEncoding
                    error:&error];
    if (error) {
      RCTLogError(@"Failed to write style-json to temporary file '%@'. Error: %@", styleJsonTempURL,
                  error);
      return nil;
    }
  }

  return styleJsonTempURL;
}

@end
