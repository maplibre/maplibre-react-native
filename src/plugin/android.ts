import {
  type ConfigPlugin,
  withGradleProperties as withGradlePropertiesExpo,
} from "@expo/config-plugins";
import type { PropertiesItem } from "@expo/config-plugins/build/android/Properties";

import type { MapLibrePluginProps } from "./MapLibrePluginProps";

type PropertyItem = {
  type: "property";
  key: string;
  value: string;
};

export const getGradleProperties = (
  props: MapLibrePluginProps,
): PropertyItem[] => {
  return Object.entries(props?.android || {}).reduce(
    (properties, [key, value]) => {
      if (key && value) {
        properties.push({
          type: "property",
          key: `org.maplibre.reactnative.${key}`,
          value: value.toString(),
        });
      }

      return properties;
    },
    [] as PropertyItem[],
  );
};

export const mergeGradleProperties = (
  oldProperties: PropertiesItem[],
  newProperties: PropertyItem[],
): PropertiesItem[] => {
  const newPropertiesKeys = newProperties.map(({ key }) => key);
  const merged = oldProperties.filter(
    (item) =>
      !(item.type === "property" && newPropertiesKeys.includes(item.key)),
  );

  merged.push(...newProperties);

  return merged;
};

export const withGradleProperties: ConfigPlugin<MapLibrePluginProps> = (
  config,
  props,
) => {
  const gradleProperties = getGradleProperties(props);

  return withGradlePropertiesExpo(config, (c) => {
    c.modResults = mergeGradleProperties(c.modResults, gradleProperties);

    return c;
  });
};

export const android = {
  withGradleProperties,
};
