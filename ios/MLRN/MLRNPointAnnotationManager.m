#import "MLRNPointAnnotationManager.h"
#import "MLRNPointAnnotation.h"

@implementation MLRNPointAnnotationManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(id, NSString)
RCT_EXPORT_VIEW_PROPERTY(anchor, NSDictionary)

RCT_REMAP_VIEW_PROPERTY(selected, reactSelected, BOOL)
RCT_REMAP_VIEW_PROPERTY(title, reactTitle, NSString)
RCT_REMAP_VIEW_PROPERTY(snippet, reactSnippet, NSString)
RCT_REMAP_VIEW_PROPERTY(coordinate, reactCoordinate, NSString)
RCT_REMAP_VIEW_PROPERTY(draggable, reactDraggable, BOOL)

RCT_REMAP_VIEW_PROPERTY(onMapboxPointAnnotationSelected, onSelected, RCTBubblingEventBlock)
RCT_REMAP_VIEW_PROPERTY(onMapboxPointAnnotationDeselected, onDeselected, RCTBubblingEventBlock)
RCT_REMAP_VIEW_PROPERTY(onMapboxPointAnnotationDragStart, onDragStart, RCTBubblingEventBlock)
RCT_REMAP_VIEW_PROPERTY(onMapboxPointAnnotationDrag, onDrag, RCTBubblingEventBlock)
RCT_REMAP_VIEW_PROPERTY(onMapboxPointAnnotationDragEnd, onDragEnd, RCTBubblingEventBlock)

- (UIView *)view
{
    return [[MLRNPointAnnotation alloc] init];
}

@end
