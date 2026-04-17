#import "MLRNViewModuleUtils.h"

@implementation MLRNViewModuleUtils

+ (void)withView:(RCTViewRegistry *)viewRegistry
              reactTag:(NSInteger)reactTag
    componentViewClass:(Class)componentViewClass
      contentViewClass:(Class)contentViewClass
                 block:(void (^)(UIView *))block
                reject:(RCTPromiseRejectBlock)reject
            methodName:(NSString *)methodName {
  __weak RCTViewRegistry *weakRegistry = viewRegistry;
  [viewRegistry addUIBlock:^(RCTViewRegistry *registry) {
    RCTViewRegistry *strongRegistry = weakRegistry;
    if (!strongRegistry) {
      return;
    }

    UIView *view = [strongRegistry viewForReactTag:[NSNumber numberWithInteger:reactTag]];

    if ([view isKindOfClass:componentViewClass]) {
      UIView *componentView = view;
      UIView *contentView = [componentView valueForKey:@"contentView"];

      if ([contentView isKindOfClass:contentViewClass]) {
        block(contentView);
        return;
      }
    }

    reject(methodName,
           [NSString stringWithFormat:@"Invalid `reactTag` %@, could not find %@",
                                      [NSNumber numberWithInteger:reactTag],
                                      NSStringFromClass(contentViewClass)],
           nil);
  }];
}

@end
