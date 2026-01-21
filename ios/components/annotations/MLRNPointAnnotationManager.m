#import "MLRNPointAnnotationManager.h"
#import "MLRNPointAnnotation.h"

@implementation MLRNPointAnnotationManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(id, NSString)
RCT_EXPORT_VIEW_PROPERTY(anchor, NSDictionary)

RCT_REMAP_VIEW_PROPERTY(selected, reactSelected, BOOL)
RCT_REMAP_VIEW_PROPERTY(title, reactTitle, NSString)
RCT_REMAP_VIEW_PROPERTY(snippet, reactSnippet, NSString)
RCT_REMAP_VIEW_PROPERTY(lngLat, reactLngLat, NSArray)
RCT_REMAP_VIEW_PROPERTY(draggable, reactDraggable, BOOL)

RCT_EXPORT_VIEW_PROPERTY(onSelected, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDeselected, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDragStart, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDrag, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDragEnd, RCTBubblingEventBlock)

- (UIView *)view {
  return [[MLRNPointAnnotation alloc] init];
}

@end
