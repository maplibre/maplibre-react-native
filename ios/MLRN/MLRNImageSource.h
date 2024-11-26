//
//  MLRNImageSource.h
//  MLRN
//
//  Created by Nick Italiano on 11/29/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "MLRNSource.h"

@interface MLRNImageSource : MLRNSource

@property (nonatomic, copy) NSString *url;
@property (nonatomic, copy) NSArray<NSArray<NSNumber *> *> *coordinates;

@end
