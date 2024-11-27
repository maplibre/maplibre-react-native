#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

@interface MLRNImageUtils : NSObject

+(NSString *)createTempFile:(UIImage *)image;
+(NSString *)createBase64:(UIImage *)image;

@end
