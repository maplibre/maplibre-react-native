# Agent Guide for MapLibre React Native

## What This Library Does

MapLibre React Native provides React Native bindings to MapLibre Native rendering engines for Android & iOS. It wraps native MapView components, camera controls, data sources, and style layers as React components, bridging JavaScript props to native view properties through React Native's new architecture (Fabric + TurboModules).

**Key Facts**:

- **Current version v11**: Only supports React Native's new architecture (Fabric/TurboModules)
- **Native SDKs**: MapLibre Native iOS v6 ([`package/MapLibreReactNative.podspec`](package/MapLibreReactNative.podspec)), Android v12 ([`package/android/gradle.properties`](package/android/gradle.properties))
- **Runtime**: React Native >=0.80, Node v24 ([`.nvmrc`](.nvmrc)), Yarn 4 (corepack)
- **Languages**: TypeScript (shared), Objective-C (iOS), Kotlin (Android)

## Library Architecture

### Component Structure

- **Map**: Root map container, wraps native MapLibre view via Fabric codegen (`MapViewNativeComponent.ts`)
- **Camera**: Controls viewport (zoom, bearing, pitch, center), uses imperative ref API
- **Sources**: Data providers (GeoJSONSource, VectorSource, RasterSource, ImageSource) - children of Map
- **Layers**: Visual representation (FillLayer, LineLayer, SymbolLayer, etc.) - children of Sources
- **Annotations**: User interaction elements (ViewAnnotation, LayerAnnotation, Marker, Callout)
- **Modules**: Native modules for offline, location, logging, snapshots

### Key Patterns

1. **Fabric Components**: Components using new arch have `*NativeComponent.ts` files with `codegenNativeComponent`
2. **Turbo Modules**: Modules using new arch have `Native*Module.ts` files with `TurboModuleRegistry.getEnforcing`
3. **Accompanied Modules for Components**: Components like `Map` have `MapViewModule` for imperative methods
4. **Style Transformation**: Props → native format via `transformStyle()` in `utils/StyleValue`
5. **Children as Config**: Sources contain Layers, Layers inherit sourceID from parent
6. **Ref-based Imperative API**: Map, Camera, GeoJSONSource expose methods via `useImperativeHandle`

### Codegen System

`scripts/codegen.ts` generates from MapLibre style spec + TSDoc comments:

- **Native style classes**: iOS `.h/.m`, Android `.java` in `components/layers/style/`
- **TypeScript types**: `src/types/MapLibreRNStyles.ts` (layer styles, expressions)
- **Documentation**: `/docs/content/components/` and `/docs/content/modules/`

**NEVER edit generated files** - they have header comments indicating source.

## Code Style & Conventions

### TypeScript

- **Strict mode enabled** (`tsconfig.json`) - no implicit any, unused vars, etc.
- **Export pattern**: Named exports only, barrel exports in `index.ts`
- **Props**: Use `interface` with `Props` suffix (e.g., `MapProps`, `CameraProps`)
- **Types**: Use `type` for unions/mapped types, `interface` for object shapes
- **Ref types**: Pattern: `ComponentRef` (e.g., `MapRef`, `CameraRef`)
- **Native props**: Separate `NativeProps` interface for codegen-compatible types
- **Null safety**: Always check `useRef` values before use, use optional chaining

### Naming Conventions

- **Native modules**: `MLRN` prefix (e.g., `MLRNMapView`, `MLRNCamera`)
- **Files**: PascalCase for components, camelCase for utils/hooks
- **Props**: Descriptive, follows MapLibre terminology (e.g., `bearing`, `pitch`)
- **Events**: `on` prefix (e.g., `onPress`)

### Testing

- Mock native modules in [`package/src/__tests__/__mocks__`](package/src/__tests__/__mocks__)
- Use React Native Testing Library patterns
- Test component prop handling, not native behavior
- E2E tests in Maestro verify native integration

### Path Aliases

**In Jest Tests** ([`package/src/__tests__/`](package/src/__tests__/)):

- `@maplibre/maplibre-react-native`: Public exports
- `@/*`: Internal exports
- Configured in `jest.config.ts`

**In Example Apps** (`examples/shared/`):

- `@/*`: References `examples/shared/src/*`
- Configured in `tsconfig.json`, `metro.shared.js`, and `babel.shared.js`

## When to Edit Which Files

### Adding a New Component

1. Create component in `src/components/` (e.g., `MyComponent.tsx`)
2. If using Fabric: Create `MyComponentNativeComponent.ts` with `codegenNativeComponent`
3. Add exports to `src/index.ts`
4. Add TSDoc comments (triggers codegen for docs)
5. Create native implementations:
   - iOS: ViewManager in `ios/components/`
   - Android: ViewManager in `android/src/main/java/org/maplibre/reactnative/components/`
6. Add unit tests in `src/__tests__/`
7. Add example scene in `examples/shared/src/examples/`

### Modifying Layer/Source Styles

1. **DON'T** edit generated files in `src/types/MapLibreRNStyles.ts` or native style classes
2. **DO** edit templates in `scripts/templates/` if changing codegen logic
3. Run `yarn codegen` to regenerate
4. Run `yarn prepack` to rebuild types

### Changing Native Behavior

- **iOS**: Edit files in `ios/components/` or `ios/modules/`
- **Android**: Edit files in `android/src/main/java/org/maplibre/reactnative/`
- Rebuild native apps to test changes
- Consider if changes affect public API (requires TypeScript type updates)

### Updating Documentation

- **Component/Module docs**: Edit TSDoc comments in source files, run `yarn codegen`
- **Guide docs**: Edit markdown files in `docs/content/`
- **README**: Edit `README.md` or `CONTRIBUTING.md` directly

## Setup Requirements

**Prerequisites**: Node 24 (`.nvmrc`), corepack-enabled yarn 4, Java 21, Android SDK (API 35)

**Initial setup**:

```bash
corepack enable
yarn install  # Always from root - installs all workspaces
```

**iOS only**: macOS, Xcode, CocoaPods (via bundler)

## Build & Validation

```bash
yarn lint           # All linters for TypeScript code (required before commit, when .ts or .tsx files changed)
yarn lint:tsc       # TypeScript (lib + examples + docs)
yarn lint:eslint    # ESLint (0 warnings required)
yarn test           # Jest unit tests
yarn codegen        # Generate native bindings + docs from source
yarn prepack        # Build library to /lib/
```

**Critical**: Never edit generated files (they have header comments). Edit source, then `yarn codegen`.

## Development Workflow

Example apps use source files directly - TypeScript changes hot reload, native changes need rebuild.

**React Native App** (preferred):

```bash
yarn examples:react-native ios:pod-install  # iOS only, first time or Podfile changes
yarn examples:react-native start            # Metro bundler
yarn examples:react-native android          # Build/run Android
yarn examples:react-native ios              # Build/run iOS
yarn examples:react-native purge            # Clean build artifacts
```

**Expo App**:

```bash
yarn examples:expo android/ios/start
yarn examples:expo purge
```

**Native code changes**: Rebuild via IDE (Xcode/Android Studio) or CLI commands above.

## IDE Setup

**TypeScript**: Open repo root in VSCode/WebStorm (configure yarn 4 editor SDKs)  
**Android**: Open `/examples/react-native-app/android` in Android Studio (library = `mlrn` module)  
**iOS**: Open `/examples/react-native-app/ios/MapLibreReactNativeExample.xcworkspace` in Xcode (library under `Pods > Development Pods`)

## E2E Testing (Maestro)

Located in `/examples/react-native-app/e2e/`. Tests run in CI on every PR.

### Local E2E Testing

```bash
# Build and run the React Native example app on emulator/simulator
yarn examples:react-native android  # or ios

# Run tests
maestro test ./examples/react-native-app/e2e/tests
```

- Tests produce JUnit XML reports at `examples/react-native-app/report.xml`

## Project Structure

```
/
├── src/                          # Main TypeScript source
│   ├── index.ts                  # Main library export
│   ├── components/               # React components (Map, Camera, etc.)
│   ├── modules/                  # Native modules
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   ├── plugin/                   # Expo config plugin
│   └── __tests__/                # Jest unit tests
├── android/                      # Android native code
│   ├── src/main/java/org/maplibre/reactnative/
│   ├── build.gradle              # Android build config
│   └── gradle.properties         # Native version config
├── ios/                          # iOS native code
│   ├── components/               # Native view managers
│   ├── modules/                  # Native modules
│   └── utils/                    # Objective-C utilities
├── scripts/                      # Build and codegen scripts
│   ├── codegen.ts               # Main codegen script
│   └── templates/               # EJS templates for codegen
├── examples/
│   ├── shared/                  # Shared example scenes
│   ├── react-native-app/        # RN example (new arch)
│   │   ├── android/
│   │   ├── ios/
│   │   └── e2e/                 # Maestro E2E tests
│   └── expo-app/                # Expo example
├── docs/                         # Docusaurus documentation site
├── .github/
│   ├── workflows/               # CI/CD pipelines
│   │   ├── review.yml          # Main PR checks
│   │   ├── release.yml         # Semantic release
│   │   ├── review-android.yml  # Android build & test
│   │   └── review-ios.yml      # iOS build & test
│   └── actions/setup/          # Shared setup action
├── package.json                 # Main package config
├── tsconfig.json               # TypeScript config (strict mode)
├── tsconfig.build.json         # Build-specific TS config
├── jest.config.ts              # Jest test config
├── .eslintrc.js                # ESLint config (universe/native)
├── babel.config.js             # Babel config
├── MapLibreReactNative.podspec # iOS podspec
└── .nvmrc                      # Node version (24.11.0)
```

## CI/CD Pipeline

### PR Checks (`.github/workflows/review.yml`)

All checks must pass before merge:

1. **lint-tsc**: TypeScript type checking (`yarn lint:tsc`)
2. **lint-eslint**: ESLint with 0 warnings (`yarn lint:eslint`)
3. **test**: Jest unit tests (`yarn test`)
4. **codegen**: Verify codegen runs without changes (`yarn codegen`)
5. **build-library**: Build library package (`yarn prepack`)
6. **review-android**: Build Android app + Maestro E2E tests
7. **review-ios**: Build iOS app + Maestro E2E tests

### Release Process (`.github/workflows/release.yml`)

- Uses semantic-release based on conventional commits
- Runs on push to `main`, `beta`, or `alpha` branches
- Automatically updates CHANGELOG.md, package version, and publishes to npm
- **IMPORTANT**: PR titles must follow [Conventional Commits](https://www.conventionalcommits.org/) format

## Common Issues and Workarounds

### "Types not found" or stale types after codegen

**Solution**: Always run `yarn prepack` after `yarn codegen` to rebuild type declarations.

### iOS build fails with missing pods

**Solution**:

```bash
yarn examples:react-native purge:ios
yarn install
yarn examples:react-native ios
```

### Android build fails with Gradle errors

**Solution**:

```bash
yarn examples:react-native purge:android
yarn install
yarn examples:react-native android
```

### Metro bundler caching issues

**Solution**:

```bash
yarn examples:react-native purge:js
yarn install
yarn examples:react-native start --reset-cache
```

### Changes not reflected in example app

- **TypeScript changes**: Should hot reload automatically
- **Native changes**: Rebuild the native app
- **Dependency changes**: Run `yarn install` and rebuild

## Best Practices for Contributing

1. **Use conventional commits**: PR titles and commits must follow format (feat:, fix:, chore:, etc.)
2. **Always run TypeScript linters before committing, when `.ts` or `.tsx` files changed**: `yarn lint`
3. **Add tests for new features**: Unit tests in `/src/__tests__/`
4. **Add example scenes**: Demonstrate features in `/examples/shared/src/examples/`
5. **Document with TSDoc**: Use TSDoc comments for components/modules (feeds codegen)
6. **Never edit generated files**: Edit templates in `/scripts/templates/` instead
7. **Test on both platforms**: Verify changes work on Android and iOS
8. **Keep PR scope focused**: Small, atomic changes are easier to review

## Key Configuration Files

- **tsconfig.json**: Strict mode, bundler module resolution, path aliases for `@maplibre/maplibre-react-native`
- **.eslintrc.js**: Extends universe/native, 0 warnings enforced
- **jest.config.ts**: React Native preset, mocks in `src/__tests__/__mocks__/`, path aliases via `moduleNameMapper`
- **package.json**: `codegenConfig` for React Native new arch
- **.clang-format**: Google style, 120 column limit for Objective-C
- **MapLibreReactNative.podspec**: iOS native version config
- **android/gradle.properties**: Android native version config
- **examples/shared/babel.shared.js**: Babel module resolver for `@` alias
- **examples/shared/metro.shared.js**: Metro extraNodeModules for `@` alias
- **examples/shared/tsconfig.json**: TypeScript paths for `@/*` alias

## Trust These Instructions

These instructions have been compiled from repository documentation, configuration files, and CI workflows. Trust this information and only search the codebase if you need specific implementation details not covered here or encounter errors suggesting these instructions are outdated.
