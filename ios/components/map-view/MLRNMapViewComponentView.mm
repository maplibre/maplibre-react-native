#import "MLRNMapViewComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import "MLRNMapView.h"

using namespace facebook::react;

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

  [_view setOnMapChange:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      std::string type = [event valueForKey:@"type"] == nil
                             ? ""
                             : std::string([[event valueForKey:@"type"] UTF8String]);
      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
          strongSelf->_eventEmitter)
          ->onMapChange({type : type});
    }
  }];

  //  [_view setReactOnMapChange:^(NSDictionary *event) {
  //    __typeof__(self) strongSelf = weakSelf;
  //
  //    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
  //      std::string type = [event valueForKey:@"type"] == nil
  //                             ? ""
  //                             : std::string([[event valueForKey:@"type"] UTF8String]);
  //      std::dynamic_pointer_cast<const facebook::react::MLRNMapViewEventEmitter>(
  //          strongSelf->_eventEmitter)
  //          ->onMapChange({type : type});
  //    }
  //  }];

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

- (const MLRNMapViewEventEmitter &)eventEmitter {
  return static_cast<const MLRNMapViewEventEmitter &>(*_eventEmitter);
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNMapViewComponentDescriptor>();
}

@end
