#import "MLRNNativeUserLocationComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "MLRNNativeUserLocation.h"

using namespace facebook::react;

@interface MLRNNativeUserLocationComponentView () <RCTMLRNNativeUserLocationViewProtocol>

@end

@implementation MLRNNativeUserLocationComponentView {
  MLRNNativeUserLocation *_view;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const MLRNNativeUserLocationProps>();
    _props = defaultProps;
    [self prepareView];
  }

  return self;
}

- (void)prepareView {
  _view = [[MLRNNativeUserLocation alloc] init];
  self.contentView = _view;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<MLRNNativeUserLocationProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<MLRNNativeUserLocationProps const>(props);

  if (oldViewProps.mode != newViewProps.mode) {
    [_view setShowsUserHeadingIndicator:newViewProps.mode != MLRNNativeUserLocationMode::Default];
  }

  [super updateProps:props oldProps:oldProps];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNNativeUserLocationComponentDescriptor>();
}

@end
