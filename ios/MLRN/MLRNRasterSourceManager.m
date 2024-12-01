#import "MLRNRasterSourceManager.h"
#import "MLRNRasterSource.h"

@implementation MLRNRasterSourceManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(id, NSString)
RCT_EXPORT_VIEW_PROPERTY(url, NSString)
RCT_EXPORT_VIEW_PROPERTY(tileUrlTemplates, NSArray)
RCT_EXPORT_VIEW_PROPERTY(attribution, NSString)

RCT_EXPORT_VIEW_PROPERTY(tileSize, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(minZoomLevel, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(maxZoomLevel, NSNumber)

RCT_EXPORT_VIEW_PROPERTY(tms, BOOL)

- (UIView*)view
{
    return [MLRNRasterSource new];
}

@end
