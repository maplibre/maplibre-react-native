//
//  RNMBImageUtils.h
//  MLRN
//
//  Created by Nick Italiano on 1/18/18.
//  Copyright © 2018 Mapbox Inc. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

@interface MLRNImageUtils : NSObject

+(NSString *)createTempFile:(UIImage *)image;
+(NSString *)createBase64:(UIImage *)image;

@end
