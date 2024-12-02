#import "CameraUpdateQueue.h"

@implementation CameraUpdateQueue
{
    NSMutableArray<CameraStop*> *queue;
}

- (instancetype)init
{
    if (self = [super init]) {
        queue = [[NSMutableArray alloc] init];
    }
    
    return self;
}

- (void)enqueue:(CameraStop*)cameraUpdateItem
{
    [queue addObject:cameraUpdateItem];
}

- (CameraStop*)dequeue
{
    if ([self isEmpty]) {
        return nil;
    }
    CameraStop *stop = queue.firstObject;
    [queue removeObjectAtIndex:0];
    return stop;
}

- (void)flush
{
    [queue removeAllObjects];
}

- (BOOL)isEmpty
{
    return queue.count == 0;
}

- (void)execute:(MLRNMapView*)mapView
{
    if (mapView == nil) {
        return;
    }

    if ([self isEmpty]) {
        return;
    }

    CameraStop *stop = [self dequeue];
    if (stop == nil) {
        return;
    }
    
    CameraUpdateItem *item = [[CameraUpdateItem alloc] init];
    item.cameraStop = stop;
    
    __weak CameraUpdateQueue *weakSelf = self;
    __weak MLRNMapView *weakMap = mapView;
    
    [item execute:mapView withCompletionHandler:^{ [weakSelf execute:weakMap]; }];
}

@end
