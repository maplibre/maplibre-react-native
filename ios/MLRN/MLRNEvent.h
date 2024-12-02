#import <Foundation/Foundation.h>
#import "MLRNEventProtocol.h"

@interface MLRNEvent : NSObject<MLRNEventProtocol>

@property (nonatomic, copy) NSString *type;
@property (nonatomic, strong) NSDictionary *payload;
@property (nonatomic, readonly) NSTimeInterval timestamp;

+ (MLRNEvent*)makeEvent:(NSString*)eventType;
+ (MLRNEvent*)makeEvent:(NSString*)eventType withPayload:(NSDictionary*)payload;

@end
