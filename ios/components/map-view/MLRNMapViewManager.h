#import "ViewManager.h"
#import <MapLibre/MapLibre.h>

@interface MLRNMapViewManager : ViewManager

- (void)didTapMap:(UITapGestureRecognizer *)recognizer;
- (void)didLongPressMap:(UILongPressGestureRecognizer *)recognizer;

@end
