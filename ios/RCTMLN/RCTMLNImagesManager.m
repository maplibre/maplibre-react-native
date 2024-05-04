#import "RCTMLNImagesManager.h"
#import "RCTMLNImages.h"

@implementation RCTMLNImagesManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(id, NSString)
RCT_EXPORT_VIEW_PROPERTY(images, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(nativeImages, NSArray)

RCT_REMAP_VIEW_PROPERTY(onImageMissing, onImageMissing, RCTBubblingEventBlock)

- (UIView*)view
{
    RCTMLNImages *images = [RCTMLNImages new];
    images.bridge = self.bridge;
    return images;
}

@end
