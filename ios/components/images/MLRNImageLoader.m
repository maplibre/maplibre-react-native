#import "MLRNImageLoader.h"
#import "MLRNImageQueue.h"

#import <React/RCTLog.h>

@implementation MLRNImageLoader

+ (instancetype)sharedInstance {
  static MLRNImageLoader *_instance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _instance = [[MLRNImageLoader alloc] init];
  });
  return _instance;
}

+ (void)fetchImage:(NSString *)url
             scale:(double)scale
               sdf:(BOOL)sdf
          callback:(RCTImageLoaderCompletionBlock)callback {
  [MLRNImageQueue.sharedInstance addImage:url
                                    scale:scale
                                      sdf:sdf
                              imageLoader:[MLRNImageLoader sharedInstance].imageLoader
                        completionHandler:callback];
}

+ (void)fetchImages:(MLNStyle *)style
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
      BOOL hasSdf =
          [image isKindOfClass:[NSDictionary class]] && ([image objectForKey:@"sdf"] != nil);
      double scale = hasScale ? [[image objectForKey:@"scale"] doubleValue] : 1.0;
      BOOL sdf = hasSdf ? [[image objectForKey:@"sdf"] boolValue] : NO;
      [MLRNImageQueue.sharedInstance addImage:objects[imageName]
                                        scale:scale
                                          sdf:sdf
                                  imageLoader:[MLRNImageLoader sharedInstance].imageLoader
                            completionHandler:^(NSError *error, UIImage *img) {
                              if (!img) {
                                RCTLogWarn(@"Failed to fetch image: %@ error:%@", imageName, error);
                              } else {
                                dispatch_async(dispatch_get_main_queue(), ^{
                                  [weakStyle setImage:img forName:imageName];
                                  imageLoadedBlock();
                                });
                              }
                            }];
    } else {
      imageLoadedBlock();
    }
  }
}

@end
