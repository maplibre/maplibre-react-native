#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

#import <React/RCTUIManager.h>
#import <React/RCTViewComponentView.h>

#ifndef MLRNMapViewComponentView_h
#define MLRNMapViewComponentView_h

NS_ASSUME_NONNULL_BEGIN

@interface MLRNMapViewComponentView : RCTViewComponentView

- (void)dispatchCameraChangedEvent:(NSDictionary*)event;

@end

NS_ASSUME_NONNULL_END

#endif
