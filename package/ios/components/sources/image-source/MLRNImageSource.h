#import "MLRNSource.h"

@interface MLRNImageSource : MLRNSource

@property (nonatomic, copy) NSString *url;
@property (nonatomic, copy) NSArray<NSArray<NSNumber *> *> *coordinates;

@end
