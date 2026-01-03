#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Utility class for common view module operations across MapLibre React Native modules.
 */
@interface MLRNViewModuleUtils : NSObject

/**
 * Retrieves a specific view type from the view registry and executes a block with it
 *
 * Currently based upon the interop layer:
 * https://github.com/facebook/react-native/issues/50800#issuecomment-3046289718
 *
 * @param viewRegistry The RCT view registry (typically viewRegistry_DEPRECATED)
 * @param reactTag The React tag identifying the view
 * @param componentViewClass The expected component view class (e.g., MLRNMapViewComponentView)
 * @param contentViewClass The expected content view class (e.g., MLRNMapView)
 * @param block The block to execute with the typed content view
 * @param reject The promise reject block to call if view lookup fails
 * @param methodName The name of the calling method (used in error messages)
 */
+ (void)withView:(RCTViewRegistry *)viewRegistry
              reactTag:(NSInteger)reactTag
    componentViewClass:(Class)componentViewClass
      contentViewClass:(Class)contentViewClass
                 block:(void (^)(UIView *))block
                reject:(RCTPromiseRejectBlock)reject
            methodName:(NSString *)methodName;

@end

NS_ASSUME_NONNULL_END
