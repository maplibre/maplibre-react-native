#import "MLRNPointAnnotationComponentView.h"

#import <react/renderer/components/MapLibreReactNativeSpec/ComponentDescriptors.h>
#import <react/renderer/components/MapLibreReactNativeSpec/EventEmitters.h>
#import <react/renderer/components/MapLibreReactNativeSpec/Props.h>
#import <react/renderer/components/MapLibreReactNativeSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#import <React/RCTConversions.h>
#import <React/UIView+React.h>
#import "MLRNPointAnnotation.h"
#import "MLRNCallout.h"

using namespace facebook::react;

// MARK: - MLRNPointAnnotationComponentView

@interface MLRNPointAnnotationComponentView () <RCTMLRNPointAnnotationViewProtocol>

@end

@implementation MLRNPointAnnotationComponentView {
  MLRNPointAnnotation *_view;
}

+ (BOOL)shouldBeRecycled {
  // Prevent Fabric from recycling this view - MapLibre reparents annotation views
  // which conflicts with Fabric's view hierarchy management
  return NO;
}

- (UIView *)contentView {
  // Return _view so MapView's mountChildComponentView can find it via contentView
  // We don't set self.contentView = _view directly to avoid Fabric's view management
  return _view;
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
      NSString *idValue = event[@"id"];
      facebook::react::MLRNPointAnnotationEventEmitter::OnSelected eventStruct{
          std::string([idValue UTF8String] ?: ""),
          folly::dynamic::array([event[@"lngLat"][0] doubleValue],
                                [event[@"lngLat"][1] doubleValue]),
          folly::dynamic::array([event[@"point"][0] doubleValue],
                                [event[@"point"][1] doubleValue])};

      std::dynamic_pointer_cast<const facebook::react::MLRNPointAnnotationEventEmitter>(
          strongSelf->_eventEmitter)
          ->onSelected(eventStruct);
    }
  }];

  [_view setReactOnDeselected:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      NSString *idValue = event[@"id"];
      facebook::react::MLRNPointAnnotationEventEmitter::OnDeselected eventStruct{
          std::string([idValue UTF8String] ?: ""),
          folly::dynamic::array([event[@"lngLat"][0] doubleValue],
                                [event[@"lngLat"][1] doubleValue]),
          folly::dynamic::array([event[@"point"][0] doubleValue],
                                [event[@"point"][1] doubleValue])};

      std::dynamic_pointer_cast<const facebook::react::MLRNPointAnnotationEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDeselected(eventStruct);
    }
  }];

  [_view setReactOnDragStart:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      NSString *idValue = event[@"id"];
      facebook::react::MLRNPointAnnotationEventEmitter::OnDragStart eventStruct{
          std::string([idValue UTF8String] ?: ""),
          folly::dynamic::array([event[@"lngLat"][0] doubleValue],
                                [event[@"lngLat"][1] doubleValue]),
          folly::dynamic::array([event[@"point"][0] doubleValue],
                                [event[@"point"][1] doubleValue])};

      std::dynamic_pointer_cast<const facebook::react::MLRNPointAnnotationEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDragStart(eventStruct);
    }
  }];

  [_view setReactOnDrag:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      NSString *idValue = event[@"id"];
      facebook::react::MLRNPointAnnotationEventEmitter::OnDrag eventStruct{
          std::string([idValue UTF8String] ?: ""),
          folly::dynamic::array([event[@"lngLat"][0] doubleValue],
                                [event[@"lngLat"][1] doubleValue]),
          folly::dynamic::array([event[@"point"][0] doubleValue],
                                [event[@"point"][1] doubleValue])};

      std::dynamic_pointer_cast<const facebook::react::MLRNPointAnnotationEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDrag(eventStruct);
    }
  }];

  [_view setReactOnDragEnd:^(NSDictionary *event) {
    __typeof__(self) strongSelf = weakSelf;

    if (strongSelf != nullptr && strongSelf->_eventEmitter != nullptr) {
      NSString *idValue = event[@"id"];
      facebook::react::MLRNPointAnnotationEventEmitter::OnDragEnd eventStruct{
          std::string([idValue UTF8String] ?: ""),
          folly::dynamic::array([event[@"lngLat"][0] doubleValue],
                                [event[@"lngLat"][1] doubleValue]),
          folly::dynamic::array([event[@"point"][0] doubleValue],
                                [event[@"point"][1] doubleValue])};

      std::dynamic_pointer_cast<const facebook::react::MLRNPointAnnotationEventEmitter>(
          strongSelf->_eventEmitter)
          ->onDragEnd(eventStruct);
    }
  }];

  // Add _view as a subview (not contentView) so the MapView can discover it
  // via its addToMap: method which iterates through subviews looking for
  // MLRNPointAnnotation instances to set their map property.
  // Note: MapLibre will reparent _view when displaying the annotation,
  // but that's fine - the initial subview relationship lets MapView find it.
  [self addSubview:_view];
}

- (void)updateLayoutMetrics:(const facebook::react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const facebook::react::LayoutMetrics &)oldLayoutMetrics {
  [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];

  // Forward layout to _view - this triggers reactSetFrame: which adds the annotation to the map
  CGRect frame = CGRectMake(
    layoutMetrics.frame.origin.x,
    layoutMetrics.frame.origin.y,
    layoutMetrics.frame.size.width,
    layoutMetrics.frame.size.height
  );
  [_view reactSetFrame:frame];
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                          index:(NSInteger)index {
  // Track custom children for Fabric - needed for getAnnotationView to know
  // if this is a custom annotation or should use the default pin
  BOOL needsAnnotationRefresh = NO;

  BOOL isCallout = NO;

  if ([childComponentView isKindOfClass:[RCTViewComponentView class]]) {
    UIView *contentView = ((RCTViewComponentView *)childComponentView).contentView;
    if ([contentView isKindOfClass:[MLRNCallout class]]) {
      // Set up calloutView reference for Callout children
      // NOTE: We do NOT add Callout as a subview - MapLibre will present it
      // when the annotation is selected via calloutViewForAnnotation delegate
      _view.calloutView = (MLRNCallout *)contentView;
      _view.calloutView.representedObject = _view;
      isCallout = YES;
    } else {
      // Track non-Callout custom children (custom annotation views)
      // If this is the first custom child and annotation is already on map,
      // we need to refresh so MapLibre picks up the custom view
      if (_view.customChildCount == 0 && _view.map != nil) {
        needsAnnotationRefresh = YES;
      }
      _view.customChildCount++;
    }
  }

  // Add non-Callout children directly to _view (the annotation view).
  // We do NOT call super because we want children in _view, not in self.
  // This allows children to move with _view when MapLibre reparents it.
  // Callouts are NOT added as subviews - they're presented by MapLibre on selection.
  // Note: We use the current subview count as the index because Callouts are skipped,
  // so React's index won't match our actual subview indices.
  if (!isCallout) {
    [_view addSubview:childComponentView];
  }

  // If annotation was added before children were mounted, MapLibre would have
  // returned nil from getAnnotationView (no custom children). Now that we have
  // children, remove and re-add to trigger viewForAnnotation: again.
  if (needsAnnotationRefresh && [_view.map.annotations containsObject:_view]) {
    [_view.map removeAnnotation:_view];
    [_view.map addAnnotation:_view];
  }
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                            index:(NSInteger)index {
  // Update tracking for custom children
  BOOL isCallout = NO;

  if ([childComponentView isKindOfClass:[RCTViewComponentView class]]) {
    UIView *contentView = ((RCTViewComponentView *)childComponentView).contentView;
    if ([contentView isKindOfClass:[MLRNCallout class]]) {
      // Clear calloutView reference - Callout was never added as subview
      _view.calloutView = nil;
      isCallout = YES;
    } else if (_view.customChildCount > 0) {
      // Decrement custom child count
      _view.customChildCount--;
    }
  }

  // Remove from _view (not from self, since we added to _view)
  // Don't remove Callout since it was never added as subview
  if (!isCallout) {
    [childComponentView removeFromSuperview];
  }
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

  if (oldViewProps.offset.x != newViewProps.offset.x ||
      oldViewProps.offset.y != newViewProps.offset.y) {
    NSDictionary *offset = @{
      @"x" : @(newViewProps.offset.x),
      @"y" : @(newViewProps.offset.y)
    };
    [_view setOffset:offset];
  }

  // Handle zIndex from style prop - it's in the base ViewProps
  if (oldViewProps.zIndex != newViewProps.zIndex) {
    if (newViewProps.zIndex.has_value()) {
      [_view setZIndex:(CGFloat)newViewProps.zIndex.value()];
    }
  }

  [super updateProps:props oldProps:oldProps];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<MLRNPointAnnotationComponentDescriptor>();
}

#pragma mark - Native Commands

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args {
  RCTMLRNPointAnnotationHandleCommand(self, commandName, args);
}

- (void)refresh {
  // refresh is only used on Android to rerender the bitmap
  // On iOS, this is a no-op
}

@end

Class<RCTComponentViewProtocol> MLRNPointAnnotationCls(void) {
  return MLRNPointAnnotationComponentView.class;
}
