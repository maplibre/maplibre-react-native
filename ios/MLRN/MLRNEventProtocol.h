@protocol MLRNEventProtocol <NSObject>

@property (nonatomic, copy) NSString *type;
@property (nonatomic, strong) NSDictionary *payload;

- (NSDictionary*)toJSON;

@end
