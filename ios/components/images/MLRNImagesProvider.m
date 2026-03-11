#import "MLRNImagesProvider.h"

@implementation MLRNImagesProvider

+ (instancetype)sharedInstance {
  static MLRNImagesProvider *_instance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _instance = [[MLRNImagesProvider alloc] init];
  });
  return _instance;
}

@end

