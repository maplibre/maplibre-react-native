#ifdef RCT_NEW_ARCH_ENABLED

#import "MLRNPointAnnotationComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import <React/RCTConversions.h>
#import "MLRNPointAnnotation.h"

using namespace facebook::react;

// MARK: - MLRNPointAnnotationComponentView

@interface MLRNPointAnnotationComponentView () <RCTMLRNPointAnnotationViewProtocol>

@end

@implementation MLRNPointAnnotationComponentView {
  MLRNPointAnnotation *_view;
}

+ (BOOL)shouldBeRecycled {
  return NO;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const MLRNPointAnnotationProps>();
    _props = defaultProps;
    [self prepareView];
  }

  return self;
}

- (void)prepareView {
  _view = [[MLRNPointAnnotation alloc] init];

  // Capture weak self reference to prevent retain cycle
  __weak __typeof__(self) weakSelf = self;

  [_view setReactOnSelected:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      facebook::react::MLRNPointAnnotationEventEmitter::OnSelected eventStruct{
          folly::dynamic::array([event[@"lngLat"][0] doubleValue],
                                [event[@"lngLat"][1] doubleValue]),
          folly::dynamic::array([event[@"point"][0] doubleValue],
                                [event[@"point"][1] doubleValue]),
          std::string([event[@"id"] UTF8String] ?: "")};

      std::dynamic_pointer_cast<const facebook::react::MLRNPointAnnotationEventEmitter>(
          strongSelf->_eventEmitter)
          ->onSelected(eventStruct);
    }
  }];

  [_view setReactOnDeselected:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      facebook::react::MLRNPointAnnotationEventEmitter::OnDeselected eventStruct{
          folly::dynamic::array([event[@"lngLat"][0] doubleValue],
                                [event[@"lngLat"][1] doubleValue]),
          folly::dynamic::array([event[@"point"][0] doubleValue],
                                [event[@"point"][1] doubleValue]),
          std::string([event[@"id"] UTF8String] ?: "")};

      std::dynamic_pointer_cast<const facebook::react::MLRNPointAnnotationEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDeselected(eventStruct);
    }
  }];

  [_view setReactOnDragStart:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      facebook::react::MLRNPointAnnotationEventEmitter::OnDragStart eventStruct{
          folly::dynamic::array([event[@"lngLat"][0] doubleValue],
                                [event[@"lngLat"][1] doubleValue]),
          folly::dynamic::array([event[@"point"][0] doubleValue],
                                [event[@"point"][1] doubleValue]),
          std::string([event[@"id"] UTF8String] ?: "")};

      std::dynamic_pointer_cast<const facebook::react::MLRNPointAnnotationEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDragStart(eventStruct);
    }
  }];

  [_view setReactOnDrag:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      facebook::react::MLRNPointAnnotationEventEmitter::OnDrag eventStruct{
          folly::dynamic::array([event[@"lngLat"][0] doubleValue],
                                [event[@"lngLat"][1] doubleValue]),
          folly::dynamic::array([event[@"point"][0] doubleValue],
                                [event[@"point"][1] doubleValue]),
          std::string([event[@"id"] UTF8String] ?: "")};

      std::dynamic_pointer_cast<const facebook::react::MLRNPointAnnotationEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDrag(eventStruct);
    }
  }];

  [_view setReactOnDragEnd:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      facebook::react::MLRNPointAnnotationEventEmitter::OnDragEnd eventStruct{
          folly::dynamic::array([event[@"lngLat"][0] doubleValue],
                                [event[@"lngLat"][1] doubleValue]),
          folly::dynamic::array([event[@"point"][0] doubleValue],
                                [event[@"point"][1] doubleValue]),
          std::string([event[@"id"] UTF8String] ?: "")};

      std::dynamic_pointer_cast<const facebook::react::MLRNPointAnnotationEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDragEnd(eventStruct);
    }
  }];

  self.contentView = _view;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                          index:(NSInteger)index {
  if ([childComponentView isKindOfClass:[RCTViewComponentView class]] &&
      ((RCTViewComponentView *)childComponentView).contentView) {
    [_view insertReactSubview:((RCTViewComponentView *)childComponentView).contentView atIndex:index];
  }
  [super mountChildComponentView:childComponentView index:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                            index:(NSInteger)index {
  if ([childComponentView isKindOfClass:[RCTViewComponentView class]] &&
      ((RCTViewComponentView *)childComponentView).contentView) {
    [_view removeReactSubview:((RCTViewComponentView *)childComponentView).contentView];
  }
  [super unmountChildComponentView:childComponentView index:index];
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<MLRNPointAnnotationProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<MLRNPointAnnotationProps const>(props);

  if (oldViewProps.id != newViewProps.id) {
    NSString *idValue = [NSString stringWithCString:newViewProps.id.c_str()
                                           encoding:NSUTF8StringEncoding];
    [_view setId:idValue];
  }

  if (oldViewProps.title != newViewProps.title) {
    NSString *titleValue = newViewProps.title.empty()
                               ? nil
                               : [NSString stringWithCString:newViewProps.title.c_str()
                                                    encoding:NSUTF8StringEncoding];
    [_view setReactTitle:titleValue];
  }

  if (oldViewProps.snippet != newViewProps.snippet) {
    NSString *snippetValue = newViewProps.snippet.empty()
                                 ? nil
                                 : [NSString stringWithCString:newViewProps.snippet.c_str()
                                                      encoding:NSUTF8StringEncoding];
    [_view setReactSnippet:snippetValue];
  }

  if (oldViewProps.selected != newViewProps.selected) {
    [_view setReactSelected:newViewProps.selected];
  }

  if (oldViewProps.draggable != newViewProps.draggable) {
    [_view setReactDraggable:newViewProps.draggable];
  }

  if (!oldViewProps.lngLat.isNull() || !newViewProps.lngLat.isNull()) {
    if (newViewProps.lngLat.isArray() && newViewProps.lngLat.size() >= 2) {
      NSArray<NSNumber *> *lngLat = @[
        @(newViewProps.lngLat[0].asDouble()),
        @(newViewProps.lngLat[1].asDouble())
      ];
      [_view setReactLngLat:lngLat];
    }
  }

  if (oldViewProps.anchor.x != newViewProps.anchor.x ||
      oldViewProps.anchor.y != newViewProps.anchor.y) {
    NSDictionary *anchor = @{
      @"x" : @(newViewProps.anchor.x),
      @"y" : @(newViewProps.anchor.y)
    };
    [_view setAnchor:anchor];
  }

  [super updateProps:props oldProps:oldProps];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNPointAnnotationComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> MLRNPointAnnotationCls(void) {
  return MLRNPointAnnotationComponentView.class;
}

#endif
