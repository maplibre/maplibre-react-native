#import "MLRNLightManager.h"
#import "MLRNLight.h"

@implementation MLRNLightManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(reactStyle, NSDictionary);

- (UIView*)view
{
    return [MLRNLight new];
}

@end
