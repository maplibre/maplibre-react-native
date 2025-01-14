# [10.0.0](https://github.com/maplibre/maplibre-react-native/compare/v9.1.0...v10.0.0) (2025-01-14)

For upgrading review the [v10 migration guide](https://maplibre.org/maplibre-react-native/docs/setup/migrations/v10).

### Bug Fixes

* `VectorSource` `onPress` returning null geometry on Android ([250ee6f](https://github.com/maplibre/maplibre-react-native/commit/250ee6f79519b611831a39944fe2270124812bc8)), closes [#538](https://github.com/maplibre/maplibre-react-native/issues/538)
* `VectorSource` `onPress` returning null geometry on Android ([a130786](https://github.com/maplibre/maplibre-react-native/commit/a130786d8b036d1f9700774fba031f408364194e)), closes [#538](https://github.com/maplibre/maplibre-react-native/issues/538)
* add @babel/plugin-transform-private-methods for jest ([3a2188f](https://github.com/maplibre/maplibre-react-native/commit/3a2188fba3d0b3c6a20421e6f02a9f7a6a0e924b))
* add generic expo config plugin to remove duplicate signature ([#453](https://github.com/maplibre/maplibre-react-native/issues/453)) ([2671381](https://github.com/maplibre/maplibre-react-native/commit/267138120a15cabd2d3aaf89333d83033e9f8d32))
* added GeometryCollection to GeoJSONUtils ([#556](https://github.com/maplibre/maplibre-react-native/issues/556)) ([e6b7a66](https://github.com/maplibre/maplibre-react-native/commit/e6b7a6643e31aeba63976131edf3ef1992eabd2a))
* allow MapView and Images to have no children ([#521](https://github.com/maplibre/maplibre-react-native/issues/521)) ([1e35bf6](https://github.com/maplibre/maplibre-react-native/commit/1e35bf6a37b8c0b5023c62c2e4fc84c64480cf74))
* allow resetting contentInset with 0 ([#468](https://github.com/maplibre/maplibre-react-native/issues/468)) ([1fe42c6](https://github.com/maplibre/maplibre-react-native/commit/1fe42c6b3880d595d6ec467f07322ad58a0fbf19))
* android example crashing on launch ([#372](https://github.com/maplibre/maplibre-react-native/issues/372)) ([aeef5c3](https://github.com/maplibre/maplibre-react-native/commit/aeef5c3991e6ef78d8a6a227dd15d83c590474e3))
* cleanup yarn setup ([#463](https://github.com/maplibre/maplibre-react-native/issues/463)) ([d9a4d30](https://github.com/maplibre/maplibre-react-native/commit/d9a4d30b16b625860c4567c233f4f5ed870200be))
* corepack enable  on publish workflow ([2d13f33](https://github.com/maplibre/maplibre-react-native/commit/2d13f33788014cec54e9155e1f6d815804b2e3bc))
* correct types in MapView ([#268](https://github.com/maplibre/maplibre-react-native/issues/268)) ([0ea35c4](https://github.com/maplibre/maplibre-react-native/commit/0ea35c4c3d0dd1a395423f322342128b250d8192))
* disable code signing for release builds ([b3cf088](https://github.com/maplibre/maplibre-react-native/commit/b3cf0883443e23ea24746505bf880902930d6475))
* disable library code signing ([22030dd](https://github.com/maplibre/maplibre-react-native/commit/22030dd04519087af0a71b61e985dce71179e6d1))
* empty pbxproj and dwarf-with-dsym plugin config for EAS ([#458](https://github.com/maplibre/maplibre-react-native/issues/458)) ([0d54b46](https://github.com/maplibre/maplibre-react-native/commit/0d54b46da0af354ebaaddba3abe762bb9782a2d9))
* expo-app should load library from workspace:. ([016b44a](https://github.com/maplibre/maplibre-react-native/commit/016b44aa45a3421544f1ebb658ec97628bb90521))
* export custom header methods ([#552](https://github.com/maplibre/maplibre-react-native/issues/552)) ([58abdb0](https://github.com/maplibre/maplibre-react-native/commit/58abdb0a854e1e17e5dbb15e950e790579ee1716)), closes [#551](https://github.com/maplibre/maplibre-react-native/issues/551)
* group dependabot commits by core, dev and example ([#165](https://github.com/maplibre/maplibre-react-native/issues/165)) ([b697978](https://github.com/maplibre/maplibre-react-native/commit/b697978553ee429c04e64ac685465c8355500e04))
* keep ts-ignore for headingIcon in library [#476](https://github.com/maplibre/maplibre-react-native/issues/476) ([#477](https://github.com/maplibre/maplibre-react-native/issues/477)) ([ef62454](https://github.com/maplibre/maplibre-react-native/commit/ef6245431c78bb20be3a3b09dd81d89ceda60d1b))
* make `follow` props on `Camera` deterministic ([#550](https://github.com/maplibre/maplibre-react-native/issues/550)) ([e9256e7](https://github.com/maplibre/maplibre-react-native/commit/e9256e737c3ae4051d5d67f6baa89a02119520d2))
* make MarkerView props with defaults optional ([#460](https://github.com/maplibre/maplibre-react-native/issues/460)) ([185cf3e](https://github.com/maplibre/maplibre-react-native/commit/185cf3e75fb947634530ef7ee5c2085fd8a2e414))
* plugin for debug simulator ([#164](https://github.com/maplibre/maplibre-react-native/issues/164)) ([06b23d4](https://github.com/maplibre/maplibre-react-native/commit/06b23d48732e093f1eb5056439f3a08d0f2f84fc))
* remove AbortController test mock ([#403](https://github.com/maplibre/maplibre-react-native/issues/403)) ([698b558](https://github.com/maplibre/maplibre-react-native/commit/698b558007d8b4bea3a6198a6417f26eb157053d))
* round compass margins and attribution position to nearest integers [android] ([#294](https://github.com/maplibre/maplibre-react-native/issues/294)) ([c89c842](https://github.com/maplibre/maplibre-react-native/commit/c89c842778cfb91ee3f3424de35515060903f910))
* setMaxAnimationFps on null ([#440](https://github.com/maplibre/maplibre-react-native/issues/440)) ([2884256](https://github.com/maplibre/maplibre-react-native/commit/288425645ce979a0526a69e1f386a5d6dc68a764))
* style expressions ([#466](https://github.com/maplibre/maplibre-react-native/issues/466)) ([2202908](https://github.com/maplibre/maplibre-react-native/commit/2202908e01474f64e704604c89ecd475d3844b30))
* trigger release after npm maintenance ([#548](https://github.com/maplibre/maplibre-react-native/issues/548)) ([f0fca00](https://github.com/maplibre/maplibre-react-native/commit/f0fca00fd255a2a1bc157b92d1cd88a8b87d5933))
* types of `getPointInView` and `getCoordinateFromView` ([#601](https://github.com/maplibre/maplibre-react-native/issues/601)) ([c7537b5](https://github.com/maplibre/maplibre-react-native/commit/c7537b505f99830fa16648e3002eb838e4a60f49))
* updated Mapbox callstack check for iOS custom headers to check for MapLibre instead ([#461](https://github.com/maplibre/maplibre-react-native/issues/461)) ([a6d6216](https://github.com/maplibre/maplibre-react-native/commit/a6d6216f3dd3b368dfed01a42a3e657f64c1f832))
* use UIManager exported from react-native ([#511](https://github.com/maplibre/maplibre-react-native/issues/511)) ([a4030b5](https://github.com/maplibre/maplibre-react-native/commit/a4030b5906d47d12df74d02088fb12ee1f2380c1))
* yarn implementation ([#419](https://github.com/maplibre/maplibre-react-native/issues/419)) ([39233b1](https://github.com/maplibre/maplibre-react-native/commit/39233b13a2b671f01cb0e903806544655cadee08))


### Continuous Integration

* add semantic release ([#526](https://github.com/maplibre/maplibre-react-native/issues/526)) ([069b6c5](https://github.com/maplibre/maplibre-react-native/commit/069b6c564aa92b0c4019a714142c104190b838ed))


### Features

* add Expo plugin props ([#589](https://github.com/maplibre/maplibre-react-native/issues/589)) ([51fbb00](https://github.com/maplibre/maplibre-react-native/commit/51fbb003dfd70bb119814b44fa588c9dfa387993))
* align react and react-native versions for development ([b92abfe](https://github.com/maplibre/maplibre-react-native/commit/b92abfe3e505368f5c39632ee32a0ed352d6706d))
* allow using google location engine on Android ([#586](https://github.com/maplibre/maplibre-react-native/issues/586)) ([92ffdb7](https://github.com/maplibre/maplibre-react-native/commit/92ffdb71d5e734e7e8067482d3aaf459ef67f72f))
* configure packages/examples ([c4510c3](https://github.com/maplibre/maplibre-react-native/commit/c4510c3be600fddc21f5044834c7f2f7b652c246))
* drop `MapLibreGL` naming and deprecate `export default` ([#567](https://github.com/maplibre/maplibre-react-native/issues/567)) ([aa0c73d](https://github.com/maplibre/maplibre-react-native/commit/aa0c73d6af51ec782ac2051ed4f6a51b812e4a8f))
* export RegionPayload and MapLibreRNEvent types ([#544](https://github.com/maplibre/maplibre-react-native/issues/544)) ([b342f1b](https://github.com/maplibre/maplibre-react-native/commit/b342f1b5c82fe3d8bb1a353ebb33c3df26d47532))
* extract android UserLocation FPS ([#428](https://github.com/maplibre/maplibre-react-native/issues/428)) ([8c0abaa](https://github.com/maplibre/maplibre-react-native/commit/8c0abaa7c61ee38720897047236d98344c23ebce))
* make `setAccessToken(null)` obsolete ([#593](https://github.com/maplibre/maplibre-react-native/issues/593)) ([df44b48](https://github.com/maplibre/maplibre-react-native/commit/df44b48dea0fadfd549b801dccd61110e9193046))
* make Camera pure ([#471](https://github.com/maplibre/maplibre-react-native/issues/471)) ([23ecf88](https://github.com/maplibre/maplibre-react-native/commit/23ecf8884aeac5c2137a90b280ad5f83abd18e31))
* MapLibre Android SDK 11.5.0 ([#455](https://github.com/maplibre/maplibre-react-native/issues/455)) ([042b759](https://github.com/maplibre/maplibre-react-native/commit/042b75983e8377d2bef844d03ccd0080bbf7e539))
* monorepo configuration ([343e7ac](https://github.com/maplibre/maplibre-react-native/commit/343e7accc963053b68c053298f6c68ababf9db07))
* mv example packages/react-native-app ([5c9d3d0](https://github.com/maplibre/maplibre-react-native/commit/5c9d3d01b8eeb93adfae3ea9e565bb9e20b09421))
* mv examples, styles, assets, utils and scenes to packages/examples ([13600fe](https://github.com/maplibre/maplibre-react-native/commit/13600feb2aca29375357b07378cb70cf56fa71b3))
* packages/expo-app ([c01abd5](https://github.com/maplibre/maplibre-react-native/commit/c01abd589f245999ce13fe2095d168e81f830981))
* remove deprecations ([#543](https://github.com/maplibre/maplibre-react-native/issues/543)) ([0c41ada](https://github.com/maplibre/maplibre-react-native/commit/0c41adac7f75b695c3edaabe50f5cef808af268b))
* remove duplicate of `OfflinePackStatus` type ([#542](https://github.com/maplibre/maplibre-react-native/issues/542)) ([9e231b7](https://github.com/maplibre/maplibre-react-native/commit/9e231b79ed5f8d7c03189cd7e2264fb0a2dcf1c9))
* remove Style component ([#547](https://github.com/maplibre/maplibre-react-native/issues/547)) ([9d4c458](https://github.com/maplibre/maplibre-react-native/commit/9d4c458b26a1ace046e8da0e3b974233cec946b2))
* remove style property enums ([#558](https://github.com/maplibre/maplibre-react-native/issues/558)) ([b89a0dd](https://github.com/maplibre/maplibre-react-native/commit/b89a0ddb29a3192c15a4ad0792710150128718ac))
* setup build step ([#504](https://github.com/maplibre/maplibre-react-native/issues/504)) ([a017d64](https://github.com/maplibre/maplibre-react-native/commit/a017d641444aec1ebb2474ed96f82dee9f589774))
* shared dependencies through packages/examples ([01a9586](https://github.com/maplibre/maplibre-react-native/commit/01a95864d32c7156248ed184975abc48b0f5b2f9))
* support new arch through interop layer ([#483](https://github.com/maplibre/maplibre-react-native/issues/483)) ([951e9cf](https://github.com/maplibre/maplibre-react-native/commit/951e9cfe3baea29053b39c14a8598065140d666c))
* unify `MapView`s `styleURL` and `styleJSON` to `mapStyle` ([#559](https://github.com/maplibre/maplibre-react-native/issues/559)) ([7d22f16](https://github.com/maplibre/maplibre-react-native/commit/7d22f169de2ee8d713fb45e0cb0f8fc8918681f1))
* update maplibre native version ([#61](https://github.com/maplibre/maplibre-react-native/issues/61)) ([25c418a](https://github.com/maplibre/maplibre-react-native/commit/25c418a612c731e43f432d7e7b0650e88b57a411))
* upgrade turf to v7 and remove geo utils ([#478](https://github.com/maplibre/maplibre-react-native/issues/478)) ([a45fc55](https://github.com/maplibre/maplibre-react-native/commit/a45fc558cd49cc28ced40a572851be7136419359))
* upgrade Android gradle setup ([#539](https://github.com/maplibre/maplibre-react-native/issues/539)) ([761ae0d](https://github.com/maplibre/maplibre-react-native/commit/761ae0d527169eef663bb61222847e7110fc2221))
* upgrade dependencies ([#535](https://github.com/maplibre/maplibre-react-native/issues/535)) ([047f87f](https://github.com/maplibre/maplibre-react-native/commit/047f87f7ba2fc02f73a1b2e5a7793b8ed000ed77))
* upgrade MapLibre Native ([#563](https://github.com/maplibre/maplibre-react-native/issues/563)) ([d2b7f5d](https://github.com/maplibre/maplibre-react-native/commit/d2b7f5d39728466e8e1d72c1ea4eb7387929d878))
* upgrade MapLibre Native Android to v11.8.0 ([#597](https://github.com/maplibre/maplibre-react-native/issues/597)) ([410d0c3](https://github.com/maplibre/maplibre-react-native/commit/410d0c395e195bfaf3d17a1c9f3eedeeffaf503f))
* upgrade MapLibre Native iOS to v6.10.0 ([#598](https://github.com/maplibre/maplibre-react-native/issues/598)) ([b596c76](https://github.com/maplibre/maplibre-react-native/commit/b596c76c58f1c11bc4eda571c87f2743e462ad8c))
* use `withPodfile` instead of `withDangerousMod` in Expo Plugin ([#587](https://github.com/maplibre/maplibre-react-native/issues/587)) ([56d02e1](https://github.com/maplibre/maplibre-react-native/commit/56d02e12cbba401fec8896ab1f96db48bb3bc1d2))


### BREAKING CHANGES

* remove `styleURL` and `styleJSON` from `MapView`, use `mapStyle` instead
* remove style property enums
* remove `Style` component, use `styleJSON` of `MapView` instead
* deprecate `UserTrackingModes` is removed in favor of `UserTrackingMode`
* remove deprecated `setCamera` from `MapView`
* remove deprecated `byId` methods from `ShapeSource`
* remove deprecated `children` from `SymbolSource`
* remove deprecated `assets` key from `Images`
* remove deprecated event keys
* replace `OfflineProgressStatus` with `OfflinePackStatus`
* upgrade native packages and migrate components
* changes to `Camera` component
  * Remove `allowUpdates` prop
  * Remove `triggerKey` prop
  * Set default `animationMode` for controlled `Camera` to `CameraMode.None`

# [10.0.0-beta.21](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.20...v10.0.0-beta.21) (2025-01-13)


### Bug Fixes

* `VectorSource` `onPress` returning null geometry on Android ([a130786](https://github.com/maplibre/maplibre-react-native/commit/a130786d8b036d1f9700774fba031f408364194e)), closes [#538](https://github.com/maplibre/maplibre-react-native/issues/538)

# [10.0.0-beta.20](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.19...v10.0.0-beta.20) (2025-01-12)


### Bug Fixes

* types of `getPointInView` and `getCoordinateFromView` ([#601](https://github.com/maplibre/maplibre-react-native/issues/601)) ([c7537b5](https://github.com/maplibre/maplibre-react-native/commit/c7537b505f99830fa16648e3002eb838e4a60f49))

# [10.0.0-beta.19](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.18...v10.0.0-beta.19) (2025-01-10)


### Features

* add Expo plugin props ([#589](https://github.com/maplibre/maplibre-react-native/issues/589)) ([51fbb00](https://github.com/maplibre/maplibre-react-native/commit/51fbb003dfd70bb119814b44fa588c9dfa387993))
* upgrade MapLibre Native Android to v11.8.0 ([#597](https://github.com/maplibre/maplibre-react-native/issues/597)) ([410d0c3](https://github.com/maplibre/maplibre-react-native/commit/410d0c395e195bfaf3d17a1c9f3eedeeffaf503f))
* upgrade MapLibre Native iOS to v6.10.0 ([#598](https://github.com/maplibre/maplibre-react-native/issues/598)) ([b596c76](https://github.com/maplibre/maplibre-react-native/commit/b596c76c58f1c11bc4eda571c87f2743e462ad8c))

# [10.0.0-beta.18](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.17...v10.0.0-beta.18) (2025-01-06)


### Features

* make `setAccessToken(null)` obsolete ([#593](https://github.com/maplibre/maplibre-react-native/issues/593)) ([df44b48](https://github.com/maplibre/maplibre-react-native/commit/df44b48dea0fadfd549b801dccd61110e9193046))

# [10.0.0-beta.17](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.16...v10.0.0-beta.17) (2025-01-03)


### Features

* allow using google location engine on Android ([#586](https://github.com/maplibre/maplibre-react-native/issues/586)) ([92ffdb7](https://github.com/maplibre/maplibre-react-native/commit/92ffdb71d5e734e7e8067482d3aaf459ef67f72f))

# [10.0.0-beta.16](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.15...v10.0.0-beta.16) (2025-01-03)


### Features

* use `withPodfile` instead of `withDangerousMod` in Expo Plugin ([#587](https://github.com/maplibre/maplibre-react-native/issues/587)) ([56d02e1](https://github.com/maplibre/maplibre-react-native/commit/56d02e12cbba401fec8896ab1f96db48bb3bc1d2))

# [10.0.0-beta.15](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.14...v10.0.0-beta.15) (2024-12-27)


### Bug Fixes

* added GeometryCollection to GeoJSONUtils ([#556](https://github.com/maplibre/maplibre-react-native/issues/556)) ([e6b7a66](https://github.com/maplibre/maplibre-react-native/commit/e6b7a6643e31aeba63976131edf3ef1992eabd2a))

# [10.0.0-beta.14](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.13...v10.0.0-beta.14) (2024-12-27)


### Bug Fixes

* make `follow` props on `Camera` deterministic ([#550](https://github.com/maplibre/maplibre-react-native/issues/550)) ([e9256e7](https://github.com/maplibre/maplibre-react-native/commit/e9256e737c3ae4051d5d67f6baa89a02119520d2))

# [10.0.0-beta.13](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.12...v10.0.0-beta.13) (2024-12-23)


### Features

* drop `MapLibreGL` naming and deprecate `export default` ([#567](https://github.com/maplibre/maplibre-react-native/issues/567)) ([aa0c73d](https://github.com/maplibre/maplibre-react-native/commit/aa0c73d6af51ec782ac2051ed4f6a51b812e4a8f))

# [10.0.0-beta.12](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.11...v10.0.0-beta.12) (2024-12-23)


### Features

* upgrade MapLibre Native ([#563](https://github.com/maplibre/maplibre-react-native/issues/563)) ([d2b7f5d](https://github.com/maplibre/maplibre-react-native/commit/d2b7f5d39728466e8e1d72c1ea4eb7387929d878))

# [10.0.0-beta.11](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.10...v10.0.0-beta.11) (2024-12-17)


### Features

* unify `MapView`s `styleURL` and `styleJSON` to `mapStyle` ([#559](https://github.com/maplibre/maplibre-react-native/issues/559)) ([7d22f16](https://github.com/maplibre/maplibre-react-native/commit/7d22f169de2ee8d713fb45e0cb0f8fc8918681f1))


### BREAKING CHANGES

* remove `styleURL` and `styleJSON` from `MapView`, use `mapStyle` instead

# [10.0.0-beta.10](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.9...v10.0.0-beta.10) (2024-12-17)


### Features

* remove style property enums ([#558](https://github.com/maplibre/maplibre-react-native/issues/558)) ([b89a0dd](https://github.com/maplibre/maplibre-react-native/commit/b89a0ddb29a3192c15a4ad0792710150128718ac))


### BREAKING CHANGES

* Removed style property enums

# [10.0.0-beta.9](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.8...v10.0.0-beta.9) (2024-12-15)


### Bug Fixes

* `VectorSource` `onPress` returning null geometry on Android ([250ee6f](https://github.com/maplibre/maplibre-react-native/commit/250ee6f79519b611831a39944fe2270124812bc8)), closes [#538](https://github.com/maplibre/maplibre-react-native/issues/538)

# [10.0.0-beta.8](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.7...v10.0.0-beta.8) (2024-12-10)


### Bug Fixes

* export custom header methods ([#552](https://github.com/maplibre/maplibre-react-native/issues/552)) ([58abdb0](https://github.com/maplibre/maplibre-react-native/commit/58abdb0a854e1e17e5dbb15e950e790579ee1716)), closes [#551](https://github.com/maplibre/maplibre-react-native/issues/551)

# [10.0.0-beta.7](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.6...v10.0.0-beta.7) (2024-12-09)


### Features

* remove Style component ([#547](https://github.com/maplibre/maplibre-react-native/issues/547)) ([9d4c458](https://github.com/maplibre/maplibre-react-native/commit/9d4c458b26a1ace046e8da0e3b974233cec946b2))


### BREAKING CHANGES

* Remove `Style` component, use `styleJSON` of `MapView` instead

# [10.0.0-beta.6](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.3...v10.0.0-beta.6) (2024-12-09)


### Features

* upgrade Android gradle setup ([#539](https://github.com/maplibre/maplibre-react-native/issues/539)) ([761ae0d](https://github.com/maplibre/maplibre-react-native/commit/761ae0d527169eef663bb61222847e7110fc2221))
* remove deprecations ([#543](https://github.com/maplibre/maplibre-react-native/issues/543)) ([0c41ada](https://github.com/maplibre/maplibre-react-native/commit/0c41adac7f75b695c3edaabe50f5cef808af268b))


### BREAKING CHANGES

- deprecated `UserTrackingModes` is removed in favor of `UserTrackingMode`
- removed deprecated `setCamera` from `MapView`
- removed deprecated `byId` methods from `ShapeSource`
- removed deprecated `children` from `SymbolSource`
- removed deprecated `assets` key from `Images`
- removed deprecated event keys

# [10.0.0-beta.3](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.2...v10.0.0-beta.3) (2024-12-08)


### Features

* export `RegionPayload` and `MapLibreRNEvent` types ([#544](https://github.com/maplibre/maplibre-react-native/issues/544)) ([b342f1b](https://github.com/maplibre/maplibre-react-native/commit/b342f1b5c82fe3d8bb1a353ebb33c3df26d47532))
* remove duplicate of `OfflinePackStatus` type ([#542](https://github.com/maplibre/maplibre-react-native/issues/542)) ([9e231b7](https://github.com/maplibre/maplibre-react-native/commit/9e231b79ed5f8d7c03189cd7e2264fb0a2dcf1c9))


### BREAKING CHANGES

* replace `OfflineProgressStatus` with `OfflinePackStatus`

# [10.0.0-beta.2](https://github.com/maplibre/maplibre-react-native/compare/v10.0.0-beta.1...v10.0.0-beta.2) (2024-12-08)


### Features

* upgrade dependencies ([#535](https://github.com/maplibre/maplibre-react-native/issues/535)) ([047f87f](https://github.com/maplibre/maplibre-react-native/commit/047f87f7ba2fc02f73a1b2e5a7793b8ed000ed77))

# [10.0.0-beta.1](https://github.com/maplibre/maplibre-react-native/compare/v9.1.0...v10.0.0-beta.1) (2024-12-02)


### Bug Fixes

* add @babel/plugin-transform-private-methods for jest ([3a2188f](https://github.com/maplibre/maplibre-react-native/commit/3a2188fba3d0b3c6a20421e6f02a9f7a6a0e924b))
* add generic expo config plugin to remove duplicate signature ([#453](https://github.com/maplibre/maplibre-react-native/issues/453)) ([2671381](https://github.com/maplibre/maplibre-react-native/commit/267138120a15cabd2d3aaf89333d83033e9f8d32))
* allow MapView and Images to have no children ([#521](https://github.com/maplibre/maplibre-react-native/issues/521)) ([1e35bf6](https://github.com/maplibre/maplibre-react-native/commit/1e35bf6a37b8c0b5023c62c2e4fc84c64480cf74))
* allow resetting contentInset with 0 ([#468](https://github.com/maplibre/maplibre-react-native/issues/468)) ([1fe42c6](https://github.com/maplibre/maplibre-react-native/commit/1fe42c6b3880d595d6ec467f07322ad58a0fbf19))
* android example crashing on launch ([#372](https://github.com/maplibre/maplibre-react-native/issues/372)) ([aeef5c3](https://github.com/maplibre/maplibre-react-native/commit/aeef5c3991e6ef78d8a6a227dd15d83c590474e3))
* cleanup yarn setup ([#463](https://github.com/maplibre/maplibre-react-native/issues/463)) ([d9a4d30](https://github.com/maplibre/maplibre-react-native/commit/d9a4d30b16b625860c4567c233f4f5ed870200be))
* corepack enable  on publish workflow ([2d13f33](https://github.com/maplibre/maplibre-react-native/commit/2d13f33788014cec54e9155e1f6d815804b2e3bc))
* correct types in MapView ([#268](https://github.com/maplibre/maplibre-react-native/issues/268)) ([0ea35c4](https://github.com/maplibre/maplibre-react-native/commit/0ea35c4c3d0dd1a395423f322342128b250d8192))
* disable code signing for release builds ([b3cf088](https://github.com/maplibre/maplibre-react-native/commit/b3cf0883443e23ea24746505bf880902930d6475))
* disable library code signing ([22030dd](https://github.com/maplibre/maplibre-react-native/commit/22030dd04519087af0a71b61e985dce71179e6d1))
* empty pbxproj and dwarf-with-dsym plugin config for EAS ([#458](https://github.com/maplibre/maplibre-react-native/issues/458)) ([0d54b46](https://github.com/maplibre/maplibre-react-native/commit/0d54b46da0af354ebaaddba3abe762bb9782a2d9))
* expo-app should load library from workspace:. ([016b44a](https://github.com/maplibre/maplibre-react-native/commit/016b44aa45a3421544f1ebb658ec97628bb90521))
* group dependabot commits by core, dev and example ([#165](https://github.com/maplibre/maplibre-react-native/issues/165)) ([b697978](https://github.com/maplibre/maplibre-react-native/commit/b697978553ee429c04e64ac685465c8355500e04))
* keep ts-ignore for headingIcon in library [#476](https://github.com/maplibre/maplibre-react-native/issues/476) ([#477](https://github.com/maplibre/maplibre-react-native/issues/477)) ([ef62454](https://github.com/maplibre/maplibre-react-native/commit/ef6245431c78bb20be3a3b09dd81d89ceda60d1b))
* make MarkerView props with defaults optional ([#460](https://github.com/maplibre/maplibre-react-native/issues/460)) ([185cf3e](https://github.com/maplibre/maplibre-react-native/commit/185cf3e75fb947634530ef7ee5c2085fd8a2e414))
* plugin for debug simulator ([#164](https://github.com/maplibre/maplibre-react-native/issues/164)) ([06b23d4](https://github.com/maplibre/maplibre-react-native/commit/06b23d48732e093f1eb5056439f3a08d0f2f84fc))
* remove AbortController test mock ([#403](https://github.com/maplibre/maplibre-react-native/issues/403)) ([698b558](https://github.com/maplibre/maplibre-react-native/commit/698b558007d8b4bea3a6198a6417f26eb157053d))
* round compass margins and attribution position to nearest integers [android] ([#294](https://github.com/maplibre/maplibre-react-native/issues/294)) ([c89c842](https://github.com/maplibre/maplibre-react-native/commit/c89c842778cfb91ee3f3424de35515060903f910))
* setMaxAnimationFps on null ([#440](https://github.com/maplibre/maplibre-react-native/issues/440)) ([2884256](https://github.com/maplibre/maplibre-react-native/commit/288425645ce979a0526a69e1f386a5d6dc68a764))
* style expressions ([#466](https://github.com/maplibre/maplibre-react-native/issues/466)) ([2202908](https://github.com/maplibre/maplibre-react-native/commit/2202908e01474f64e704604c89ecd475d3844b30))
* updated Mapbox callstack check for iOS custom headers to check for MapLibre instead ([#461](https://github.com/maplibre/maplibre-react-native/issues/461)) ([a6d6216](https://github.com/maplibre/maplibre-react-native/commit/a6d6216f3dd3b368dfed01a42a3e657f64c1f832))
* use UIManager exported from react-native ([#511](https://github.com/maplibre/maplibre-react-native/issues/511)) ([a4030b5](https://github.com/maplibre/maplibre-react-native/commit/a4030b5906d47d12df74d02088fb12ee1f2380c1))
* yarn implementation ([#419](https://github.com/maplibre/maplibre-react-native/issues/419)) ([39233b1](https://github.com/maplibre/maplibre-react-native/commit/39233b13a2b671f01cb0e903806544655cadee08))


### Continuous Integration

* add semantic release ([#526](https://github.com/maplibre/maplibre-react-native/issues/526)) ([069b6c5](https://github.com/maplibre/maplibre-react-native/commit/069b6c564aa92b0c4019a714142c104190b838ed))


### Features

* align react and react-native versions for development ([b92abfe](https://github.com/maplibre/maplibre-react-native/commit/b92abfe3e505368f5c39632ee32a0ed352d6706d))
* configure packages/examples ([c4510c3](https://github.com/maplibre/maplibre-react-native/commit/c4510c3be600fddc21f5044834c7f2f7b652c246))
* extract android UserLocation FPS ([#428](https://github.com/maplibre/maplibre-react-native/issues/428)) ([8c0abaa](https://github.com/maplibre/maplibre-react-native/commit/8c0abaa7c61ee38720897047236d98344c23ebce))
* make Camera pure ([#471](https://github.com/maplibre/maplibre-react-native/issues/471)) ([23ecf88](https://github.com/maplibre/maplibre-react-native/commit/23ecf8884aeac5c2137a90b280ad5f83abd18e31))
* MapLibre Android SDK 11.5.0 ([#455](https://github.com/maplibre/maplibre-react-native/issues/455)) ([042b759](https://github.com/maplibre/maplibre-react-native/commit/042b75983e8377d2bef844d03ccd0080bbf7e539))
* monorepo configuration ([343e7ac](https://github.com/maplibre/maplibre-react-native/commit/343e7accc963053b68c053298f6c68ababf9db07))
* mv example packages/react-native-app ([5c9d3d0](https://github.com/maplibre/maplibre-react-native/commit/5c9d3d01b8eeb93adfae3ea9e565bb9e20b09421))
* mv examples, styles, assets, utils and scenes to packages/examples ([13600fe](https://github.com/maplibre/maplibre-react-native/commit/13600feb2aca29375357b07378cb70cf56fa71b3))
* packages/expo-app ([c01abd5](https://github.com/maplibre/maplibre-react-native/commit/c01abd589f245999ce13fe2095d168e81f830981))
* setup build step ([#504](https://github.com/maplibre/maplibre-react-native/issues/504)) ([a017d64](https://github.com/maplibre/maplibre-react-native/commit/a017d641444aec1ebb2474ed96f82dee9f589774))
* shared dependencies through packages/examples ([01a9586](https://github.com/maplibre/maplibre-react-native/commit/01a95864d32c7156248ed184975abc48b0f5b2f9))
* support new arch through interop layer ([#483](https://github.com/maplibre/maplibre-react-native/issues/483)) ([951e9cf](https://github.com/maplibre/maplibre-react-native/commit/951e9cfe3baea29053b39c14a8598065140d666c))
* update maplibre native version ([#61](https://github.com/maplibre/maplibre-react-native/issues/61)) ([25c418a](https://github.com/maplibre/maplibre-react-native/commit/25c418a612c731e43f432d7e7b0650e88b57a411))
* upgrade turf to v7 and remove geo utils ([#478](https://github.com/maplibre/maplibre-react-native/issues/478)) ([a45fc55](https://github.com/maplibre/maplibre-react-native/commit/a45fc558cd49cc28ced40a572851be7136419359))


### BREAKING CHANGES

* Upgrade native packages and migrate components
* Changes to `Camera` component
    * Removed `allowUpdates` prop
    * Removed `triggerKey` prop
    * Set default `animationMode` for controlled `Camera` to `CameraMode.None`

# 10.0.0-alpha.29

- ci: fail on lint warning ([#522](https://github.com/maplibre/maplibre-react-native/pull/522))
- fix: allow MapView and Images to have no children ([#521](https://github.com/maplibre/maplibre-react-native/pull/521))
- docs: reformat changelog ([#520](https://github.com/maplibre/maplibre-react-native/pull/520))
- refactor: rename `RCTMLN` to `MLRN` ([#519](https://github.com/maplibre/maplibre-react-native/pull/519))
- ci: improve workflows ([#513](https://github.com/maplibre/maplibre-react-native/pull/513))

# 10.0.0-alpha.28

- feat: setup build step ([#504](https://github.com/maplibre/maplibre-react-native/pull/504))

# 10.0.0-alpha.27

- fix: use UIManager exported from react-native ([#511](https://github.com/maplibre/maplibre-react-native/pull/511))

# 10.0.0-alpha.26

- chore: upgrade Expo SDK 52 ([489](https://github.com/maplibre/maplibre-react-native/pull/489))
- chore: remove pre commit ([#491](https://github.com/maplibre/maplibre-react-native/pull/491))
- docs: improve formatting ([#490](https://github.com/maplibre/maplibre-react-native/pull/490))

# 10.0.0-alpha.25

- feat: make Camera pure ([#471](https://github.com/maplibre/maplibre-react-native/pull/471))
- docs: update scripts to TypeScript ([#484](https://github.com/maplibre/maplibre-react-native/pull/484))

# 10.0.0-alpha.24

- feat: support new arch through interop layer ([#483](https://github.com/maplibre/maplibre-react-native/pull/483))

# 10.0.0-alpha.23

- fix: keep ts-ignore for headingIcon in library ([#477](https://github.com/maplibre/maplibre-react-native/pull/477))
- feat: upgrade turf to v7 and remove geo utils ([#478](https://github.com/maplibre/maplibre-react-native/pull/478))
- docs: improve guides and branding ([#475](https://github.com/maplibre/maplibre-react-native/pull/475))
- chore: improve examples monorepo setup with reusable App ([#474](https://github.com/maplibre/maplibre-react-native/pull/474))
- chore: remove react native elements from examples ([#472](https://github.com/maplibre/maplibre-react-native/pull/472))

# 10.0.0-alpha.22

- chore: configure jest to use with ts ([#470](https://github.com/maplibre/maplibre-react-native/pull/470))
- refactor: switch many examples to TypeScript ([#469](https://github.com/maplibre/maplibre-react-native/pull/469))
- chore: eslint formatting and improve scripts ([#467](https://github.com/maplibre/maplibre-react-native/pull/467))
- fix: allow resetting contentInset with 0 ([#468](https://github.com/maplibre/maplibre-react-native/pull/468))

# 10.0.0-alpha.21

- fix: Call requestProgress when getting pack status on IOS + example improvement ([#445](https://github.com/maplibre/maplibre-react-native/pull/445))

# 10.0.0-alpha.20

- fix: fix style expressions, revert changes to scripts/autogenHelpers/globals.js ([#466](https://github.com/maplibre/maplibre-react-native/pull/466))

# 10.0.0-alpha.19

- feat: MapLibre Android SDK 11.5.0 ([#455](https://github.com/maplibre/maplibre-react-native/pull/455))

# 10.0.0-alpha.18

- fix: make MarkerView props with defaults optional ([#460](https://github.com/maplibre/maplibre-react-native/pull/460))
- fix: updated Mapbox callstack check for iOS custom headers to check for MapLibre instead ([#461](https://github.com/maplibre/maplibre-react-native/pull/461))

# 10.0.0-alpha.17

- fix: add generic expo plugin to remove Duplicated Signature in Xcode 15/16 ([#453](https://github.com/maplibre/maplibre-react-native/pull/453))

# 10.0.0-alpha.16

- fix: another attempt to disable code signing ([#451](https://github.com/maplibre/maplibre-react-native/pull/451))

# 10.0.0-alpha.15

- fix: disable code signing for release builds ([#450](https://github.com/maplibre/maplibre-react-native/pull/450))

# 10.0.0-alpha.14

- fix: disable library code signing ([#447](https://github.com/maplibre/maplibre-react-native/pull/447))
- feat: feat: yarn monorepo ([#441](https://github.com/maplibre/maplibre-react-native/pull/441))

# 10.0.0-alpha.13

- fix: setMaxAnimationFps on null ([#440](https://github.com/maplibre/maplibre-react-native/pull/440))

# 10.0.0-alpha.12

- Specify in install.md the correct SPM variable name to use a different native iOS library version ([#438](https://github.com/maplibre/maplibre-react-native/pull/438))
- Remove deprecated defaultProps for functional component ([#431](https://github.com/maplibre/maplibre-react-native/pull/431))
- feat: extract android UserLocation FPS ([#428](https://github.com/maplibre/maplibre-react-native/pull/428))

# 10.0.0-alpha.11

- chore: bump maplibre native ios to 6.5.4 ([#437](https://github.com/maplibre/maplibre-react-native/pull/437))

# 10.0.0-alpha.10

- fix: move @types/ packages to deps and remove assets.d.ts ([#423](https://github.com/maplibre/maplibre-react-native/pull/423))

# 10.0.0-alpha.9

- fix: yarn, eslint and prettier implementation ([#419](https://github.com/maplibre/maplibre-react-native/pull/419))
- fix: typescript errors and add typescript:check to GitHub Actions ([#418](https://github.com/maplibre/maplibre-react-native/pull/418))

# 10.0.0-alpha.8

- feat: Updated Android SDK from 10.2.0 to 11.0.1 ([#412](https://github.com/maplibre/maplibre-react-native/pull/412))

# 10.0.0-alpha.7

- feat:[Migrate MapView to react function component ([#408](https://github.com/maplibre/maplibre-react-native/pull/408))

# 10.0.0-alpha.6

- fix: cameraRef?.current?.setCamera causing markerpoint get detached from maps-base ([#409](https://github.com/maplibre/maplibre-react-native/issues/409))
- fix: round compass margins and attribution position to nearest integers on android ([#294](https://github.com/maplibre/maplibre-react-native/pull/294))

# 10.0.0-alpha.5

- Fix: remove AbortController test mock ([#403](https://github.com/maplibre/maplibre-react-native/pull/403))
- Fix: ExpoPlugin after Class renaming ([#405](thttps://github.com/maplibre/maplibre-react-native/pull/405))
- Fix: android example crashing on launch ([#372](https://github.com/maplibre/maplibre-react-native/pull/372))

# 10.0.0-alpha.4

- Update maplibre-native to use [new metal renderer on iOS](https://github.com/maplibre/maplibre-native/releases/tag/ios-v6.4.0)

# 10.0.0-alpha.3

- fix: Remove unused import breaking react-native 0.74.0 ([#365](https://github.com/maplibre/maplibre-react-native/pull/365))
- chore: resolve remaining dependabot ([#298](https://github.com/maplibre/maplibre-react-native/pull/298))
- chore: update dev dependencies ([#262](https://github.com/maplibre/maplibre-react-native/pull/262))

# 10.0.0-alpha.2

- fix: Duplicated Signature issue with Xcode 15 ([#238](https://github.com/maplibre/maplibre-react-native/pull/238))
- Update download-style-spec.sh ([#163](https://github.com/maplibre/maplibre-react-native/pull/163))
- Update react-maplibre ([#34](https://github.com/maplibre/maplibre-react-native/issues/34))
- chore: update support libraries ([#121](https://github.com/maplibre/maplibre-react-native/pull/121))
- fix: correct types in MapView ([#268])(https://github.com/maplibre/maplibre-react-native/pull/268))

# 10.0.0-alpha.1

- fix: plugin for debug simulator ([#164](https://github.com/maplibre/maplibre-react-native/pull/164))

# 10.0.0-alpha.0

- chore: update detox ([#207](https://github.com/maplibre/maplibre-react-native/pull/207))
- chore: update expo-config and expo-scripts ([#47](https://github.com/maplibre/maplibre-react-native/pull/104), [#69](https://github.com/maplibre/maplibre-react-native/pull/69))
- chore: update prettier and eslint-plugin-prettier ([#111](https://github.com/maplibre/maplibre-react-native/pull/111))
- feat: **breaking** migrate repo to typescript ([#55](https://github.com/maplibre/maplibre-react-native/pull/55))

# 9.1.0

- Update react to 18.2.0 and react-native to 0.72.1. ([#49](https://github.com/maplibre/maplibre-react-native/pull/49))
- fix(markerview): make PointAnnotationProps component extend ViewProps ([#41](https://github.com/maplibre/maplibre-react-native/issues/41))
- Fix build issue on iOS ([#29](https://github.com/maplibre/maplibre-react-native/issues/29))
- Add clusterProperties to ShapeSource ([#46](https://github.com/maplibre/maplibre-react-native/pull/46))

# 9.0.0

- Completed fork from RNMapbox, removed support for the proprietary Mapbox SDK, and updated to the latest MapLibre GL Native SDKs for iOS and Android.
- Breaking changes: Mapbox-specific names have been renamed to MapLibre.
