#import "MLRNRasterSourceComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import <React/RCTConversions.h>
#import <MapLibre/MapLibre.h>
#import "MLRNRasterSource.h"

using namespace facebook::react;

// MARK: - MLRNRasterSourceComponentView

@interface MLRNRasterSourceComponentView () <RCTMLRNRasterSourceViewProtocol>

@end

@implementation MLRNRasterSourceComponentView {
  MLRNRasterSource *_view;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const MLRNRasterSourceProps>();
    _props = defaultProps;
    [self prepareView];
  }

  return self;
}

- (void)prepareView {
  _view = [[MLRNRasterSource alloc] init];
  self.contentView = _view;
}

- (MLRNRasterSource *)rasterSource {
  return _view;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNRasterSourceComponentDescriptor>();
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<const MLRNRasterSourceProps>(_props);
  const auto &newViewProps = *std::static_pointer_cast<const MLRNRasterSourceProps>(props);

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
    if (newViewProps.scheme == MLRNRasterSourceScheme::Tms) {
      _view.scheme = @(MLNTileCoordinateSystemTMS);
    } else if (newViewProps.scheme == MLRNRasterSourceScheme::Xyz) {
      _view.scheme = @(MLNTileCoordinateSystemXYZ);
    } else {
      _view.scheme = nil;
    }
  }

  if (oldViewProps.attribution != newViewProps.attribution) {
    _view.attribution =
        newViewProps.attribution.empty() ? nil : RCTNSStringFromString(newViewProps.attribution);
  }

  if (oldViewProps.tileSize != newViewProps.tileSize) {
    _view.tileSize = newViewProps.tileSize >= 0 ? @(newViewProps.tileSize) : nil;
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

Class<RCTComponentViewProtocol> MLRNRasterSourceCls(void) {
  return MLRNRasterSourceComponentView.class;
}

@end

