#import "MLRNPointAnnotationManager.h"
#import "MLRNPointAnnotation.h"

@implementation MLRNPointAnnotationManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(id, NSString)
RCT_EXPORT_VIEW_PROPERTY(anchor, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(offset, NSDictionary)

RCT_REMAP_VIEW_PROPERTY(selected, reactSelected, BOOL)
RCT_REMAP_VIEW_PROPERTY(title, reactTitle, NSString)
RCT_REMAP_VIEW_PROPERTY(snippet, reactSnippet, NSString)
RCT_REMAP_VIEW_PROPERTY(lngLat, reactLngLat, NSArray)
RCT_REMAP_VIEW_PROPERTY(draggable, reactDraggable, BOOL)

RCT_REMAP_VIEW_PROPERTY(onSelected, reactOnSelected, RCTBubblingEventBlock)
RCT_REMAP_VIEW_PROPERTY(onDeselected, reactOnDeselected, RCTBubblingEventBlock)
RCT_REMAP_VIEW_PROPERTY(onDragStart, reactOnDragStart, RCTBubblingEventBlock)
RCT_REMAP_VIEW_PROPERTY(onDrag, reactOnDrag, RCTBubblingEventBlock)
RCT_REMAP_VIEW_PROPERTY(onDragEnd, reactOnDragEnd, RCTBubblingEventBlock)

- (UIView *)view {
  return [[MLRNPointAnnotation alloc] init];
}

@end
