#import "MLRNImagesManager.h"
#import "MLRNImages.h"

@implementation MLRNImagesManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(id, NSString)
RCT_EXPORT_VIEW_PROPERTY(images, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(nativeImages, NSArray)

RCT_REMAP_VIEW_PROPERTY(onImageMissing, onImageMissing, RCTBubblingEventBlock)

- (UIView*)view
{
    MLRNImages *images = [MLRNImages new];
    images.bridge = self.bridge;
    return images;
}

@end
