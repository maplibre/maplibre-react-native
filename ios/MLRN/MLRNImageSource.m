#import "MLRNImageSource.h"
@import MapLibre;

@implementation MLRNImageSource

- (void)setUrl:(NSString *)url
{
    _url = url;

    if (self.source != nil) {
        MLNImageSource *source = (MLNImageSource *)self.source;
        source.URL = [NSURL URLWithString:_url];
    }
}

- (void)setCoordinates:(NSArray<NSArray<NSNumber *> *> *)coordinates
{
    _coordinates = coordinates;
    if (self.source != nil) {
        MLNImageSource *source = (MLNImageSource *)self.source;
        source.coordinates = [self _makeCoordQuad];
    }
}

- (nullable MLNSource *)makeSource
{
    NSURL *myURL;

    if ([[_url substringToIndex:4] isEqualToString:@"http"]) {
        myURL = [NSURL URLWithString:_url];
    }
    else
    {
        //Default consider it file url path
        myURL = [NSURL fileURLWithPath:_url];
    }

    return [[MLNImageSource alloc] initWithIdentifier:self.id
                                   coordinateQuad:[self _makeCoordQuad]
                                   URL:myURL];
}

- (MLNCoordinateQuad)_makeCoordQuad
{
    CLLocationCoordinate2D topLeft = CLLocationCoordinate2DMake([self.coordinates[0][1] floatValue], [self.coordinates[0][0] floatValue]);
    CLLocationCoordinate2D topRight = CLLocationCoordinate2DMake([self.coordinates[1][1] floatValue], [self.coordinates[1][0] floatValue]);
    CLLocationCoordinate2D bottomRight = CLLocationCoordinate2DMake([self.coordinates[2][1] floatValue], [self.coordinates[2][0] floatValue]);
    CLLocationCoordinate2D bottomLeft = CLLocationCoordinate2DMake([self.coordinates[3][1] floatValue], [self.coordinates[3][0] floatValue]);
    return MLNCoordinateQuadMake(topLeft, bottomLeft, bottomRight, topRight);
}

@end
