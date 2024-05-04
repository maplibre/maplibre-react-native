//
//  BaseSource.h
//  RCTMLN
//
//  Created by Nick Italiano on 9/8/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <React/RCTComponent.h>
#import "RCTMLNLayer.h"
#import <UIKit/UIKit.h>
@import MapLibre;

@interface RCTMLNSource : UIView

extern NSString * _Nonnull const DEFAULT_SOURCE_ID;

@property (nonatomic, strong) NSMutableArray<id<RCTComponent>> *reactSubviews;
@property (nonatomic, strong) NSMutableArray<RCTMLNLayer*> *layers;
@property (nonatomic, strong) MLNSource *source;
@property (nonatomic, strong) RCTMLNMapView *map;
@property (nonatomic, strong) NSDictionary<NSString *, NSNumber *> *hitbox;

@property (nonatomic, copy) NSString *id;
@property (nonatomic, assign) BOOL hasPressListener;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

- (void)addToMap;
- (void)removeFromMap;
- (nullable MLNSource*)makeSource;
- (NSArray<NSString *> *)getLayerIDs;

+ (BOOL)isDefaultSource:(NSString*)sourceID;

@end
