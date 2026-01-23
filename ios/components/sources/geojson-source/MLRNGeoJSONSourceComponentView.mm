#import "MLRNGeoJSONSourceComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import <React/RCTConversions.h>
#import <react/utils/FollyConvert.h>
#import "MLRNGeoJSONSource.h"

using namespace facebook::react;

// MARK: - MLRNGeoJSONSourceComponentView

@interface MLRNGeoJSONSourceComponentView () <RCTMLRNGeoJSONSourceViewProtocol>

@end

@implementation MLRNGeoJSONSourceComponentView {
  MLRNGeoJSONSource *_view;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const MLRNGeoJSONSourceProps>();
    _props = defaultProps;
    [self prepareView];
  }

  return self;
}

- (void)prepareView {
  _view = [[MLRNGeoJSONSource alloc] init];

  // Capture weak self reference to prevent retain cycle
  __weak __typeof__(self) weakSelf = self;

  [_view setOnPress:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;
    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      const auto eventEmitter =
          std::static_pointer_cast<const MLRNGeoJSONSourceEventEmitter>(strongSelf->_eventEmitter);

      facebook::react::MLRNGeoJSONSourceEventEmitter::OnPress data = {
          .lngLat = convertIdToFollyDynamic(event[@"lngLat"]),
          .point = convertIdToFollyDynamic(event[@"point"]),
          .features = convertIdToFollyDynamic(event[@"features"]),
      };

      eventEmitter->onPress(data);
    }
  }];

  self.contentView = _view;
}

- (MLRNGeoJSONSource *)shapeSource {
  return _view;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNGeoJSONSourceComponentDescriptor>();
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<const MLRNGeoJSONSourceProps>(_props);
  const auto &newViewProps = *std::static_pointer_cast<const MLRNGeoJSONSourceProps>(props);

  if (oldViewProps.id != newViewProps.id) {
    _view.id = RCTNSStringFromString(newViewProps.id);
  }

  if (oldViewProps.data != newViewProps.data) {
    _view.shape = RCTNSStringFromString(newViewProps.data);
  }

  if (oldViewProps.cluster != newViewProps.cluster) {
    _view.cluster = @(newViewProps.cluster);
  }

  if (oldViewProps.clusterRadius != newViewProps.clusterRadius) {
    _view.clusterRadius = newViewProps.clusterRadius >= 0 ? @(newViewProps.clusterRadius) : nil;
  }

  if (oldViewProps.clusterMinPoints != newViewProps.clusterMinPoints) {
    _view.clusterMinPoints =
        newViewProps.clusterMinPoints >= 0 ? @(newViewProps.clusterMinPoints) : nil;
  }

  if (oldViewProps.clusterMaxZoom != newViewProps.clusterMaxZoom) {
    _view.clusterMaxZoomLevel =
        newViewProps.clusterMaxZoom >= 0 ? @(newViewProps.clusterMaxZoom) : nil;
  }

  if (oldViewProps.clusterProperties != newViewProps.clusterProperties) {
    _view.clusterProperties = convertFollyDynamicToId(newViewProps.clusterProperties);
  }

  if (oldViewProps.maxzoom != newViewProps.maxzoom) {
    _view.maxZoomLevel = newViewProps.maxzoom >= 0 ? @(newViewProps.maxzoom) : nil;
  }

  if (oldViewProps.buffer != newViewProps.buffer) {
    _view.buffer = newViewProps.buffer >= 0 ? @(newViewProps.buffer) : nil;
  }

  if (oldViewProps.tolerance != newViewProps.tolerance) {
    _view.tolerance = newViewProps.tolerance >= 0 ? @(newViewProps.tolerance) : nil;
  }

  if (oldViewProps.lineMetrics != newViewProps.lineMetrics) {
    _view.lineMetrics = @(newViewProps.lineMetrics);
  }

  if (oldViewProps.hasOnPress != newViewProps.hasOnPress) {
    _view.hasPressListener = newViewProps.hasOnPress;
  }

  if (oldViewProps.hitbox.top != newViewProps.hitbox.top ||
      oldViewProps.hitbox.right != newViewProps.hitbox.right ||
      oldViewProps.hitbox.bottom != newViewProps.hitbox.bottom ||
      oldViewProps.hitbox.left != newViewProps.hitbox.left) {
    _view.hitbox = @{
      @"top" : @(newViewProps.hitbox.top),
      @"right" : @(newViewProps.hitbox.right),
      @"bottom" : @(newViewProps.hitbox.bottom),
      @"left" : @(newViewProps.hitbox.left),
    };
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                          index:(NSInteger)index {
  if ([childComponentView isKindOfClass:[RCTViewComponentView class]] &&
      ((RCTViewComponentView *)childComponentView).contentView) {
    [_view insertReactSubview:(id<RCTComponent>)((RCTViewComponentView *)childComponentView).contentView
                      atIndex:index];
  }
  [super mountChildComponentView:childComponentView index:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                            index:(NSInteger)index {
  if ([childComponentView isKindOfClass:[RCTViewComponentView class]] &&
      ((RCTViewComponentView *)childComponentView).contentView) {
    [_view removeReactSubview:(id<RCTComponent>)((RCTViewComponentView *)childComponentView).contentView];
  }
  [super unmountChildComponentView:childComponentView index:index];
}

Class<RCTComponentViewProtocol> MLRNGeoJSONSourceCls(void) {
  return MLRNGeoJSONSourceComponentView.class;
}

@end
