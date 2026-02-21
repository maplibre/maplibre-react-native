
#import "MLRNMarkerViewContentComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import <React/RCTFabricComponentsPlugins.h>

#import <React/RCTConversions.h>

using namespace facebook::react;

// MARK: - MLRNMarkerViewContentComponentView

@interface MLRNMarkerViewContentComponentView () <RCTMLRNMarkerViewContentViewProtocol>

@end

@implementation MLRNMarkerViewContentComponentView {
  UIView *_view;
  CGRect _frame;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const MLRNMarkerViewContentProps>();
    _props = defaultProps;
    _frame = frame;
  }

  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNMarkerViewContentComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> MLRNMarkerViewContentCls(void) {
  return MLRNMarkerViewContentComponentView.class;
}
