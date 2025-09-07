#import "MLRNCameraComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import <React/RCTConversions.h>
#import "MLRNCamera.h"

using namespace facebook::react;

// MARK: - MLRNCameraComponentView

@interface MLRNCameraComponentView () <RCTMLRNCameraViewProtocol>

@end

@implementation MLRNCameraComponentView {
  MLRNCamera *_view;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const MLRNCameraProps>();
    _props = defaultProps;
    [self prepareView];
  }

  return self;
}

- (void)prepareView {
  _view = [[MLRNCamera alloc] init];

  // TODO: Is this necessary?
  // Any value is necessary to create events, no impact on sending events
  _view.reactTag = @-1;

  // Capture weak self reference to prevent retain cycle
  __weak __typeof__(self) weakSelf = self;

  [_view setOnTrackUserLocationChange:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      facebook::react::MLRNCameraEventEmitter::OnTrackUserLocationChange eventStruct{
          [event[@"trackUserLocation"] UTF8String],
      };
      std::dynamic_pointer_cast<const facebook::react::MLRNCameraEventEmitter>(
          strongSelf->_eventEmitter)
          ->onTrackUserLocationChange(eventStruct);
    }
  }];

  self.contentView = _view;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<MLRNCameraProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<MLRNCameraProps const>(props);

  if (oldViewProps.minZoom != newViewProps.minZoom) {
    [_view setMinZoom:@(newViewProps.minZoom)];
  }

  if (oldViewProps.maxZoom != newViewProps.maxZoom) {
    [_view setMaxZoom:@(newViewProps.maxZoom)];
  }

  if (oldViewProps.maxBounds != newViewProps.maxBounds) {
    if (newViewProps.maxBounds.size() == 4) {
      NSMutableArray<NSNumber *> *maxBoundsArray =
          [NSMutableArray arrayWithCapacity:newViewProps.maxBounds.size()];
      for (double value : newViewProps.maxBounds) {
        [maxBoundsArray addObject:@(value)];
      }

      [_view setMaxBounds:maxBoundsArray];
    } else {
      [_view setMaxBounds:nil];
    }
  }

  if (oldViewProps.stop.longitude != newViewProps.stop.longitude ||
      oldViewProps.stop.latitude != newViewProps.stop.latitude ||

      oldViewProps.stop.bounds != newViewProps.stop.bounds ||
      oldViewProps.stop.padding.top != newViewProps.stop.padding.top ||
      oldViewProps.stop.padding.right != newViewProps.stop.padding.right ||
      oldViewProps.stop.padding.bottom != newViewProps.stop.padding.bottom ||
      oldViewProps.stop.padding.left != newViewProps.stop.padding.left ||

      oldViewProps.stop.zoom != newViewProps.stop.zoom ||
      oldViewProps.stop.bearing != newViewProps.stop.bearing ||
      oldViewProps.stop.pitch != newViewProps.stop.pitch ||

      oldViewProps.stop.duration != newViewProps.stop.duration ||
      oldViewProps.stop.easing != newViewProps.stop.easing) {
    NSMutableDictionary *stop = [NSMutableDictionary dictionary];

    if (newViewProps.longitude != -360) {
      stop[@"longitude"] = @(newViewProps.stop.longitude);
    }
    if (newViewProps.latitude != -360) {
      stop[@"latitude"] = @(newViewProps.stop.latitude);
    }

    if (newViewProps.stop.bounds.size() == 4) {
      NSArray<NSNumber *> *bounds = @[
        @(newViewProps.stop.bounds[0]), @(newViewProps.stop.bounds[1]),
        @(newViewProps.stop.bounds[2]), @(newViewProps.stop.bounds[3])
      ];
      stop[@"bounds"] = bounds;
    }

    stop[@"padding"] = @{
      @"top" : @(newViewProps.stop.padding.top),
      @"right" : @(newViewProps.stop.padding.right),
      @"bottom" : @(newViewProps.stop.padding.bottom),
      @"left" : @(newViewProps.stop.padding.left)
    };

    if (newViewProps.stop.zoom != -1) {
      stop[@"zoom"] = @(newViewProps.stop.zoom);
    }
    if (newViewProps.stop.bearing != -1) {
      stop[@"bearing"] = @(newViewProps.stop.bearing);
    }
    if (newViewProps.stop.pitch != -1) {
      stop[@"pitch"] = @(newViewProps.stop.pitch);
    }

    if (newViewProps.stop.duration != -1) {
      stop[@"duration"] = @(newViewProps.stop.duration);
    }
    stop[@"easing"] =
        [NSString stringWithUTF8String:facebook::react::toString(newViewProps.stop.easing).c_str()];

    [_view setStop:stop];
  }

  if (newViewProps.trackUserLocation != MLRNCameraTrackUserLocation::None) {
  }

  [super updateProps:props oldProps:oldProps];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNCameraComponentDescriptor>();
}

@end
