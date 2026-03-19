#import "MLRNOfflineModule.h"
#import "MLRNEventTypes.h"
#import "MLRNUtils.h"

#import <MapLibre/MapLibre.h>

static NSString *const MLRN_MIGRATION_KEY = @"migrationVersion";
static const NSInteger MLRN_MIGRATION_VERSION = 1;

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

- (void)initialize {
  [self runMigrations];
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

- (void)createPack:(JS::NativeOfflineModule::NativeOfflinePackCreateOptions &)options
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
  NSString *styleURL = options.mapStyle();

  auto boundsArray = options.bounds();
  if (boundsArray.size() != 4) {
    reject(@"createPack", @"Invalid bounds", nil);
    return;
  }

  MLNCoordinateBounds bounds = [MLRNUtils fromReactBounds:@[
    @(boundsArray[0]), @(boundsArray[1]), @(boundsArray[2]), @(boundsArray[3])
  ]];

  id<MLNOfflineRegion> offlineRegion =
      [[MLNTilePyramidOfflineRegion alloc] initWithStyleURL:[NSURL URLWithString:styleURL]
                                                     bounds:bounds
                                              fromZoomLevel:options.minZoom()
                                                toZoomLevel:options.maxZoom()];

  NSString *metadataString = options.metadata();

  NSMutableDictionary *contextDictionary = [NSMutableDictionary new];
  contextDictionary[MLRN_MIGRATION_KEY] = @(MLRN_MIGRATION_VERSION);
  contextDictionary[@"id"] = [[[NSUUID UUID] UUIDString] lowercaseString];
  contextDictionary[@"metadata"] = metadataString;

  NSString *contextString = [self _serializeDictionaryToJSON:contextDictionary];
  NSError *archiveError = nil;
  NSData *contextData = [NSKeyedArchiver archivedDataWithRootObject:contextString
                                              requiringSecureCoding:YES
                                                              error:&archiveError];
  if (archiveError != nil) {
    reject(@"createPack", @"Failed to archive context data", archiveError);
    return;
  }

  [[MLNOfflineStorage sharedOfflineStorage]
       addPackForRegion:offlineRegion
            withContext:contextData
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
      // Packs have not loaded yet
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

- (void)getPackStatus:(NSString *)packId
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject {
  MLNOfflinePack *pack = [self _getPackById:packId];

  if (pack == nil) {
    resolve(nil);
    NSLog(@"[MLRNOfflineModule] Pack not found");

    return;
  }

  if (pack.state == MLNOfflinePackStateUnknown) {
    [pack addObserver:self
           forKeyPath:@"state"
              options:NSKeyValueObservingOptionNew
              context:(__bridge_retained void *)resolve];
    [pack requestProgress];
  } else {
    resolve([self _makeRegionStatusPayload:packId pack:pack]);
  }
}

- (void)observerStateForPack:(MLNOfflinePack *)pack context:(nullable void *)context {
  RCTPromiseResolveBlock resolve = (__bridge_transfer RCTPromiseResolveBlock)context;
  dispatch_async(dispatch_get_main_queue(), ^{
    NSDictionary *metadata = [self _unarchiveContext:pack];
    NSString *packId = metadata[@"id"];
    resolve([self _makeRegionStatusPayload:packId pack:pack]);
  });
  [pack removeObserver:self forKeyPath:@"state" context:context];
}

- (void)setPackObserver:(NSString *)packId
                resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject {
  MLNOfflinePack *pack = [self _getPackById:packId];

  if (pack == nil) {
    resolve(@NO);
    return;
  }

  // On iOS, observers are set up automatically via NSNotificationCenter
  resolve(@YES);
}

- (void)invalidatePack:(NSString *)packId
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject {
  MLNOfflinePack *pack = [self _getPackById:packId];

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

- (void)deletePack:(NSString *)packId
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
  MLNOfflinePack *pack = [self _getPackById:packId];

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

- (void)pausePackDownload:(NSString *)packId
                  resolve:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject {
  MLNOfflinePack *pack = [self _getPackById:packId];

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

- (void)resumePackDownload:(NSString *)packId
                   resolve:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject {
  MLNOfflinePack *pack = [self _getPackById:packId];

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
    NSDictionary *metadata = [self _unarchiveContext:pack];
    NSString *packId = metadata[@"id"];
    NSDictionary *payload = [self _makeRegionStatusPayload:packId pack:pack];
    if (_eventEmitterCallback) {
      [self emitOnProgress:payload];
    }
    lastPackTimestamp = [self _getCurrentTimestamp];
  }

  lastPackState = pack.state;
}

- (void)offlinePackDidReceiveError:(NSNotification *)notification {
  MLNOfflinePack *pack = notification.object;
  if (pack.state == MLNOfflinePackStateInvalid) {
    return;  // Avoid invalid offline pack exception
  }
  NSDictionary *metadata = [self _unarchiveContext:pack];

  NSString *packId = metadata[@"id"];
  if (packId != nil && _eventEmitterCallback) {
    NSError *error = notification.userInfo[MLNOfflinePackUserInfoKeyError];
    NSDictionary *payload = @{@"id" : packId, @"message" : error.description ?: @"Unknown error"};
    [self emitOnError:payload];
  }
}

- (void)offlinePackDidReceiveMaxAllowedMapboxTiles:(NSNotification *)notification {
  MLNOfflinePack *pack = notification.object;
  NSDictionary *metadata = [self _unarchiveContext:pack];

  NSString *packId = metadata[@"id"];
  if (packId != nil && _eventEmitterCallback) {
    NSDictionary *payload = @{@"id" : packId, @"message" : @"Tile limit exceeded"};

    [self emitOnError:payload];
  }
}

- (double)_getCurrentTimestamp {
  return CACurrentMediaTime() * 1000;
}

- (NSString *)_serializeDictionaryToJSON:(NSDictionary *)dictionary {
  if (dictionary == nil) {
    return @"{}";
  }

  NSError *serializeError;
  NSData *data = [NSJSONSerialization dataWithJSONObject:dictionary
                                                 options:0
                                                   error:&serializeError];

  if (serializeError || data == nil) {
    return @"{}";
  }

  NSString *string = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  return string ?: @"{}";
}

- (NSDictionary *)_unarchiveContext:(MLNOfflinePack *)pack {
  NSError *unarchiveError = nil;
  id contextUnknown = [NSKeyedUnarchiver unarchivedObjectOfClass:[NSString class]
                                                        fromData:pack.context
                                                           error:&unarchiveError];

  if (unarchiveError != nil) {
    NSLog(@"[MLRNOfflineModule] Failed to unarchive context: %@",
          unarchiveError.localizedDescription);
    return @{};
  }

  // After migration, all packs should be in JSON string format
  if (contextUnknown == nil) {
    return @{};
  }

  // Parse JSON string to dictionary
  if ([contextUnknown isKindOfClass:[NSString class]]) {
    NSDictionary *contextDictionary = [NSJSONSerialization
        JSONObjectWithData:[contextUnknown dataUsingEncoding:NSUTF8StringEncoding]
                   options:NSJSONReadingMutableContainers
                     error:nil];
    return contextDictionary ?: @{};
  }

  // This should not happen after migration, but handle gracefully
  return @{};
}

/**
 * Migrate offline packs to the latest context format.
 *
 * - Until v5 context uses NSDictionary
 * - From v6 context uses JSON string
 * - From v11 context uses JSON string with with `id` (UUID) and `metadata` (JSON string)
 */
- (void)runMigrations {
  NSArray<MLNOfflinePack *> *packs = [[MLNOfflineStorage sharedOfflineStorage] packs];

  if (packs == nil) {
    NSLog(@"[MLRNOfflineModule] No packs found for migration");
    return;
  }

  NSMutableArray<MLNOfflinePack *> *packsToMigrate = [NSMutableArray new];

  for (MLNOfflinePack *pack in packs) {
    BOOL needsMigration = NO;

    NSError *unarchiveError = nil;
    NSSet *allowedClasses = [NSSet setWithArray:@[ [NSDictionary class], [NSString class] ]];
    id contextUnknown = [NSKeyedUnarchiver unarchivedObjectOfClasses:allowedClasses
                                                            fromData:pack.context
                                                               error:&unarchiveError];

    if (unarchiveError != nil) {
      NSLog(@"[MLRNOfflineModule] Failed to unarchive context during migration check: %@",
            unarchiveError.localizedDescription);
      needsMigration = YES;
    }
    // <= v5 format (NSDictionary)
    else if ([contextUnknown isKindOfClass:[NSDictionary class]]) {
      needsMigration = YES;
    }
    // Check >= v6+ format (JSON string)
    else {
      NSDictionary *contextDictionary = [self _unarchiveContext:pack];
      if (contextDictionary == nil || contextDictionary[MLRN_MIGRATION_KEY] == nil ||
          [contextDictionary[MLRN_MIGRATION_KEY] integerValue] != MLRN_MIGRATION_VERSION) {
        needsMigration = YES;
      }
    }

    if (needsMigration) {
      [packsToMigrate addObject:pack];
    }
  }

  if (packsToMigrate.count == 0) {
    NSLog(@"[MLRNOfflineModule] No packs need migration");

    return;
  }

  NSLog(@"[MLRNOfflineModule] Migrating %lu offline pack(s)", (unsigned long)packsToMigrate.count);

  for (MLNOfflinePack *pack in packsToMigrate) {
    [self migratePack:pack];
  }
}

- (void)migratePack:(MLNOfflinePack *)pack {
  NSDictionary *oldContextDictionary = nil;

  NSError *unarchiveError = nil;
  NSSet *allowedClasses = [NSSet setWithArray:@[ [NSDictionary class], [NSString class] ]];
  id oldContextUnknown = [NSKeyedUnarchiver unarchivedObjectOfClasses:allowedClasses
                                                             fromData:pack.context
                                                                error:&unarchiveError];

  if (unarchiveError != nil) {
    NSLog(@"[MLRNOfflineModule] Failed to unarchive context during migration: %@",
          unarchiveError.localizedDescription);
    oldContextDictionary = @{};
  }

  // Handle <= v5 NSDictionary
  else if ([oldContextUnknown isKindOfClass:[NSDictionary class]]) {
    oldContextDictionary = oldContextUnknown;
  }
  // Handle >= v6+ JSON string
  else {
    oldContextDictionary = [self _unarchiveContext:pack];
  }

  if (oldContextDictionary == nil) {
    oldContextDictionary = @{};
  }

  NSString *packId = [[[NSUUID UUID] UUIDString] lowercaseString];
  NSMutableDictionary *newContextDictionary = [NSMutableDictionary new];

  newContextDictionary[MLRN_MIGRATION_KEY] = @(MLRN_MIGRATION_VERSION);
  newContextDictionary[@"id"] = packId;
  newContextDictionary[@"metadata"] = [self _serializeDictionaryToJSON:oldContextDictionary];

  NSError *archiveError = nil;
  NSData *newContextData = [NSKeyedArchiver
      archivedDataWithRootObject:[self _serializeDictionaryToJSON:newContextDictionary]
           requiringSecureCoding:YES
                           error:&archiveError];

  if (archiveError != nil) {
    NSLog(@"[MLRNOfflineModule] Failed to archive context for pack %@: %@", packId,
          archiveError.localizedDescription);
    return;
  }

  [pack setContext:newContextData
      completionHandler:^(NSError *error) {
        if (error != nil) {
          NSLog(@"[MLRNOfflineModule] Failed to migrate pack %@: %@", packId,
                error.localizedDescription);
        } else {
          NSLog(@"[MLRNOfflineModule] Successfully migrated pack %@", packId);
        }
      }];
}

- (NSString *)_stateToString:(MLNOfflinePackState)state {
  switch (state) {
    case MLNOfflinePackStateActive:
      return @"active";
    case MLNOfflinePackStateComplete:
      return @"complete";
    case MLNOfflinePackStateInactive:
    default:
      return @"inactive";
  }
}

- (NSDictionary *)_makeRegionStatusPayload:(NSString *)packId pack:(MLNOfflinePack *)pack {
  uint64_t completedResources = pack.progress.countOfResourcesCompleted;
  uint64_t expectedResources = pack.progress.countOfResourcesExpected;

  double percentage = 0.0;
  if (expectedResources > 0) {
    percentage = 100.0 * (double)completedResources / (double)expectedResources;
  }

  return @{
    @"id" : packId,
    @"state" : [self _stateToString:pack.state],
    @"percentage" : @(percentage),
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
  MLNTilePyramidOfflineRegion *region = (MLNTilePyramidOfflineRegion *)pack.region;
  if (region == nil) {
    return nil;
  }

  NSArray *bounds = [MLRNUtils fromCoordinateBounds:region.bounds];
  NSDictionary *contextDictionary = [self _unarchiveContext:pack];

  return @{
    @"id" : contextDictionary[@"id"] ?: @"",
    @"bounds" : bounds,
    @"metadata" : contextDictionary[@"metadata"]
  };
}

- (MLNOfflinePack *)_getPackById:(NSString *)packId {
  NSArray<MLNOfflinePack *> *packs = [[MLNOfflineStorage sharedOfflineStorage] packs];

  if (packs == nil || packId == nil) {
    return nil;
  }

  for (MLNOfflinePack *pack in packs) {
    NSDictionary *metadata = [self _unarchiveContext:pack];
    if ([packId isEqualToString:metadata[@"id"]]) {
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
