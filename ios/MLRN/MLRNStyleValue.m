#import "MLRNStyleValue.h"
#import "MLRNUtils.h"
#import <React/RCTImageLoader.h>

@implementation MLRNStyleValue
{
    NSObject *expressionJSON;
}

- (NSExpression *)mlnStyleValue
{
    if ([_styleType isEqualToString:@"color"] && [expressionJSON respondsToSelector:@selector(objectEnumerator)] && [[[(NSArray*)expressionJSON objectEnumerator] nextObject] isKindOfClass:[NSNumber class]]) {
        UIColor *color = [MLRNUtils toColor:expressionJSON];
        return [NSExpression expressionWithMLNJSONObject:color];
    } else if ([_styleType isEqualToString:@"color"] && [expressionJSON isKindOfClass:[NSNumber class]]) {
      
        UIColor *color = [MLRNUtils toColor:expressionJSON];
        return [NSExpression expressionWithMLNJSONObject:color];
    } else if ([_styleType isEqualToString:@"vector"] && [expressionJSON respondsToSelector:@selector(objectEnumerator)] && [[[(NSArray*)expressionJSON objectEnumerator] nextObject] isKindOfClass:[NSNumber class]]) {
        CGVector vector = [MLRNUtils toCGVector:(NSArray<NSNumber *> *)expressionJSON];
        return [NSExpression expressionWithMLNJSONObject:[NSValue valueWithCGVector:vector]];
    } else if ([_styleType isEqualToString:@"image"] && [expressionJSON isKindOfClass:[NSDictionary class]]) {
        return [NSExpression expressionForConstantValue:[self getImageURI]];
    } else if ([_styleType isEqual:@"edgeinsets"] && [expressionJSON respondsToSelector:@selector(objectEnumerator)] && [[[(NSArray*)expressionJSON objectEnumerator] nextObject] isKindOfClass:[NSNumber class]]){
        UIEdgeInsets edgeInsets = [MLRNUtils toUIEdgeInsets:(NSArray<NSNumber *> *)expressionJSON];
        return [NSExpression expressionWithMLNJSONObject:[NSValue valueWithUIEdgeInsets:edgeInsets]];
    } else if ([_styleType isEqualToString:@"enum"] && [expressionJSON isKindOfClass:[NSNumber class]]) {
        // ensure we pass through values as NSUInteger when mapping to an MLN enum
        NSUInteger uintValue = [(NSNumber*)expressionJSON unsignedIntegerValue];
        id rawValue = [NSValue value:&uintValue withObjCType:@encode(NSUInteger)];
        return [NSExpression expressionWithMLNJSONObject:rawValue];
    } else if ([expressionJSON respondsToSelector:@selector(objectEnumerator)] && [[[(NSArray*)expressionJSON objectEnumerator] nextObject] isKindOfClass:[NSNumber class]]) {
        return [NSExpression expressionForConstantValue:expressionJSON];
    } else {
        return [NSExpression expressionWithMLNJSONObject:expressionJSON];
    }
}

- (void)setStyleObject:(NSObject *)object
{
    expressionJSON = object;
}

- (NSObject *)parse:(NSDictionary *)rawStyleValue
{
    NSObject *object = nil;
    NSString *type = (NSString *)rawStyleValue[@"type"];
    
    if ([type isEqualToString:@"string"]) {
        object = (NSString *)rawStyleValue[@"value"];
    } else if ([type isEqualToString:@"number"]) {
        object = (NSNumber *)rawStyleValue[@"value"];
    } else if ([type isEqualToString:@"boolean"]) {
        object = rawStyleValue[@"value"];
    } else if ([type isEqualToString:@"hashmap"]) {
        NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
        NSArray *values = (NSArray *)rawStyleValue[@"value"];
        
        for (int i = 0; i < values.count; i++) {
            NSObject *key = [self parse:values[i][0]];
            NSObject *value = [self parse:values[i][1]];
            dict[[key mutableCopy]] = value;
        }
        
        object = dict;
    } else if ([type isEqualToString:@"array"]) {
        NSMutableArray *arr = [[NSMutableArray alloc] init];
        NSArray *values = (NSArray *)rawStyleValue[@"value"];
        
        for (int i = 0; i < values.count; i++) {
            [arr addObject:[self parse:values[i]]];
        }
        
        object = arr;
    }
    
    return object;
}



- (BOOL)shouldAddImage
{
    NSString *imageURI = [self getImageURI];
    
    return [imageURI containsString:@"://"];
}

- (NSString *)getImageURI
{
    if ([expressionJSON isKindOfClass:[NSDictionary class]]) {
        return [expressionJSON valueForKey:@"uri"];
    } else if ([expressionJSON isKindOfClass:[NSArray class]]) {
        return nil;
    } else {
        return (NSString *)expressionJSON;
    }
}

- (double)getImageScale
{
    if ([expressionJSON isKindOfClass:[NSDictionary class]]) {
        id scale = [expressionJSON valueForKey:@"scale"];
        if ([scale isKindOfClass:[NSNumber class]]) {
            return [scale doubleValue];
        } else {
            return 1.0;
        }
    } else {
        return 1.0;
    }
}

- (MLNTransition)getTransition
{
    if (![expressionJSON isKindOfClass:[NSDictionary class]]) {
        return MLNTransitionMake(0.f, 0.f);
    }
    
    NSDictionary *config = (NSDictionary *)expressionJSON;
    double duration = config[@"duration"] != nil ? [config[@"duration"] doubleValue] : 300.0;
    double delay = config[@"delay"] != nil ? [config[@"delay"] doubleValue] : 0.0;

    const double millisecondsToSeconds = 1.0/1000.0;
    
    return MLNTransitionMake(duration * millisecondsToSeconds, delay * millisecondsToSeconds);
}

- (NSExpression *)getSphericalPosition
{
    NSArray *values = (NSArray<NSNumber *> *)expressionJSON;
    
    CGFloat radial = [values[0] floatValue];
    CLLocationDistance azimuthal = [values[1] doubleValue];
    CLLocationDistance polar = [values[2] doubleValue];
    
    MLNSphericalPosition pos = MLNSphericalPositionMake(radial, azimuthal, polar);
    return [NSExpression expressionWithMLNJSONObject:@(pos)];
}

- (BOOL)isVisible
{
    if ([expressionJSON isKindOfClass:[NSString class]]) {
        NSString *visible = (NSString *)expressionJSON;
        return [visible isEqualToString:@"visible"];
    }
    return YES;
}

+ (MLRNStyleValue*)make:(NSDictionary*)rawStyleValue;
{
    MLRNStyleValue *styleValue = [[MLRNStyleValue alloc] init];
    styleValue.styleType = (NSString *)rawStyleValue[@"styletype"];
    NSObject *object = [styleValue parse:(NSDictionary *)rawStyleValue[@"stylevalue"]];
    [styleValue setStyleObject:object];
    return styleValue;
}

@end
