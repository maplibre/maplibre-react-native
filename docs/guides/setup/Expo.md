# Expo Setup

> [!Important]
> This package cannot be used with the "Expo Go" app
> because [it is not part of the Expo SDK](https://docs.expo.io/workflow/customizing/).

First install the `@maplibre/maplibre-react-native` with [`expo`](https://docs.expo.io/workflow/expo-cli/#expo-install)
or the package manager of your choice:

```shell
npx expo install @maplibre/maplibre-react-native
```

After installing the package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [
`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.{js,ts}`:

```json
{
  "expo": {
    "plugins": ["@maplibre/maplibre-react-native"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/)
guide.

## Plugin Properties

This plugin doesn't currently provide any additional properties for customization. The plugin simply generates the
post-install block in the `ios/Podfile`. No additional changes are done on Android.
