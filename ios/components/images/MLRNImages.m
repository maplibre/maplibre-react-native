#import "MLRNImages.h"
#import <React/UIView+React.h>
#import "MLRNEvent.h"
#import "MLRNEventTypes.h"
#import "MLRNMapView.h"
#import "MLRNUtils.h"

@implementation MLRNImages : UIView

static UIImage *_placeHolderImage;

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _reactSubviews = [[NSMutableArray alloc] init];
  }
  return self;
}

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (void)insertReactSubview:(id<RCTComponent>)subview atIndex:(NSInteger)atIndex {
  [_reactSubviews insertObject:subview atIndex:atIndex];
}
#pragma clang diagnostic pop

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (void)removeReactSubview:(id<RCTComponent>)subview {
  [_reactSubviews removeObject:subview];
}
#pragma clang diagnostic pop

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (NSArray<id<RCTComponent>> *)reactSubviews {
  return _reactSubviews;
}
#pragma clang diagnostic pop

- (void)addToMap {
  if (self.map.style == nil) {
    return;
  }
  [self _processImages:_images];
}

- (void)removeFromMap {
  if (self.map.style == nil) {
    return;
  }
  [self _removeImages];
}

- (void)_removeImages {
  if (_images == nil || _images.count == 0) {
    return;
  }

  for (NSString *imageName in _images.allKeys) {
    [self.map.style removeImageForName:imageName];
  }
}

- (BOOL)_isNativeImageString:(NSString *)value {
  return [UIImage imageNamed:value] != nil;
}

- (void)_processImages:(NSDictionary *)images {
  if (!images || images.count == 0) return;

  NSMutableDictionary *nativeAssets = [NSMutableDictionary new];
  NSMutableDictionary *remoteImages = [NSMutableDictionary new];

  for (NSString *imageName in images.allKeys) {
    id value = images[imageName];

    if ([value isKindOfClass:[NSString class]]) {
      NSString *stringValue = (NSString *)value;
      if ([self _isNativeImageString:stringValue]) {
        nativeAssets[imageName] = stringValue;
      } else {
        remoteImages[imageName] = @{@"uri" : stringValue};
      }
    } else if ([value isKindOfClass:[NSDictionary class]]) {
      remoteImages[imageName] = value;
    }
  }

  // Add native assets first (synchronous)
  if (nativeAssets.count > 0) {
    [self _addNativeImages:nativeAssets];
  }

  // Then add remote images (may be async)
  if (remoteImages.count > 0) {
    [self _addRemoteImages:remoteImages];
  }
}

- (BOOL)addMissingImageToStyle:(NSString *)imageName {
  if (_images == nil) return false;

  id value = _images[imageName];
  if (value == nil) return false;

  if ([value isKindOfClass:[NSString class]]) {
    NSString *stringValue = (NSString *)value;
    if ([self _isNativeImageString:stringValue]) {
      [self _addNativeImages:@{imageName : stringValue}];
    } else {
      [self _addRemoteImages:@{imageName : @{@"uri" : stringValue}}];
    }
    return true;
  } else if ([value isKindOfClass:[NSDictionary class]]) {
    [self _addRemoteImages:@{imageName : value}];
    return true;
  }

  return false;
}

- (void)sendImageMissingEvent:(NSString *)imageName {
  NSDictionary *payload = @{@"image" : imageName};
  MLRNEvent *event = [MLRNEvent makeEvent:RCT_MLRN_MISSING_IMAGE withPayload:payload];
  if (_onImageMissing) {
    _onImageMissing([event toJSON]);
  }
}

- (void)_addNativeImages:(NSDictionary *)nativeImages {
  if (!nativeImages || nativeImages.count == 0) return;

  for (NSString *imageName in nativeImages.allKeys) {
    if (![self.map.style imageForName:imageName]) {
      // Get the asset name from the dictionary value
      NSString *assetName = nativeImages[imageName];
      if ([assetName isKindOfClass:[NSString class]]) {
        UIImage *image = [UIImage imageNamed:assetName];
        if (image) {
          [self.map.style setImage:image forName:imageName];
        }
      }
    }
  }
}

/**
 * Add remote images with async loading.
 * remoteImages is a dictionary where values are { uri: string, scale?: number, sdf?: boolean }
 */
- (void)_addRemoteImages:(NSDictionary *)remoteImages {
  if (!remoteImages || remoteImages.count == 0) return;

  NSMutableDictionary *missingImages = [NSMutableDictionary new];

  // Add image placeholder for images that are not yet available in the style. This way
  // we can load the images asynchronously and add the GeoJSONSource to the map without delay.
  // The same is required when this GeoJSONSource is updated with new/added images and the
  // data references them. In which case addMissingImageToStyle will take care of loading
  // them in a similar way.
  //
  // See also: https://github.com/mapbox/mapbox-gl-native/pull/14253#issuecomment-478827792
  for (NSString *imageName in remoteImages.allKeys) {
    if (![self.map.style imageForName:imageName]) {
      [self.map.style setImage:[MLRNImages placeholderImage] forName:imageName];
      missingImages[imageName] = remoteImages[imageName];
    }
  }

  if (missingImages.count > 0) {
    // forceUpdate to ensure the placeholder images are updated
    [MLRNUtils fetchImages:_bridge
                     style:self.map.style
                   objects:missingImages
               forceUpdate:true
                  callback:^{
                  }];
  }
}

+ (UIImage *)placeholderImage {
  if (_placeHolderImage) return _placeHolderImage;
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(1, 1), NO, 0.0);
  _placeHolderImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return _placeHolderImage;
}

@end
