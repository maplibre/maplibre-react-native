#import "MLRNCalloutComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import <React/RCTConversions.h>
#import "MLRNCallout.h"

using namespace facebook::react;

// MARK: - MLRNCalloutComponentView

@interface MLRNCalloutComponentView () <RCTMLRNCalloutViewProtocol>

@end

@implementation MLRNCalloutComponentView {
  MLRNCallout *_view;
}

+ (BOOL)shouldBeRecycled {
  return NO;
}

- (UIView *)contentView {
  // Return _view so PointAnnotation's mountChildComponentView can detect this as a Callout
  // via: [contentView isKindOfClass:[MLRNCallout class]]
  return _view;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const MLRNCalloutProps>();
    _props = defaultProps;
    [self prepareView];
  }

  return self;
}

- (void)prepareView {
  _view = [[MLRNCallout alloc] init];
}

#pragma mark - Child Mounting

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                          index:(NSInteger)index {
  // Add children to _view (the MLRNCallout) so they're visible when presented
  // This includes the Animated.View with title/content that React renders
  [_view insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                            index:(NSInteger)index {
  [childComponentView removeFromSuperview];
}

- (void)updateLayoutMetrics:(const facebook::react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const facebook::react::LayoutMetrics &)oldLayoutMetrics {
  [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];

  // Forward layout to _view so the callout has the correct size
  CGRect frame = CGRectMake(layoutMetrics.frame.origin.x, layoutMetrics.frame.origin.y,
                            layoutMetrics.frame.size.width, layoutMetrics.frame.size.height);
  _view.frame = frame;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  [super updateProps:props oldProps:oldProps];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNCalloutComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> MLRNCalloutCls(void) { return MLRNCalloutComponentView.class; }
