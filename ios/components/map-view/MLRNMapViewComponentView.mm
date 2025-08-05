#import "MLRNMapViewComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import "MLRNMapView.h"

using namespace facebook::react;

struct RegionGeometry {
  std::string type;
  std::vector<double> coordinates;
};

struct RegionProperties {
  double zoomLevel;
  double heading;
  double pitch;
  std::vector<std::vector<double>> visibleBounds;
  bool animated;
  bool isUserInteraction;
};

struct RegionParsedData {
  std::string type;
  RegionGeometry geometry;
  RegionProperties properties;
};

RegionParsedData parseRegionData(NSDictionary *dict) {
  RegionParsedData result;

  result.type = [dict[@"type"] UTF8String];

  NSDictionary *geometryDict = dict[@"geometry"];
  result.geometry.type = [geometryDict[@"type"] UTF8String];

  NSArray *coords = geometryDict[@"coordinates"];
  for (NSNumber *num in coords) {
    result.geometry.coordinates.push_back([num doubleValue]);
  }

  NSDictionary *props = dict[@"properties"];
  result.properties.zoomLevel = [props[@"zoomLevel"] doubleValue];
  result.properties.heading = [props[@"heading"] doubleValue];
  result.properties.pitch = [props[@"pitch"] doubleValue];

  NSArray *bounds = props[@"visibleBounds"];
  for (NSArray *coordPair in bounds) {
    std::vector<double> pair;
    for (NSNumber *num in coordPair) {
      pair.push_back([num doubleValue]);
    }
    result.properties.visibleBounds.push_back(pair);
  }

  result.properties.animated = [props[@"animated"] boolValue];
  result.properties.isUserInteraction = [props[@"isUserInteraction"] boolValue];

  return result;
}

// MARK: - MLRNMapViewEventDispatcher

//@interface MLRNMapViewEventDispatcher : NSObject <RCTEventDispatcherProtocol>
//@end
//
//@implementation MLRNMapViewEventDispatcher {
//  MLRNMapViewComponentView *_componentView;
//}
//
//// Support dynamic frameworks https://github.com/facebook/react-native/pull/37274
//+ (void)load {
//  [super load];
//}
//
//- (instancetype)initWithComponentView:(MLRNMapViewComponentView *)componentView {
//  if (self = [super init]) {
//    _componentView = componentView;
//  }
//
//  return self;
//}
//
//- (void)sendEvent:(id<RCTEvent>)event {
//  NSDictionary *payload = [event arguments][2];
//  [_componentView dispatchCameraChangedEvent:payload];
//}
//
//@end

// MARK: - MLRNMapViewComponentView

@interface MLRNMapViewComponentView () <RCTMLRNMapViewViewProtocol>

@end

@implementation MLRNMapViewComponentView {
  MLRNMapView *_view;
  // MLRNMapViewEventDispatcher *_eventDispatcher;
  CGRect _frame;
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
  // _eventDispatcher = [[MLRNMapViewEventDispatcher alloc] initWithComponentView:self];
  _view = [[MLRNMapView alloc] initWithFrame:_frame
      // eventDispatcher:_eventDispatcher
  ];

  // Any value is necessary to create events, no impact on sending events
  _view.reactTag = @-1;

  // Capture weak self reference to prevent retain cycle
  __weak __typeof__(self) weakSelf = self;

  //  [_view setReactOnPress:^(NSDictionary *event) {
  //    __typeof__(self) strongSelf = weakSelf;
  //
  //    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
  //      const auto [type, json] = MLRNStringifyEventData(event);
  //      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
  //          strongSelf->_eventEmitter)
  //          ->onPress({type, json});
  //    }
  //  }];
  //
  //  [_view setReactOnLongPress:^(NSDictionary *event) {
  //    __typeof__(self) strongSelf = weakSelf;
  //
  //    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
  //      const auto [type, json] = MLRNStringifyEventData(event);
  //      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
  //          strongSelf->_eventEmitter)
  //          ->onLongPress({type, json});
  //    }
  //  }];

  [_view setReactOnRegionWillChange:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      RegionParsedData parsed = parseRegionData(event);

      facebook::react::MLRNMapViewEventEmitter::OnRegionWillChange eventStruct{
          parsed.type,
          {parsed.geometry.type, parsed.geometry.coordinates},
          {parsed.properties.zoomLevel, parsed.properties.heading, parsed.properties.pitch,
           parsed.properties.visibleBounds, parsed.properties.animated,
           parsed.properties.isUserInteraction}};

      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onRegionWillChange(eventStruct);
    }
  }];
  [_view setReactOnRegionIsChanging:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      RegionParsedData parsed = parseRegionData(event);

      facebook::react::MLRNMapViewEventEmitter::OnRegionIsChanging eventStruct{
          parsed.type,
          {parsed.geometry.type, parsed.geometry.coordinates},
          {parsed.properties.zoomLevel, parsed.properties.heading, parsed.properties.pitch,
           parsed.properties.visibleBounds, parsed.properties.animated,
           parsed.properties.isUserInteraction}};

      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onRegionIsChanging(eventStruct);
    }
  }];
  [_view setReactOnRegionDidChange:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      RegionParsedData parsed = parseRegionData(event);

      facebook::react::MLRNMapViewEventEmitter::OnRegionDidChange eventStruct{
          parsed.type,
          {parsed.geometry.type, parsed.geometry.coordinates},
          {parsed.properties.zoomLevel, parsed.properties.heading, parsed.properties.pitch,
           parsed.properties.visibleBounds, parsed.properties.animated,
           parsed.properties.isUserInteraction}};

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
  [super mountChildComponentView:childComponentView index:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                            index:(NSInteger)index {
  if ([childComponentView isKindOfClass:[RCTViewComponentView class]] &&
      ((RCTViewComponentView *)childComponentView).contentView) {
    [_view removeFromMap:((RCTViewComponentView *)childComponentView).contentView];
  }
  [super unmountChildComponentView:childComponentView index:index];
}

//- (void)dispatchCameraChangedEvent:(NSDictionary *)event {
//  const auto [type, json] = MLRNStringifyEventData(event);
//  std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(self->_eventEmitter)
//      ->onCameraChanged({type, json});
//}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<MLRNMapViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<MLRNMapViewProps const>(props);

  if (oldViewProps.mapStyle != newViewProps.mapStyle) {
    NSString *mapStyle = [NSString stringWithCString:newViewProps.mapStyle.c_str()
                                            encoding:NSUTF8StringEncoding];
    [_view setReactMapStyle:mapStyle];
  }

  [super updateProps:props oldProps:oldProps];
}

//- (const MLRNMapViewEventEmitter &)eventEmitter {
//  return static_cast<const MLRNMapViewEventEmitter &>(*_eventEmitter);
//}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNMapViewComponentDescriptor>();
}

@end
