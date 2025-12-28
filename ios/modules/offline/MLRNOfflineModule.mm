#import "MLRNOfflineModule.h"
#import "MLRNEvent.h"
#import "MLRNEventTypes.h"
#import "MLRNUtils.h"

@implementation MLRNOfflineModule {
  NSUInteger lastPackState;
  double lastPackTimestamp;
  double eventThrottle;
  NSMutableArray<RCTPromiseResolveBlock> *packRequestQueue;
}

+ (NSString *)moduleName {
  return @"MLRNOfflineModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeOfflineModuleSpecJSI>(params);
}

- (instancetype)init {
  if (self = [super init]) {
    packRequestQueue = [NSMutableArray new];
    eventThrottle = 300;
    lastPackState = -1;

    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    [defaultCenter addObserver:self
                      selector:@selector(offlinePackProgressDidChange:)
                          name:MLNOfflinePackProgressChangedNotification
                        object:nil];
    [defaultCenter addObserver:self
                      selector:@selector(offlinePackDidReceiveError:)
                          name:MLNOfflinePackErrorNotification
                        object:nil];
    [defaultCenter addObserver:self
                      selector:@selector(offlinePackDidReceiveMaxAllowedMapboxTiles:)
                          name:MLNOfflinePackMaximumMapboxTilesReachedNotification
                        object:nil];

    [[MLNOfflineStorage sharedOfflineStorage] addObserver:self
                                               forKeyPath:@"packs"
                                                  options:NSKeyValueObservingOptionInitial
                                                  context:NULL];
  }
  return self;
}

- (void)dealloc {
  [[MLNOfflineStorage sharedOfflineStorage] removeObserver:self forKeyPath:@"packs"];
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey, id> *)change
                       context:(void *)context {
  if ([keyPath isEqualToString:@"state"] && [object isKindOfClass:[MLNOfflinePack class]]) {
    MLNOfflinePack *pack = (MLNOfflinePack *)object;
    [self observerStateForPack:pack context:context];
    return;
  }

  if (packRequestQueue.count == 0) {
    return;
  }

  NSArray<MLNOfflinePack *> *packs = [[MLNOfflineStorage sharedOfflineStorage] packs];
  if (packs == nil) {
    return;
  }

  while (packRequestQueue.count > 0) {
    RCTPromiseResolveBlock resolve = [packRequestQueue objectAtIndex:0];
    resolve([self _convertPacksToJson:packs]);
    [packRequestQueue removeObjectAtIndex:0];
  }
}

- (void)createPack:(JS::NativeOfflineModule::NativeOfflineCreatePackOptions &)options
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
  NSString *styleURL = options.styleURL();
  NSString *boundsStr = options.bounds();
  MLNCoordinateBounds bounds = [MLRNUtils fromFeatureCollection:boundsStr];

  id<MLNOfflineRegion> offlineRegion =
      [[MLNTilePyramidOfflineRegion alloc] initWithStyleURL:[NSURL URLWithString:styleURL]
                                                     bounds:bounds
                                              fromZoomLevel:options.minZoom()
                                                toZoomLevel:options.maxZoom()];
  NSData *context = [self _archiveMetadata:options.metadata()];

  [[MLNOfflineStorage sharedOfflineStorage]
       addPackForRegion:offlineRegion
            withContext:context
      completionHandler:^(MLNOfflinePack *pack, NSError *error) {
        if (error != nil) {
          reject(@"createPack", error.description, error);
          return;
        }
        resolve([self _convertPackToDict:pack]);
        [pack resume];
      }];
}

- (void)mergeOfflineRegions:(NSString *)path
                    resolve:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject {
  NSString *absolutePath;
  if ([path isAbsolutePath]) {
    absolutePath = path;
  } else {
    NSBundle *mainBundle = [NSBundle mainBundle];
    NSString *fileName = [path stringByDeletingPathExtension];
    NSString *extension = [path pathExtension];
    absolutePath = [mainBundle pathForResource:fileName ofType:extension];
    if (!absolutePath) {
      return reject(
          @"asset_does_not_exist",
          [NSString
              stringWithFormat:@"The given assetName, %@, can't be found in the app's bundle.",
                               path],
          nil);
    }
  }

  [[MLNOfflineStorage sharedOfflineStorage]
          addContentsOfFile:absolutePath
      withCompletionHandler:^(NSURL *fileURL, NSArray<MLNOfflinePack *> *packs, NSError *error) {
        if (error != nil) {
          reject(@"mergeOfflineRegions", error.description, error);
          return;
        }
        resolve(nil);
      }];
}

- (void)getPacks:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSArray<MLNOfflinePack *> *packs = [[MLNOfflineStorage sharedOfflineStorage] packs];

    if (packs == nil) {
      // packs have not loaded yet
      [self->packRequestQueue addObject:resolve];
      return;
    }

    resolve([self _convertPacksToJson:packs]);
  });
}

- (void)invalidateAmbientCache:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject {
  [[MLNOfflineStorage sharedOfflineStorage]
      invalidateAmbientCacheWithCompletionHandler:^(NSError *error) {
        if (error != nil) {
          reject(@"invalidateAmbientCache", error.description, error);
          return;
        }
        resolve(nil);
      }];
}

- (void)clearAmbientCache:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [[MLNOfflineStorage sharedOfflineStorage]
      clearAmbientCacheWithCompletionHandler:^(NSError *error) {
        if (error != nil) {
          reject(@"clearAmbientCache", error.description, error);
          return;
        }
        resolve(nil);
      }];
}

- (void)setMaximumAmbientCacheSize:(double)size
                           resolve:(RCTPromiseResolveBlock)resolve
                            reject:(RCTPromiseRejectBlock)reject {
  [[MLNOfflineStorage sharedOfflineStorage]
      setMaximumAmbientCacheSize:(NSUInteger)size
           withCompletionHandler:^(NSError *error) {
             if (error != nil) {
               reject(@"setMaximumAmbientCacheSize", error.description, error);
               return;
             }
             resolve(nil);
           }];
}

- (void)resetDatabase:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [[MLNOfflineStorage sharedOfflineStorage] resetDatabaseWithCompletionHandler:^(NSError *error) {
    if (error != nil) {
      reject(@"resetDatabase", error.description, error);
      return;
    }
    resolve(nil);
  }];
}

- (void)getPackStatus:(NSString *)name
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject {
  MLNOfflinePack *pack = [self _getPackFromName:name];

  if (pack == nil) {
    resolve(nil);
    NSLog(@"getPackStatus - Unknown offline region");
    return;
  }

  if (pack.state == MLNOfflinePackStateUnknown) {
    [pack addObserver:self
           forKeyPath:@"state"
              options:NSKeyValueObservingOptionNew
              context:(__bridge_retained void *)resolve];
    [pack requestProgress];
  } else {
    resolve([self _makeRegionStatusPayload:name pack:pack]);
  }
}

- (void)observerStateForPack:(MLNOfflinePack *)pack context:(nullable void *)context {
  RCTPromiseResolveBlock resolve = (__bridge_transfer RCTPromiseResolveBlock)context;
  dispatch_async(dispatch_get_main_queue(), ^{
    NSDictionary *metadata = [self _unarchiveMetadata:pack];
    NSString *name = metadata[@"name"];
    resolve([self _makeRegionStatusPayload:name pack:pack]);
  });
  [pack removeObserver:self forKeyPath:@"state" context:context];
}

- (void)setPackObserver:(NSString *)name
                resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject {
  MLNOfflinePack *pack = [self _getPackFromName:name];

  if (pack == nil) {
    resolve(@NO);
    return;
  }

  // On iOS, observers are set up automatically via NSNotificationCenter
  resolve(@YES);
}

- (void)invalidatePack:(NSString *)name
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject {
  MLNOfflinePack *pack = [self _getPackFromName:name];

  if (pack == nil) {
    resolve(nil);
    return;
  }
  [[MLNOfflineStorage sharedOfflineStorage] invalidatePack:pack
                                     withCompletionHandler:^(NSError *error) {
                                       if (error != nil) {
                                         reject(@"invalidatePack", error.description, error);
                                         return;
                                       }
                                       resolve(nil);
                                     }];
}

- (void)deletePack:(NSString *)name
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
  MLNOfflinePack *pack = [self _getPackFromName:name];

  if (pack == nil) {
    resolve(nil);
    return;
  }
  if (pack.state == MLNOfflinePackStateInvalid) {
    NSError *error = [NSError errorWithDomain:MLNErrorDomain
                                         code:1
                                     userInfo:@{
                                       NSLocalizedDescriptionKey :
                                           NSLocalizedString(@"Pack has already been deleted", nil)
                                     }];
    reject(@"deletePack", error.description, error);
    return;
  }
  [[MLNOfflineStorage sharedOfflineStorage] removePack:pack
                                 withCompletionHandler:^(NSError *error) {
                                   if (error != nil) {
                                     reject(@"deletePack", error.description, error);
                                     return;
                                   }
                                   resolve(nil);
                                 }];
}

- (void)pausePackDownload:(NSString *)name
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject {
  MLNOfflinePack *pack = [self _getPackFromName:name];

  if (pack == nil) {
    reject(@"pausePackDownload", @"Unknown offline region", nil);
    return;
  }

  if (pack.state == MLNOfflinePackStateInactive || pack.state == MLNOfflinePackStateComplete) {
    resolve(nil);
    return;
  }

  [pack suspend];
  resolve(nil);
}

- (void)resumePackDownload:(NSString *)name
                   resolve:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject {
  MLNOfflinePack *pack = [self _getPackFromName:name];

  if (pack == nil) {
    reject(@"resumePack", @"Unknown offline region", nil);
    return;
  }

  if (pack.state == MLNOfflinePackStateActive || pack.state == MLNOfflinePackStateComplete) {
    resolve(nil);
    return;
  }

  [pack resume];
  resolve(nil);
}

- (void)setTileCountLimit:(double)limit {
  [[MLNOfflineStorage sharedOfflineStorage] setMaximumAllowedMapboxTiles:(uint64_t)limit];
}

- (void)setProgressEventThrottle:(double)throttleValue {
  eventThrottle = throttleValue;
}

- (void)offlinePackProgressDidChange:(NSNotification *)notification {
  MLNOfflinePack *pack = notification.object;

  if (pack.state == MLNOfflinePackStateInvalid) {
    return;  // Avoid invalid offline pack exception
  }

  if ([self _shouldSendProgressEvent:[self _getCurrentTimestamp] pack:pack]) {
    NSDictionary *metadata = [self _unarchiveMetadata:pack];
    NSDictionary *payload = [self _makeRegionStatusPayload:metadata[@"name"] pack:pack];
    [self emitOnProgress:payload];
    lastPackTimestamp = [self _getCurrentTimestamp];
  }

  lastPackState = pack.state;
}

- (void)offlinePackDidReceiveError:(NSNotification *)notification {
  MLNOfflinePack *pack = notification.object;
  if (pack.state == MLNOfflinePackStateInvalid) {
    return;  // Avoid invalid offline pack exception
  }
  NSDictionary *metadata = [self _unarchiveMetadata:pack];

  NSString *name = metadata[@"name"];
  if (name != nil) {
    NSError *error = notification.userInfo[MLNOfflinePackUserInfoKeyError];
    NSDictionary *payload = @{@"name" : name, @"message" : error.description ?: @"Unknown error"};
    [self emitOnError:payload];
  }
}

- (void)offlinePackDidReceiveMaxAllowedMapboxTiles:(NSNotification *)notification {
  MLNOfflinePack *pack = notification.object;
  NSDictionary *metadata = [self _unarchiveMetadata:pack];

  NSString *name = metadata[@"name"];
  if (name != nil) {
    NSDictionary *payload = @{@"name" : name, @"message" : @"Mapbox tile limit exceeded"};
    [self emitOnError:payload];
  }
}

- (double)_getCurrentTimestamp {
  return CACurrentMediaTime() * 1000;
}

- (NSData *)_archiveMetadata:(NSString *)metadata {
  return [NSKeyedArchiver archivedDataWithRootObject:metadata];
}

- (NSDictionary *)_unarchiveMetadata:(MLNOfflinePack *)pack {
  id data = [NSKeyedUnarchiver unarchiveObjectWithData:pack.context];
  // Version v5 store data as NSDictionary while v6 store data as JSON string.
  // User might save offline pack in v5 and then try to read in v6.
  // In v5 are metadata stored nested which need to be handled in JS.
  if ([data isKindOfClass:[NSDictionary class]]) {
    return data;
  }

  if (data == nil) {
    return @{};
  }

  return [NSJSONSerialization JSONObjectWithData:[data dataUsingEncoding:NSUTF8StringEncoding]
                                         options:NSJSONReadingMutableContainers
                                           error:nil];
}

- (NSDictionary *)_makeRegionStatusPayload:(NSString *)name pack:(MLNOfflinePack *)pack {
  uint64_t completedResources = pack.progress.countOfResourcesCompleted;
  uint64_t expectedResources = pack.progress.countOfResourcesExpected;
  float progressPercentage = (float)completedResources / expectedResources;

  // prevent NaN errors when expectedResources is 0
  if (expectedResources == 0) {
    progressPercentage = 0;
  }

  return @{
    @"state" : @(pack.state),
    @"name" : name ?: @"",
    @"percentage" : @(ceilf(progressPercentage * 100.0)),
    @"completedResourceCount" : @(pack.progress.countOfResourcesCompleted),
    @"completedResourceSize" : @(pack.progress.countOfBytesCompleted),
    @"completedTileSize" : @(pack.progress.countOfTileBytesCompleted),
    @"completedTileCount" : @(pack.progress.countOfTilesCompleted),
    @"requiredResourceCount" : @(pack.progress.maximumResourcesExpected)
  };
}

- (NSArray<NSDictionary *> *)_convertPacksToJson:(NSArray<MLNOfflinePack *> *)packs {
  NSMutableArray<NSDictionary *> *jsonPacks = [NSMutableArray new];

  if (packs == nil) {
    return jsonPacks;
  }

  for (MLNOfflinePack *pack in packs) {
    NSDictionary *packDict = [self _convertPackToDict:pack];
    if (packDict != nil) {
      [jsonPacks addObject:packDict];
    }
  }

  return jsonPacks;
}

- (NSDictionary *)_convertPackToDict:(MLNOfflinePack *)pack {
  // format bounds
  MLNTilePyramidOfflineRegion *region = (MLNTilePyramidOfflineRegion *)pack.region;
  if (region == nil) {
    return nil;
  }

  // Return bounds as flat array [west, south, east, north] to match LngLatBounds type
  NSArray *jsonBounds = @[
    @(region.bounds.sw.longitude),  // west
    @(region.bounds.sw.latitude),   // south
    @(region.bounds.ne.longitude),  // east
    @(region.bounds.ne.latitude)    // north
  ];

  // format metadata
  NSDictionary *metadata = [self _unarchiveMetadata:pack];
  NSData *jsonMetadata = [NSJSONSerialization dataWithJSONObject:metadata options:0 error:nil];
  return @{
    @"metadata" : [[NSString alloc] initWithData:jsonMetadata encoding:NSUTF8StringEncoding],
    @"bounds" : jsonBounds
  };
}

- (MLNOfflinePack *)_getPackFromName:(NSString *)name {
  NSArray<MLNOfflinePack *> *packs = [[MLNOfflineStorage sharedOfflineStorage] packs];

  if (packs == nil) {
    return nil;
  }

  for (MLNOfflinePack *pack in packs) {
    NSDictionary *metadata = [self _unarchiveMetadata:pack];

    if ([name isEqualToString:metadata[@"name"]]) {
      return pack;
    }
  }

  return nil;
}

- (BOOL)_shouldSendProgressEvent:(double)currentTimestamp pack:(MLNOfflinePack *)currentPack {
  if (lastPackState == -1) {
    return YES;
  }

  if (lastPackState != currentPack.state) {
    return YES;
  }

  if (currentTimestamp - lastPackTimestamp > eventThrottle) {
    return YES;
  }

  return NO;
}

@end
