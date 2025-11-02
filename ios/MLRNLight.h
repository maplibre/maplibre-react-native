#import <UIKit/UIKit.h>

#import <MapLibre/MapLibre.h>

@interface MLRNLight : UIView

@property (nonatomic, strong) MLNMapView *map;
@property (nonatomic, strong) NSDictionary *reactStyle;

@end
