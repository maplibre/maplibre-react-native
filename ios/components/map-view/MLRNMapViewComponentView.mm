#import "MLRNMapViewComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import <React/RCTConversions.h>
#import <react/utils/FollyConvert.h>
#import "MLRNMapView.h"

using namespace facebook::react;

struct PressEvent {
  double longitude;
  double latitude;
  double locationX;
  double locationY;
};

PressEvent createPressEvent(NSDictionary *dict) {
  PressEvent result;

  result.longitude = [dict[@"properties"][@"longitude"] doubleValue];
  result.latitude = [dict[@"properties"][@"latitude"] doubleValue];
  result.locationX = [dict[@"properties"][@"locationX"] doubleValue];
  result.locationY = [dict[@"properties"][@"locationY"] doubleValue];

  return result;
}

struct ViewState {
  double longitude;
  double latitude;
  double zoom;
  double bearing;
  double pitch;
  folly::dynamic bounds;
  bool animated;
  bool userInteraction;
};

ViewState createViewState(NSDictionary *dict) {
  ViewState result;

  result.longitude = [dict[@"longitude"] doubleValue];
  result.latitude = [dict[@"latitude"] doubleValue];
  result.zoom = [dict[@"zoom"] doubleValue];
  result.bearing = [dict[@"bearing"] doubleValue];
  result.pitch = [dict[@"pitch"] doubleValue];

  NSArray *boundsArray = dict[@"bounds"];
  folly::dynamic bounds = folly::dynamic::array;
  for (NSNumber *coordinate in boundsArray) {
    bounds.push_back([coordinate doubleValue]);
  }
  result.bounds = bounds;

  result.animated = [dict[@"animated"] boolValue];
  result.userInteraction = [dict[@"userInteraction"] boolValue];

  return result;
}

static NSDictionary *convertFollyDynamicToNSDictionary(const folly::dynamic &dyn) {
  if (dyn.isNull() || !dyn.isObject()) {
    return nil;
  }
  return (NSDictionary *)convertFollyDynamicToId(dyn);
}

// MARK: - MLRNMapViewComponentView

@interface MLRNMapViewComponentView () <RCTMLRNMapViewViewProtocol>

@end

@implementation MLRNMapViewComponentView {
  MLRNMapView *_view;
  CGRect _frame;
}

+ (BOOL)shouldBeRecycled {
  return NO;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const MLRNMapViewProps>();
    _props = defaultProps;
    _frame = frame;
    [self prepareView];
  }

  return self;
}

- (void)prepareView {
  _view = [[MLRNMapView alloc] initWithFrame:_frame];

  // Capture weak self reference to prevent retain cycle
  __weak __typeof__(self) weakSelf = self;

  [_view setReactOnPress:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      PressEvent pressEvent = createPressEvent(event);

      facebook::react::MLRNMapViewEventEmitter::OnPress eventStruct{
          pressEvent.longitude, pressEvent.latitude, pressEvent.locationX, pressEvent.locationY};

      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onPress(eventStruct);
    }
  }];

  [_view setReactOnLongPress:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      PressEvent pressEvent = createPressEvent(event);

      facebook::react::MLRNMapViewEventEmitter::OnLongPress eventStruct{
          pressEvent.longitude, pressEvent.latitude, pressEvent.locationX, pressEvent.locationY};

      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onLongPress(eventStruct);
    }
  }];

  [_view setReactOnRegionWillChange:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      ViewState viewState = createViewState(event);

      facebook::react::MLRNMapViewEventEmitter::OnRegionWillChange eventStruct{
          viewState.longitude, viewState.latitude, viewState.zoom,     viewState.bearing,
          viewState.pitch,     viewState.bounds,   viewState.animated, viewState.userInteraction};

      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onRegionWillChange(eventStruct);
    }
  }];
  [_view setReactOnRegionIsChanging:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      ViewState viewState = createViewState(event);

      facebook::react::MLRNMapViewEventEmitter::OnRegionIsChanging eventStruct{
          viewState.longitude, viewState.latitude, viewState.zoom,     viewState.bearing,
          viewState.pitch,     viewState.bounds,   viewState.animated, viewState.userInteraction};

      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onRegionIsChanging(eventStruct);
    }
  }];
  [_view setReactOnRegionDidChange:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      ViewState viewState = createViewState(event);

      facebook::react::MLRNMapViewEventEmitter::OnRegionDidChange eventStruct{
          viewState.longitude, viewState.latitude, viewState.zoom,     viewState.bearing,
          viewState.pitch,     viewState.bounds,   viewState.animated, viewState.userInteraction};

      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onRegionDidChange(eventStruct);
    }
  }];

  [_view setReactOnWillStartLoadingMap:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onWillStartLoadingMap({});
    }
  }];
  [_view setReactOnDidFinishLoadingMap:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDidFinishLoadingMap({});
    }
  }];
  [_view setReactOnDidFailLoadingMap:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDidFailLoadingMap({});
    }
  }];

  [_view setReactOnWillStartRenderingFrame:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onWillStartRenderingFrame({});
    }
  }];
  [_view setReactOnDidFinishRenderingFrame:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDidFinishRenderingFrame({});
    }
  }];
  [_view setReactOnDidFinishRenderingFrameFully:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDidFinishRenderingFrameFully({});
    }
  }];

  [_view setReactOnWillStartRenderingMap:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onWillStartRenderingMap({});
    }
  }];
  [_view setReactOnDidFinishRenderingMap:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDidFinishRenderingMap({});
    }
  }];
  [_view setReactOnDidFinishRenderingMapFully:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDidFinishRenderingMapFully({});
    }
  }];

  [_view setReactOnDidFinishLoadingStyle:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDidFinishLoadingStyle({});
    }
  }];

  self.contentView = _view;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                          index:(NSInteger)index {
  if ([childComponentView isKindOfClass:[RCTViewComponentView class]] &&
      ((RCTViewComponentView *)childComponentView).contentView) {
    [_view addToMap:((RCTViewComponentView *)childComponentView).contentView];
  }
  [super mountChildComponentView:childComponentView index:index + 1];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                            index:(NSInteger)index {
  if ([childComponentView isKindOfClass:[RCTViewComponentView class]] &&
      ((RCTViewComponentView *)childComponentView).contentView) {
    [_view removeFromMap:((RCTViewComponentView *)childComponentView).contentView];
  }
  [super unmountChildComponentView:childComponentView index:index + 1];
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<MLRNMapViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<MLRNMapViewProps const>(props);

  if (oldViewProps.mapStyle != newViewProps.mapStyle) {
    NSString *mapStyle = [NSString stringWithCString:newViewProps.mapStyle.c_str()
                                            encoding:NSUTF8StringEncoding];
    [_view setReactMapStyle:mapStyle];
  }

  if (oldViewProps.light != newViewProps.light) {
    NSDictionary *reactLight = (!newViewProps.light.isNull() && newViewProps.light.isObject())
        ? convertFollyDynamicToNSDictionary(newViewProps.light)
        : nil;
    [_view setReactLight:reactLight];
  }

  if (oldViewProps.contentInset.top != newViewProps.contentInset.top ||
      oldViewProps.contentInset.right != newViewProps.contentInset.right ||
      oldViewProps.contentInset.bottom != newViewProps.contentInset.bottom ||
      oldViewProps.contentInset.left != newViewProps.contentInset.left) {
    NSDictionary *contentInset = @{
      @"top" : @(newViewProps.contentInset.top),
      @"right" : @(newViewProps.contentInset.right),
      @"bottom" : @(newViewProps.contentInset.bottom),
      @"left" : @(newViewProps.contentInset.left)
    };

    [_view setReactContentInset:contentInset];
  }

  if (oldViewProps.preferredFramesPerSecond != newViewProps.preferredFramesPerSecond) {
    [_view setReactPreferredFramesPerSecond:newViewProps.preferredFramesPerSecond];
  }

  if (oldViewProps.dragPan != newViewProps.dragPan) {
    [_view setReactScrollEnabled:newViewProps.dragPan];
  }

  if (oldViewProps.touchAndDoubleTapZoom != newViewProps.touchAndDoubleTapZoom) {
    [_view setReactZoomEnabled:newViewProps.touchAndDoubleTapZoom];
  }

  if (oldViewProps.touchRotate != newViewProps.touchRotate) {
    [_view setReactRotateEnabled:newViewProps.touchRotate];
  }

  if (oldViewProps.touchPitch != newViewProps.touchPitch) {
    [_view setPitchEnabled:newViewProps.touchPitch];
  }

  if (oldViewProps.tintColor != newViewProps.tintColor) {
    [_view setTintColor:RCTUIColorFromSharedColor(newViewProps.tintColor)];
  }

  if (oldViewProps.attribution != newViewProps.attribution) {
    [_view setReactAttributionEnabled:newViewProps.attribution];
  }

  if (oldViewProps.attributionPosition.top != newViewProps.attributionPosition.top ||
      oldViewProps.attributionPosition.right != newViewProps.attributionPosition.right ||
      oldViewProps.attributionPosition.bottom != newViewProps.attributionPosition.bottom ||
      oldViewProps.attributionPosition.left != newViewProps.attributionPosition.left) {
    NSDictionary *attributionPosition = @{
      @"top" : @(newViewProps.attributionPosition.top),
      @"right" : @(newViewProps.attributionPosition.right),
      @"bottom" : @(newViewProps.attributionPosition.bottom),
      @"left" : @(newViewProps.attributionPosition.left)
    };

    [_view setReactAttributionPosition:attributionPosition];
  }

  if (oldViewProps.logo != newViewProps.logo) {
    [_view setReactLogoEnabled:newViewProps.logo];
  }

  if (oldViewProps.logoPosition.top != newViewProps.logoPosition.top ||
      oldViewProps.logoPosition.right != newViewProps.logoPosition.right ||
      oldViewProps.logoPosition.bottom != newViewProps.logoPosition.bottom ||
      oldViewProps.logoPosition.left != newViewProps.logoPosition.left) {
    NSDictionary *logoPosition = @{
      @"top" : @(newViewProps.logoPosition.top),
      @"right" : @(newViewProps.logoPosition.right),
      @"bottom" : @(newViewProps.logoPosition.bottom),
      @"left" : @(newViewProps.logoPosition.left)
    };

    [_view setReactLogoPosition:logoPosition];
  }

  if (oldViewProps.compass != newViewProps.compass) {
    [_view setReactCompassEnabled:newViewProps.compass];
  }

  if (oldViewProps.compassPosition.top != newViewProps.compassPosition.top ||
      oldViewProps.compassPosition.right != newViewProps.compassPosition.right ||
      oldViewProps.compassPosition.bottom != newViewProps.compassPosition.bottom ||
      oldViewProps.compassPosition.left != newViewProps.compassPosition.left) {
    NSDictionary *compassPosition = @{
      @"top" : @(newViewProps.compassPosition.top),
      @"right" : @(newViewProps.compassPosition.right),
      @"bottom" : @(newViewProps.compassPosition.bottom),
      @"left" : @(newViewProps.compassPosition.left)
    };

    [_view setReactCompassPosition:compassPosition];
  }

  [super updateProps:props oldProps:oldProps];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNMapViewComponentDescriptor>();
}

@end
