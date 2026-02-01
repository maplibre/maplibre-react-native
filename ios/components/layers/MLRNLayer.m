#import "MLRNLayer.h"
#import "MLRNMapView.h"
#import "MLRNSource.h"
#import "MLRNStyle.h"
#import "MLRNStyleValue.h"
#import "MLRNUtils.h"
#import "FilterParser.h"

#import <React/RCTLog.h>

@implementation MLRNLayer

// MARK: - Property setters with live update support

- (void)setMinZoomLevel:(NSNumber *)minZoomLevel {
  _minZoomLevel = minZoomLevel;

  if (_styleLayer != nil) {
    _styleLayer.minimumZoomLevel = [_minZoomLevel doubleValue];
  }
}

- (void)setMaxZoomLevel:(NSNumber *)maxZoomLevel {
  _maxZoomLevel = maxZoomLevel;

  if (_styleLayer != nil) {
    _styleLayer.maximumZoomLevel = [_maxZoomLevel doubleValue];
  }
}

- (void)setAboveLayerID:(NSString *)aboveLayerID {
  if (_aboveLayerID != nil && _aboveLayerID == aboveLayerID) {
    return;
  }

  _aboveLayerID = aboveLayerID;
  if (_styleLayer != nil) {
    [self removeFromMap:_style];
    [self insertAbove:aboveLayerID];
  }
}

- (void)setBelowLayerID:(NSString *)belowLayerID {
  if (_belowLayerID != nil && _belowLayerID == belowLayerID) {
    return;
  }

  _belowLayerID = belowLayerID;
  if (_styleLayer != nil) {
    [self removeFromMap:_style];
    [self insertBelow:_belowLayerID];
  }
}

- (void)setLayerIndex:(NSNumber *)layerIndex {
  if (_layerIndex != nil && _layerIndex == layerIndex) {
    return;
  }

  _layerIndex = layerIndex;
  if (_styleLayer != nil) {
    [self removeFromMap:_style];
    [self insertAtIndex:_layerIndex.unsignedIntegerValue];
  }
}

- (void)setMap:(MLRNMapView *)map {
  if (map == nil) {
    [self removeFromMap:_map.style];
    _map = nil;
  } else {
    _map = map;
    [self addToMap:map style:map.style];
  }
}

- (void)setReactStyle:(NSDictionary *)reactStyle {
  _reactStyle = reactStyle;

  if (_styleLayer != nil) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self addStyles];
    });
  }
}

- (void)setSourceLayerID:(NSString *)sourceLayerID {
  _sourceLayerID = sourceLayerID;

  if (_styleLayer != nil && [_styleLayer isKindOfClass:[MLNVectorStyleLayer class]]) {
    ((MLNVectorStyleLayer *)_styleLayer).sourceLayerIdentifier = _sourceLayerID;
  }
}

- (void)setFilter:(NSArray *)filter {
  _filter = filter;

  if (_styleLayer != nil && [_styleLayer isKindOfClass:[MLNVectorStyleLayer class]]) {
    NSPredicate *predicate = [self buildFilters];
    [self updateFilter:predicate];
  }
}

// MARK: - Filter support

- (NSPredicate *)buildFilters {
  return _filter ? [FilterParser parse:_filter] : nil;
}

- (void)updateFilter:(NSPredicate *)predicate {
  @try {
    ((MLNVectorStyleLayer *)_styleLayer).predicate = predicate;
  } @catch (NSException *exception) {
    RCTLogError(@"Invalid predicate: %@ on layer %@ - %@ reason: %@", predicate, self,
                exception.name, exception.reason);
  }
}

// MARK: - Map lifecycle

- (void)addToMap:(MLRNMapView *)map style:(MLNStyle *)style {
  if (style == nil) {
    return;
  }
  _map = map;
  _style = style;
  if (_id == nil) {
    RCTLogError(@"Cannot add a layer without id to the map: %@", self);
    return;
  }
  MLNStyleLayer *existingLayer = [style layerWithIdentifier:_id];
  if (existingLayer != nil) {
    _styleLayer = existingLayer;
  } else {
    _styleLayer = [self makeLayer:style];
    if (_styleLayer == nil) {
      RCTLogError(@"Failed to make layer: %@", _id);
      return;
    }
    [self insertLayer:map];
  }

  [self addStyles];
  [self addedToMap];
}

- (nullable MLNSource *)layerWithSourceIDInStyle:(nonnull MLNStyle *)style {
  MLNSource *result = [style sourceWithIdentifier:self.sourceID];
  if (result == NULL) {
    RCTLogError(@"Cannot find source with id: %@ referenced by layer:%@", self.sourceID, _id);
  }
  return result;
}

- (void)removeFromMap:(MLNStyle *)style {
  if (_styleLayer != nil) {
    [style removeLayer:_styleLayer];
  }
  _style = nil;
}

- (BOOL)isAddedToMap {
  return (_style != nil);
}

// MARK: - Layer factory (type-based dispatch)

- (nullable MLNStyleLayer *)makeLayer:(MLNStyle *)style {
  NSString *type = _layerType;

  if ([type isEqualToString:@"background"]) {
    return [[MLNBackgroundStyleLayer alloc] initWithIdentifier:_id];
  }

  // All other layer types need a source
  MLNSource *source = [self layerWithSourceIDInStyle:style];
  if (source == nil) {
    return nil;
  }

  MLNStyleLayer *layer = nil;

  if ([type isEqualToString:@"fill"]) {
    layer = [[MLNFillStyleLayer alloc] initWithIdentifier:_id source:source];
  } else if ([type isEqualToString:@"line"]) {
    layer = [[MLNLineStyleLayer alloc] initWithIdentifier:_id source:source];
  } else if ([type isEqualToString:@"symbol"]) {
    layer = [[MLNSymbolStyleLayer alloc] initWithIdentifier:_id source:source];
  } else if ([type isEqualToString:@"circle"]) {
    layer = [[MLNCircleStyleLayer alloc] initWithIdentifier:_id source:source];
  } else if ([type isEqualToString:@"heatmap"]) {
    layer = [[MLNHeatmapStyleLayer alloc] initWithIdentifier:_id source:source];
  } else if ([type isEqualToString:@"fill-extrusion"]) {
    layer = [[MLNFillExtrusionStyleLayer alloc] initWithIdentifier:_id source:source];
  } else if ([type isEqualToString:@"raster"]) {
    layer = [[MLNRasterStyleLayer alloc] initWithIdentifier:_id source:source];
  } else {
    RCTLogError(@"Unknown layer type: %@", type);
    return nil;
  }

  // Set sourceLayerIdentifier for vector layers
  if (_sourceLayerID != nil && [layer isKindOfClass:[MLNVectorStyleLayer class]]) {
    ((MLNVectorStyleLayer *)layer).sourceLayerIdentifier = _sourceLayerID;
  }

  return layer;
}

// MARK: - Style application (type-based dispatch)

- (void)addStyles {
  MLRNStyle *style = [[MLRNStyle alloc] initWithMLNStyle:self.style];
  style.bridge = self.bridge;

  BOOL (^isValid)(void) = ^{
    return [self isAddedToMap];
  };

  if ([_styleLayer isKindOfClass:[MLNFillStyleLayer class]]) {
    [style fillLayer:(MLNFillStyleLayer *)_styleLayer withReactStyle:_reactStyle isValid:isValid];
  } else if ([_styleLayer isKindOfClass:[MLNLineStyleLayer class]]) {
    [style lineLayer:(MLNLineStyleLayer *)_styleLayer withReactStyle:_reactStyle isValid:isValid];
  } else if ([_styleLayer isKindOfClass:[MLNSymbolStyleLayer class]]) {
    [style symbolLayer:(MLNSymbolStyleLayer *)_styleLayer
        withReactStyle:_reactStyle
               isValid:isValid];
  } else if ([_styleLayer isKindOfClass:[MLNCircleStyleLayer class]]) {
    [style circleLayer:(MLNCircleStyleLayer *)_styleLayer
        withReactStyle:_reactStyle
               isValid:isValid];
  } else if ([_styleLayer isKindOfClass:[MLNHeatmapStyleLayer class]]) {
    [style heatmapLayer:(MLNHeatmapStyleLayer *)_styleLayer
         withReactStyle:_reactStyle
                isValid:isValid];
  } else if ([_styleLayer isKindOfClass:[MLNFillExtrusionStyleLayer class]]) {
    [style fillExtrusionLayer:(MLNFillExtrusionStyleLayer *)_styleLayer
               withReactStyle:_reactStyle
                      isValid:isValid];
  } else if ([_styleLayer isKindOfClass:[MLNRasterStyleLayer class]]) {
    [style rasterLayer:(MLNRasterStyleLayer *)_styleLayer
        withReactStyle:_reactStyle
               isValid:isValid];
  } else if ([_styleLayer isKindOfClass:[MLNBackgroundStyleLayer class]]) {
    [style backgroundLayer:(MLNBackgroundStyleLayer *)_styleLayer
            withReactStyle:_reactStyle
                   isValid:isValid];
  }
}

- (void)addedToMap {
  NSPredicate *filter = [self buildFilters];
  if (filter != nil && [_styleLayer isKindOfClass:[MLNVectorStyleLayer class]]) {
    [self updateFilter:filter];
  }
}

// MARK: - Layer insertion

- (void)insertLayer:(MLRNMapView *)map {
  if ([_style layerWithIdentifier:_id] != nil) {
    return;  // prevent layer from being added twice
  }

  if (_aboveLayerID != nil) {
    [self insertAbove:_aboveLayerID];
  } else if (_belowLayerID != nil) {
    [self insertBelow:_belowLayerID];
  } else if (_layerIndex != nil) {
    [self insertAtIndex:_layerIndex.unsignedIntegerValue];
  } else {
    [_style addLayer:_styleLayer];
    [_map layerAdded:_styleLayer];
  }

  [self setZoomBounds];
}

- (void)setZoomBounds {
  if (_maxZoomLevel != nil) {
    _styleLayer.maximumZoomLevel = [_maxZoomLevel doubleValue];
  }

  if (_minZoomLevel != nil) {
    _styleLayer.minimumZoomLevel = [_minZoomLevel doubleValue];
  }
}

- (void)insertAbove:(NSString *)aboveLayerIDs {
  [_map waitForLayerWithId:aboveLayerIDs
                      then:^void(MLNStyleLayer *layer) {
                        if (![self _hasInitialized]) {
                          return;
                        }
                        [self->_style insertLayer:self->_styleLayer aboveLayer:layer];
                        [self->_map layerAdded:self->_styleLayer];
                      }];
}

- (void)insertBelow:(NSString *)belowLayerID {
  [_map waitForLayerWithId:belowLayerID
                      then:^void(MLNStyleLayer *layer) {
                        if (![self _hasInitialized]) {
                          return;
                        }

                        [self->_style insertLayer:self->_styleLayer belowLayer:layer];
                        [self->_map layerAdded:self->_styleLayer];
                      }];
}

- (void)insertAtIndex:(NSUInteger)index {
  if (![self _hasInitialized]) {
    return;
  }
  NSArray *layers = _style.layers;
  if (index >= layers.count) {
    RCTLogWarn(@"Layer index is greater than number of layers on map. Layer inserted at end of "
               @"layer stack.");
    index = layers.count - 1;
  }
  [_style insertLayer:self->_styleLayer atIndex:index];
  [_map layerAdded:self->_styleLayer];
}

- (BOOL)_hasInitialized {
  return _style != nil && _styleLayer != nil;
}

@end
