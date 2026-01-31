#import "MLRNImagesComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import <React/RCTBridge+Private.h>
#import <React/RCTConversions.h>
#import "MLRNImages.h"
#import "MLRNFollyConvert.h"

#if __has_include(<react/utils/FollyConvert.h>)
#import <react/utils/FollyConvert.h>
#elif __has_include("FollyConvert.h")
#import "FollyConvert.h"
#endif

using namespace facebook::react;

// MARK: - MLRNImagesComponentView

@interface MLRNImagesComponentView () <RCTMLRNImagesViewProtocol>

@end

@implementation MLRNImagesComponentView {
  MLRNImages *_view;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const MLRNImagesProps>();
    _props = defaultProps;
    [self prepareView];
  }

  return self;
}

- (void)prepareView {
  _view = [[MLRNImages alloc] init];

  _view.bridge = [RCTBridge currentBridge];

  // Capture weak self reference to prevent retain cycle
  __weak __typeof__(self) weakSelf = self;

  [_view setOnImageMissing:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;
    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      const auto eventEmitter =
          std::static_pointer_cast<const MLRNImagesEventEmitter>(strongSelf->_eventEmitter);

      NSString *imageId = event[@"image"];
      facebook::react::MLRNImagesEventEmitter::OnImageMissing data = {
          .image = std::string([imageId UTF8String]),
      };

      eventEmitter->onImageMissing(data);
    }
  }];

  self.contentView = _view;
}

- (MLRNImages *)images {
  return _view;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNImagesComponentDescriptor>();
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<const MLRNImagesProps>(_props);
  const auto &newViewProps = *std::static_pointer_cast<const MLRNImagesProps>(props);

  if (oldViewProps.images != newViewProps.images) {
    _view.images = convertFollyDynamicToId(newViewProps.images);
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

Class<RCTComponentViewProtocol> MLRNImagesCls(void) { return MLRNImagesComponentView.class; }

@end
