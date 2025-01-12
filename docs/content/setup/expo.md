---
sidebar_position: 1
---
# Expo Setup

:::info[This package can't be used with "Expo Go"]

It's not part of the [Expo SDK](https://docs.expo.io/workflow/customizing/).

:::

First install the `@maplibre/maplibre-react-native` with [`expo`](https://docs.expo.io/workflow/expo-cli/#expo-install)
or the package manager of your choice:

```bash
npx expo install @maplibre/maplibre-react-native
```

After installing the package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [
`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.{js,ts}`:

```json
{
  "expo": {
    "plugins": [
      "@maplibre/maplibre-react-native"
    ]
  }
}
```

Next, rebuild your app as described in the ["Add custom native code"](https://docs.expo.io/workflow/customizing/) guide.

The plugin is required to properly install MapLibre Native on iOS, where it adds `$MLRN.post_install(installer)` to the
`post_install` block in the `ios/Podfile`. On Android it only serves customizations.

## Plugin Props

The plugin allows to customize the setup of MapLibre React Native through plugin props. Find out more in
the [customization guide](library-customizations).
