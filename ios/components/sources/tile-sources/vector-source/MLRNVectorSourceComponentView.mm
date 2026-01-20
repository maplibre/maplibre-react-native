#import "MLRNVectorSourceComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import <React/RCTConversions.h>
#import <react/utils/FollyConvert.h>
#import <MapLibre/MapLibre.h>
#import "MLRNVectorSource.h"

using namespace facebook::react;

// MARK: - MLRNVectorSourceComponentView

@interface MLRNVectorSourceComponentView () <RCTMLRNVectorSourceViewProtocol>

@end

@implementation MLRNVectorSourceComponentView {
  MLRNVectorSource *_view;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const MLRNVectorSourceProps>();
    _props = defaultProps;
    [self prepareView];
  }

  return self;
}

- (void)prepareView {
  _view = [[MLRNVectorSource alloc] init];

  // Capture weak self reference to prevent retain cycle
  __weak __typeof__(self) weakSelf = self;

  [_view setOnPress:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;
    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      const auto eventEmitter =
          std::static_pointer_cast<const MLRNVectorSourceEventEmitter>(strongSelf->_eventEmitter);

      facebook::react::MLRNVectorSourceEventEmitter::OnPress data = {
          .lngLat = convertIdToFollyDynamic(event[@"lngLat"]),
          .point = convertIdToFollyDynamic(event[@"point"]),
          .features = convertIdToFollyDynamic(event[@"features"]),
      };

      eventEmitter->onPress(data);
    }
  }];

  self.contentView = _view;
}

- (MLRNVectorSource *)vectorSource {
  return _view;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNVectorSourceComponentDescriptor>();
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<const MLRNVectorSourceProps>(_props);
  const auto &newViewProps = *std::static_pointer_cast<const MLRNVectorSourceProps>(props);

  if (oldViewProps.id != newViewProps.id) {
    _view.id = RCTNSStringFromString(newViewProps.id);
  }

  if (oldViewProps.url != newViewProps.url) {
    _view.url = newViewProps.url.empty() ? nil : RCTNSStringFromString(newViewProps.url);
  }

  if (oldViewProps.tiles != newViewProps.tiles) {
    if (newViewProps.tiles.size() > 0) {
      NSMutableArray *tiles = [NSMutableArray arrayWithCapacity:newViewProps.tiles.size()];
      for (const auto &tile : newViewProps.tiles) {
        [tiles addObject:RCTNSStringFromString(tile)];
      }
      _view.tileUrlTemplates = tiles;
    } else {
      _view.tileUrlTemplates = nil;
    }
  }

  if (oldViewProps.minzoom != newViewProps.minzoom) {
    _view.minZoomLevel = newViewProps.minzoom >= 0 ? @(newViewProps.minzoom) : nil;
  }

  if (oldViewProps.maxzoom != newViewProps.maxzoom) {
    _view.maxZoomLevel = newViewProps.maxzoom >= 0 ? @(newViewProps.maxzoom) : nil;
  }

  if (oldViewProps.scheme != newViewProps.scheme) {
    if (newViewProps.scheme == MLRNVectorSourceScheme::Tms) {
      _view.scheme = @(MLNTileCoordinateSystemTMS);
    } else if (newViewProps.scheme == MLRNVectorSourceScheme::Xyz) {
      _view.scheme = @(MLNTileCoordinateSystemXYZ);
    } else {
      _view.scheme = nil;
    }
  }

  if (oldViewProps.attribution != newViewProps.attribution) {
    _view.attribution =
        newViewProps.attribution.empty() ? nil : RCTNSStringFromString(newViewProps.attribution);
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

Class<RCTComponentViewProtocol> MLRNVectorSourceCls(void) {
  return MLRNVectorSourceComponentView.class;
}

@end

