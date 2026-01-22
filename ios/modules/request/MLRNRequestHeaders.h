#import <Foundation/Foundation.h>

@interface NSMutableURLRequest (RequestHeaders)
@end

@interface MLRNRequestHeaders : NSObject

@property (nonatomic, strong) NSMutableDictionary<NSString *, NSString *> *currentHeaders;

+ (id)sharedInstance;
- (void)initialize;
- (void)addHeader:(NSString *)value forHeaderName:(NSString *)header;
- (void)removeHeader:(NSString *)header;

@end
