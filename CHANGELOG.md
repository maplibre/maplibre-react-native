## UNRELEASED

```
Please add unreleased changes in the following style:
- PR Title ([#___](https://github.com/maplibre/maplibre-react-native/pull/___))
```

## 10.0.0-alpha.29

- ci: fail on lint warning ([#522](https://github.com/maplibre/maplibre-react-native/pull/522))
- fix: allow MapView and Images to have no children ([#521](https://github.com/maplibre/maplibre-react-native/pull/521))
- docs: reformat changelog ([#520](https://github.com/maplibre/maplibre-react-native/pull/520))
- refactor: rename `RCTMLN` to `MLRN` ([#519](https://github.com/maplibre/maplibre-react-native/pull/519))
- ci: improve workflows ([#513](https://github.com/maplibre/maplibre-react-native/pull/513))

## 10.0.0-alpha.28

- feat: setup build step ([#504](https://github.com/maplibre/maplibre-react-native/pull/504))

## 10.0.0-alpha.27

- fix: use UIManager exported from react-native ([#511](https://github.com/maplibre/maplibre-react-native/pull/511))

## 10.0.0-alpha.26

- chore: upgrade Expo SDK 52 ([489](https://github.com/maplibre/maplibre-react-native/pull/489))
- chore: remove pre commit ([#491](https://github.com/maplibre/maplibre-react-native/pull/491))
- docs: improve formatting ([#490](https://github.com/maplibre/maplibre-react-native/pull/490))

## 10.0.0-alpha.25

- feat: make Camera pure ([#471](https://github.com/maplibre/maplibre-react-native/pull/471))
- docs: update scripts to TypeScript ([#484](https://github.com/maplibre/maplibre-react-native/pull/484))

## 10.0.0-alpha.24

- feat: support new arch through interop layer ([#483](https://github.com/maplibre/maplibre-react-native/pull/483))

## 10.0.0-alpha.23

- fix: keep @ts-ignore for headingIcon in library ([#477](https://github.com/maplibre/maplibre-react-native/pull/477))
- feat: upgrade @turf to v7 and remove geo utils ([#478](https://github.com/maplibre/maplibre-react-native/pull/478))
- docs: improve guides and branding ([#475](https://github.com/maplibre/maplibre-react-native/pull/475))
- chore: improve examples monorepo setup with reusable App ([#474](https://github.com/maplibre/maplibre-react-native/pull/474))
- chore: remove react native elements from examples ([#472](https://github.com/maplibre/maplibre-react-native/pull/472))

## 10.0.0-alpha.22

- chore: configure jest to use with ts ([#470](https://github.com/maplibre/maplibre-react-native/pull/470))
- refactor: switch many examples to TypeScript ([#469](https://github.com/maplibre/maplibre-react-native/pull/469))
- chore: eslint formatting and improve scripts ([#467](https://github.com/maplibre/maplibre-react-native/pull/467))
- fix: allow resetting contentInset with 0 ([#468](https://github.com/maplibre/maplibre-react-native/pull/468))

## 10.0.0-alpha.21

- fix: Call requestProgress when getting pack status on IOS + example improvement ([#445](https://github.com/maplibre/maplibre-react-native/pull/445))

## 10.0.0-alpha.20

- fix: fix style expressions, revert changes to scripts/autogenHelpers/globals.js ([#466](https://github.com/maplibre/maplibre-react-native/pull/466))

## 10.0.0-alpha.19

- feat: MapLibre Android SDK 11.5.0 ([#455](https://github.com/maplibre/maplibre-react-native/pull/455))

## 10.0.0-alpha.18

- fix: make MarkerView props with defaults optional ([#460](https://github.com/maplibre/maplibre-react-native/pull/460))
- fix: updated Mapbox callstack check for iOS custom headers to check for MapLibre instead ([#461](https://github.com/maplibre/maplibre-react-native/pull/461))

## 10.0.0-alpha.17

- fix: add generic expo plugin to remove Duplicated Signature in Xcode 15/16 ([#453](https://github.com/maplibre/maplibre-react-native/pull/453))

## 10.0.0-alpha.16

- fix: another attempt to disable code signing ([#451](https://github.com/maplibre/maplibre-react-native/pull/451))

## 10.0.0-alpha.15

- fix: disable code signing for release builds ([#450](https://github.com/maplibre/maplibre-react-native/pull/450))

## 10.0.0-alpha.14

- fix: disable library code signing ([#447](https://github.com/maplibre/maplibre-react-native/pull/447))
- feat: feat: yarn monorepo ([#441](https://github.com/maplibre/maplibre-react-native/pull/441))

## 10.0.0-alpha.13

- fix: setMaxAnimationFps on null ([#440](https://github.com/maplibre/maplibre-react-native/pull/440))

## 10.0.0-alpha.12

- Specify in install.md the correct SPM variable name to use a different native iOS library version ([#438](https://github.com/maplibre/maplibre-react-native/pull/438))
- Remove deprecated defaultProps for functional component ([#431](https://github.com/maplibre/maplibre-react-native/pull/431))
- feat: extract android UserLocation FPS ([#428](https://github.com/maplibre/maplibre-react-native/pull/428))

## 10.0.0-alpha.11

- chore: bump maplibre native ios to 6.5.4 ([#437](https://github.com/maplibre/maplibre-react-native/pull/437))

## 10.0.0-alpha.10

- fix: move @types/ packages to deps and remove assets.d.ts ([#423](https://github.com/maplibre/maplibre-react-native/pull/423))

## 10.0.0-alpha.9

- fix: yarn, eslint and prettier implementation ([#419](https://github.com/maplibre/maplibre-react-native/pull/419))
- fix: typescript errors and add typescript:check to GitHub Actions ([#418](https://github.com/maplibre/maplibre-react-native/pull/418))

## 10.0.0-alpha.8

- feat: Updated Android SDK from 10.2.0 to 11.0.1 ([#412](https://github.com/maplibre/maplibre-react-native/pull/412))

## 10.0.0-alpha.7

- feat:[Migrate MapView to react function component ([#408](https://github.com/maplibre/maplibre-react-native/pull/408))

## 10.0.0-alpha.6

- fix: cameraRef?.current?.setCamera causing markerpoint get detached from maps-base ([#409](https://github.com/maplibre/maplibre-react-native/issues/409))
- fix: round compass margins and attribution position to nearest integers on android ([#294](https://github.com/maplibre/maplibre-react-native/pull/294))

## 10.0.0-alpha.5

- Fix: remove AbortController test mock ([#403](https://github.com/maplibre/maplibre-react-native/pull/403))
- Fix: ExpoPlugin after Class renaming ([#405](thttps://github.com/maplibre/maplibre-react-native/pull/405))
- Fix: android example crashing on launch ([#372](https://github.com/maplibre/maplibre-react-native/pull/372))

## 10.0.0-alpha.4

- Update maplibre-native to use [new metal renderer on iOS](https://github.com/maplibre/maplibre-native/releases/tag/ios-v6.4.0)

## 10.0.0-alpha.3

- fix: Remove unused import breaking react-native 0.74.0 ([#365](https://github.com/maplibre/maplibre-react-native/pull/365))
- chore: resolve remaining dependabot ([#298](https://github.com/maplibre/maplibre-react-native/pull/298))
- chore: update dev dependencies ([#262](https://github.com/maplibre/maplibre-react-native/pull/262))

## 10.0.0-alpha.2

- fix: Duplicated Signature issue with Xcode 15 ([#238](https://github.com/maplibre/maplibre-react-native/pull/238))
- Update download-style-spec.sh ([#163](https://github.com/maplibre/maplibre-react-native/pull/163))
- Update react-maplibre ([#34](https://github.com/maplibre/maplibre-react-native/issues/34))
- chore: update support libraries ([#121](https://github.com/maplibre/maplibre-react-native/pull/121))
- fix: correct types in MapView ([#268])(https://github.com/maplibre/maplibre-react-native/pull/268))

## 10.0.0-alpha.1

- fix: plugin for debug simulator ([#164](https://github.com/maplibre/maplibre-react-native/pull/164))

## 10.0-alpha.0

- chore: update detox ([#207](https://github.com/maplibre/maplibre-react-native/pull/207))
- chore: update expo-config and expo-scripts ([#47](https://github.com/maplibre/maplibre-react-native/pull/104), [#69](https://github.com/maplibre/maplibre-react-native/pull/69))
- chore: update prettier and eslint-plugin-prettier ([#111](https://github.com/maplibre/maplibre-react-native/pull/111))
- feat: **breaking** migrate repo to typescript ([#55](https://github.com/maplibre/maplibre-react-native/pull/55))

## 9.1.0

- Update react to 18.2.0 and react-native to 0.72.1. ([#49](https://github.com/maplibre/maplibre-react-native/pull/49))
- fix(markerview): make PointAnnotationProps component extend ViewProps ([#41](https://github.com/maplibre/maplibre-react-native/issues/41))
- Fix build issue on iOS ([#29](https://github.com/maplibre/maplibre-react-native/issues/29))
- Add clusterProperties to ShapeSource ([#46](https://github.com/maplibre/maplibre-react-native/pull/46))

## 9.0.0

- Completed fork from RNMapbox, removed support for the proprietary Mapbox SDK, and updated to the latest MapLibre GL Native SDKs for iOS and Android.
- Breaking changes: Mapbox-specific names have been renamed to MapLibre.
