#import "MLRNImageSourceManager.h"
#import "MLRNImageSource.h"

@implementation MLRNImageSourceManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(id, NSString)
RCT_EXPORT_VIEW_PROPERTY(url, NSString)
RCT_EXPORT_VIEW_PROPERTY(coordinates, NSArray)

- (UIView*)view
{
    return [MLRNImageSource new];
}

@end
