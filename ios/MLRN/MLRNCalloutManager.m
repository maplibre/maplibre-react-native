#import "MLRNCalloutManager.h"
#import "MLRNCallout.h"

@implementation MLRNCalloutManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[MLRNCallout alloc] init];
}

@end
