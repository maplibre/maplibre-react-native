#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

@interface RNMBImageUtils : NSObject

+(NSString *)createTempFile:(UIImage *)image;
+(NSString *)createBase64:(UIImage *)image;

@end
