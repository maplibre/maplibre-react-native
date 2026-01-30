#import "MLRNImageSourceComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import <React/RCTConversions.h>
#import "MLRNImageSource.h"

#if __has_include(<react/utils/FollyConvert.h>)
#import <react/utils/FollyConvert.h>
#elif __has_include("FollyConvert.h")
#import "FollyConvert.h"
#endif

using namespace facebook::react;

// MARK: - MLRNImageSourceComponentView

@interface MLRNImageSourceComponentView () <RCTMLRNImageSourceViewProtocol>

@end

@implementation MLRNImageSourceComponentView {
  MLRNImageSource *_view;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const MLRNImageSourceProps>();
    _props = defaultProps;
    [self prepareView];
  }

  return self;
}

- (void)prepareView {
  _view = [[MLRNImageSource alloc] init];
  self.contentView = _view;
}

- (MLRNImageSource *)imageSource {
  return _view;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNImageSourceComponentDescriptor>();
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<const MLRNImageSourceProps>(_props);
  const auto &newViewProps = *std::static_pointer_cast<const MLRNImageSourceProps>(props);

  if (oldViewProps.id != newViewProps.id) {
    _view.id = RCTNSStringFromString(newViewProps.id);
  }

  if (oldViewProps.url != newViewProps.url) {
    _view.url = newViewProps.url.empty() ? nil : RCTNSStringFromString(newViewProps.url);
  }

  if (oldViewProps.coordinates != newViewProps.coordinates) {
    _view.coordinates = convertFollyDynamicToId(newViewProps.coordinates);
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                          index:(NSInteger)index {
  if ([childComponentView isKindOfClass:[RCTViewComponentView class]] &&
      ((RCTViewComponentView *)childComponentView).contentView) {
    [_view insertReactSubview:(id<RCTComponent>)((RCTViewComponentView *)childComponentView)
                                  .contentView
                      atIndex:index];
  }
  [super mountChildComponentView:childComponentView index:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                            index:(NSInteger)index {
  if ([childComponentView isKindOfClass:[RCTViewComponentView class]] &&
      ((RCTViewComponentView *)childComponentView).contentView) {
    [_view removeReactSubview:(id<RCTComponent>)((RCTViewComponentView *)childComponentView)
                                  .contentView];
  }
  [super unmountChildComponentView:childComponentView index:index];
}

Class<RCTComponentViewProtocol> MLRNImageSourceCls(void) {
  return MLRNImageSourceComponentView.class;
}

@end
