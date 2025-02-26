#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface MLRNImageUtils : NSObject

+ (NSString *)createTempFile:(UIImage *)image;
+ (NSString *)createBase64:(UIImage *)image;

@end
