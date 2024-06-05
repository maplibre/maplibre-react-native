//
//  RCTMLNStyleValue.h
//  RCTMLN
//
//  Created by Nick Italiano on 9/11/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
@import MapLibre;

@interface RCTMLNStyleValue : NSObject

@property (nonatomic, strong) NSString *styleType;
@property (nonatomic, strong) NSDictionary *rawStyleValue;
@property (nonatomic, readonly) NSExpression *mlnStyleValue;

- (BOOL)shouldAddImage;
- (NSString *)getImageURI;
- (double)getImageScale;
- (MLNTransition)getTransition;
- (NSExpression *)getSphericalPosition;
- (BOOL)isVisible;

+ (RCTMLNStyleValue*)make:(NSString*)expressionJSONStr;

@end
