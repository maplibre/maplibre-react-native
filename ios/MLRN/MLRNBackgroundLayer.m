#import "MLRNBackgroundLayer.h"
#import "MLRNStyle.h"

@implementation MLRNBackgroundLayer

- (MLNStyleLayer*)makeLayer:(MLNStyle*)style
{
    return [[MLNBackgroundStyleLayer alloc] initWithIdentifier:self.id];
}

- (void)addStyles
{
    MLRNStyle *style = [[MLRNStyle alloc] initWithMLNStyle:self.style];
    style.bridge = self.bridge;
    [style backgroundLayer:(MLNBackgroundStyleLayer*)self.styleLayer withReactStyle:self.reactStyle isValid:^{ return [self isAddedToMap];
    }];
}

@end
