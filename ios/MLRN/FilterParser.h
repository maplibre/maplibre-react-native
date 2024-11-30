#import <Foundation/Foundation.h>

@interface FilterParser : NSObject

+ (NSPredicate*)parse:(NSArray *)filter;

@end
