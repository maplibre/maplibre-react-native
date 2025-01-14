# Contributing

PRs are most welcome! This doc covers some basic things you'll need to know to set up
your development environment and streamline the review process.

## How this Project is structured

This project consists of these parts:

- Library
    - [`/src`](/src): Shared TypeScript sourcecode
    - [`/android`](/android): Native Java/Kotlin sourcecode for Android
    - [`/ios`](/ios): Native Objective-C/Swift sourcecode for iOS
    - [`/plugin`](/src/plugin): Expo plugin
    - [`/scripts`](/scripts): Codegen responsible native sourcecode for Styles and documentation
- Examples
    - [`/examples/shared`](/examples/shared): Shared code for examples
    - [`/examples/expo-app`](/examples/expo-app): Expo example app, uses new architecture
    - [`/examples/react-native-app`](/examples/react-native-app): React Native example app, uses old architecture

## Environment Setup

### Node.js

Use [Node Version Manager](https://github.com/nvm-sh/nvm), which allows to simply run `nvm install` within the root, to
install and apply the correct
node version. Otherwise make sure, you are using the Node.js version from [`.nvmrc`](/.nvmrc).

### `yarn`

This project uses [`yarn`](https://yarnpkg.com/) as a package manager.

> [!Caution]
> Do not install `yarn` using `npm`, this would install outdated yarn v1. Read
> the [yarn installation docs](https://yarnpkg.com/getting-started/install) or follow the next steps.

1. `corepack enable`
2. `corepack prepare yarn@stable --activate`
3. `yarn install`

Make sure to correctly configure your IDE by following
the [Editor SDKs guide](https://yarnpkg.com/getting-started/editor-sdks).

### IDEs

These are some recommendations and hints on how to work with the project for optimal support during development through
the IDEs.

#### TypeScript

Working on the overall architecture and TypeScript sourcecode works best by opening the library root directory with the
IDE of you choice which supports TypeScript like VSCode, WebStorm or similar.

#### Android

- [Android Studio](https://developer.android.com/studio) freely available on all platforms
- Open the `examples/react-native-app/android` directory
    - Shows the library as `mlrn` in the sourcetree
    - Shows the React Native example app as `app` in the sourcetree
- You can rebuild the React Native Android example app directly from Android Studio, when you have changed Java/Kotlin
  code

#### iOS

- [Xcode](https://developer.apple.com/xcode/) freely available on macOS
- Open the `examples/react-native-app/ios/MapLibreReactNativeExample.xcworkspace` file
    - Shows the library as `Pods > Development Pods > maplibre-react-native`
    - Shows the React Native example app as `MapLibreReactNativeExample`
- You can rebuild the React Native iOS example app directly from Xcode, when you have changed Objective-C/Swift code

## Development

The [React Native](/examples/react-native-app) and [Expo](/examples/expo-app) example apps are set up
to use the library files in the root and the example scenes from [`/examples/shared`](/examples/shared). Therefore,
when using the `start` commands, changes to TypeScript code will be immediately refreshed. When changing native Android
or iOS code, it's necessary to rebuild the native dev clients.

### Install dependencies

This project uses yarn workspaces to accommodate the example apps. You can run `yarn install` form anywhere, which will
install dependencies for all
workspaces.

### Expo App

- To execute commands for the Expo app, you can run with<br/>
  `yarn examples:expo <script>`
    - Alternatively switch to the [`/examples/expo-app`](/examples/expo-app) directory and use the commands without the
      `examples:expo` prefix
- Build and run a platform:
    - `yarn examples:expo android` for building and running Android
    - `yarn examples:expo ios` for building and running iOS
- Starting the dev server<br/>
  `yarn examples:expo start`<br/>
- Purging all artifacts, if you want to create a clean build<br/>
  `yarn examples:expo purge`

### React Native App

- To execute commands for the React Native app, you can run with<br/>
  `yarn examples:react-native <script>`
    - Alternatively switch to the [`/examples/react-native-app`](/examples/react-native-app) directory and use the
      commands without the `examples:react-native` prefix
- Build and run a platform:
    - Building and running Android<br/>
      `yarn examples:react-native android`
    - Building and running iOS<br/>
      `yarn examples:react-native ios:pod-install` (necessary on first install/changes in [
      `Podfile`](/examples/react-native-app/ios/Podfile))<br/>
      `yarn examples:react-native ios`
- Starting the dev server<br/>
  `yarn examples:react-native start`<br/>
  Press one of the following keys:
    - `a` for building and running Android
    - `i` for building and running iOS
- Purging all artifacts, if you want to create a clean build<br/>
  `yarn purge`, which will run:
    - `yarn purge:js`
    - `yarn purge:android`
    - `yarn purge:ios`

It's also possible to build and run the React Native app from Android Studio and Xcode, see [IDEs](#ides).

## Testing

### Linting

This library uses a strict linting setup enforced through [TypeScript](https://github.com/microsoft/TypeScript)
and [ESLint](https://github.com/eslint/eslint). Use `yarn lint` to run all linters.

### Unit Tests

The unit tests are implemented through [Jest](https://github.com/jestjs/jest)
and [React Native Testing Library](https://github.com/callstack/react-native-testing-library). They are found within [
`/src/__tests__`](/src/__tests__). For these tests all native functionality should be mocked and only the TypeScript sourcecode
is tested. Run them with `yarn test`.

### End-to-End Tests

The end-to-end tests are implemented through [Maestro](https://github.com/mobile-dev-inc/maestro) in the React
Native example app. They are found within [`/examples/react-native-app/e2e`](/examples/react-native-app/e2e). To run
them locally, [install Maestro](https://maestro.mobile.dev/getting-started/installing-maestro) first. Then run the React
Native example app on Android emulator or iOS Simulator using `yarn examples:react-native start`. To execute the tests
run `maestro test ./examples/react-native-app/e2e`.

## Documentation

Documentation is generated from code blocks and comments. Run `yarn codegen` to generate the docs.

It's not feasible to edit the files within [`/docs/components`](`/docs/components`) or [`/docs/modules`](
`/docs/modules`) directly. Each file has a comment which notes from which file the doc was generated. To make a change,
update the TSDoc in the corresponding file and run `yarn codegen` again.

## Best Practices for PRs

If you are about to implement something new or substantially change this library, consider to first open an
issue to discuss the matter.

Make sure to use small concise commits with meaningful commit messages based
on [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). Please also name your PR
following this schema, as we use [semantic-release](https://github.com/semantic-release/semantic-release) to
automatically generate the [CHANGELOG](CHANGELOG.md).

If you implemented a new feature, please add tests and demonstrate the functionality through adding a scene in [
`examples`](/examples/shared). Document your feature using the appropriate TSDoc comments.

Make sure, the checks on the pipeline pass, when creating a PR. See [Testing](#testing) on how to run these locally.

## Using an unreleased Version in another Project

As this library needs a build step, it's discouraged to continuously develop against another app project and rather use
the React Native or Expo example apps for fast, iterative development. The examples are set up to use the TypeScript
source files without a build step, with updates through the dev server. But we encourage to test your changes after the
initial development within you own app, allowing you to validate changes in a more complex use case.

### Using a packed Tarball `.tgz`

The simplest approach is creating a Tarball `.tgz`,copying it to your project and installing from file. This has the
benefits that it should work in any environment like CI as well as `eas build --local` and also for other collaborators,
as it can be committed in your repository.

1. Run `yarn pack --out %s-%v.tgz` within the library<br/>
   This will create a `@maplibre-maplibre-react-native-X.X.X.tgz` file for latest version at the root of the
   library
2. Copy the file into your app project, you can choose any path or name
3. Install from file<br/>
   `yarn add ./@maplibre-maplibre-react-native-X.X.X.tgz` or similar command of the package manager of you choice

### Use `yarn link`/`npm link`

You can use commands like [`yarn link`](https://yarnpkg.com/cli/link) or [
`npm link`](https://docs.npmjs.com/cli/v11/commands/npm-link) or a comparable alternative of the package manager of your
choice.

Another alternative for `link` is using [`yalc`](https://github.com/wclr/yalc).

> [!Warning]
> When using `link` or `yalc`, you will have to run `yarn prepack` after changes to the TypeScript source code within
> this library. A watch mode is not available through these approaches. For faster development, use the example apps.
