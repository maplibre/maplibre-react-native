//
//  RCTMLNSymbolLayer.m
//  RCTMLN
//
//  Created by Nick Italiano on 9/19/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNSymbolLayer.h"
#import "RCTMLNStyle.h"
#import <React/UIView+React.h>
#import <React/RCTLog.h>

@implementation RCTMLNSymbolLayer

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        _reactSubviews = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)invalidate
{
    if (_snapshot == YES && self.style != nil) {
        [self.style removeImageForName:self.id];
    }
}

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (void)insertReactSubview:(id<RCTComponent>)subview atIndex:(NSInteger)atIndex {
    [_reactSubviews insertObject:(UIView *)subview atIndex:(NSUInteger) atIndex];
}
#pragma clang diagnostic pop

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (void)removeReactSubview:(id<RCTComponent>)subview {
    [_reactSubviews removeObject:(UIView *)subview];
}
#pragma clang diagnostic pop

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (NSArray<id<RCTComponent>> *)reactSubviews {
    return nil;
}
#pragma clang diagnostic pop

- (void)setSnapshot:(BOOL)snapshot
{
    _snapshot = snapshot;
    
    if (self.style != nil) {
        UIImage *image;
        MLNSymbolStyleLayer *layer = (MLNSymbolStyleLayer *) self.styleLayer;
        
        if (_snapshot == YES) {
            image = [self _createViewSnapshot];
            [self.style setImage:image forName:self.id];
            layer.iconImageName = [NSExpression expressionWithFormat:self.id];
        } else {
            image = [self.style imageForName:self.id];
            
            if (image != nil) {
                [self.style removeImageForName:self.id];
                layer.iconImageName = nil;
            }
        }
    }
}

- (void)addedToMap
{
    [super addedToMap];
    
    if (_snapshot == YES) {
        UIImage *image = [self _createViewSnapshot];
        
        if (image != nil) {
            [self.style setImage:image forName:self.id];
            
            MLNSymbolStyleLayer *layer = (MLNSymbolStyleLayer *)self.styleLayer;
            layer.iconImageName = [NSExpression expressionForConstantValue:self.id];
        }
    }
}

- (MLNSymbolStyleLayer*)makeLayer:(MLNStyle*)style
{
    MLNSource *source = [self layerWithSourceIDInStyle: style];
    if (source == nil) { return nil; }
    MLNSymbolStyleLayer *layer = [[MLNSymbolStyleLayer alloc] initWithIdentifier:self.id source:source];
    layer.sourceLayerIdentifier = self.sourceLayerID;
    return layer;
}

- (void)addStyles
{
    RCTMLNStyle *style = [[RCTMLNStyle alloc] initWithMLNStyle:self.style];
    style.bridge = self.bridge;
    [style symbolLayer:(MLNSymbolStyleLayer*)self.styleLayer withReactStyle:self.reactStyle isValid:^{ return [self isAddedToMap];
    }];
}

- (UIImage *)_createViewSnapshot
{
    if (_reactSubviews.count == 0) {
        return nil;
    }
    UIView *view = (UIView *)_reactSubviews[0];
    UIGraphicsBeginImageContextWithOptions(view.bounds.size, NO, 0.f);
    [view drawViewHierarchyInRect:view.bounds afterScreenUpdates:YES];
    UIImage *snapshot = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return snapshot;
}

@end
