#import <MapLibreReactNativeSpec/MapLibreReactNativeSpec.h>

#import "MLRNLocationManagerDelegate.h"

@interface MLRNLocationModule
    : NativeLocationModuleSpecBase <NativeLocationModuleSpec, MLRNLocationManagerDelegate>
@end
