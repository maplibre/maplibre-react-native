#import "MLRNLayerComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import <MapLibre/MapLibre.h>
#import <React/RCTBridge+Private.h>
#import <React/RCTConversions.h>
#import "MLRNFollyConvert.h"
#import "MLRNLayer.h"

using namespace facebook::react;

// MARK: - MLRNLayerComponentView

@interface MLRNLayerComponentView () <RCTMLRNLayerViewProtocol>

@end

@implementation MLRNLayerComponentView {
  MLRNLayer *_view;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const MLRNLayerProps>();
    _props = defaultProps;
    [self prepareView];
  }

  return self;
}

- (void)prepareView {
  _view = [[MLRNLayer alloc] init];
  _view.bridge = [RCTBridge currentBridge];
  self.contentView = _view;
}

- (MLRNLayer *)mlrnLayer {
  return _view;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNLayerComponentDescriptor>();
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<const MLRNLayerProps>(_props);
  const auto &newViewProps = *std::static_pointer_cast<const MLRNLayerProps>(props);

  if (oldViewProps.id != newViewProps.id) {
    _view.id = RCTNSStringFromString(newViewProps.id);
  }

  if (oldViewProps.layerType != newViewProps.layerType) {
    _view.layerType = RCTNSStringFromString(newViewProps.layerType);
  }

  if (oldViewProps.source != newViewProps.source) {
    _view.sourceID = newViewProps.source.empty() ? nil : RCTNSStringFromString(newViewProps.source);
  }

  if (oldViewProps.sourceLayer != newViewProps.sourceLayer) {
    _view.sourceLayerID =
        newViewProps.sourceLayer.empty() ? nil : RCTNSStringFromString(newViewProps.sourceLayer);
  }

  if (oldViewProps.afterId != newViewProps.afterId) {
    _view.aboveLayerID =
        newViewProps.afterId.empty() ? nil : RCTNSStringFromString(newViewProps.afterId);
  }

  if (oldViewProps.beforeId != newViewProps.beforeId) {
    _view.belowLayerID =
        newViewProps.beforeId.empty() ? nil : RCTNSStringFromString(newViewProps.beforeId);
  }

  if (oldViewProps.layerIndex != newViewProps.layerIndex) {
    _view.layerIndex = @(newViewProps.layerIndex);
  }

  if (oldViewProps.minzoom != newViewProps.minzoom) {
    _view.minZoomLevel = @(newViewProps.minzoom);
  }

  if (oldViewProps.maxzoom != newViewProps.maxzoom) {
    _view.maxZoomLevel = @(newViewProps.maxzoom);
  }

  if (oldViewProps.filter != newViewProps.filter) {
    _view.filter = convertFollyDynamicToId(newViewProps.filter);
  }

  if (oldViewProps.reactStyle != newViewProps.reactStyle) {
    _view.reactStyle = convertFollyDynamicToId(newViewProps.reactStyle);
  }

  [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> MLRNLayerCls(void) { return MLRNLayerComponentView.class; }

@end
