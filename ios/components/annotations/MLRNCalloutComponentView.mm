#ifdef RCT_NEW_ARCH_ENABLED

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
  self.contentView = _view;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  [super updateProps:props oldProps:oldProps];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNCalloutComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> MLRNCalloutCls(void) {
  return MLRNCalloutComponentView.class;
}

#endif
