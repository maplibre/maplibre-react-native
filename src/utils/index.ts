import {
  Children,
  cloneElement,
  Component,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Image,
  NativeModules,
  findNodeHandle,
  Platform,
  type ImageSourcePropType,
  UIManager,
} from "react-native";

export function isAndroid(): boolean {
  return Platform.OS === "android";
}

export function isFunction(fn: unknown): fn is Function {
  return typeof fn === "function";
}

export function isNumber(num: unknown): num is number {
  return typeof num === "number" && !Number.isNaN(num);
}

export function isUndefined(obj: unknown): obj is undefined {
  return typeof obj === "undefined";
}

export function isString(str: unknown): str is string {
  return typeof str === "string";
}

export function isBoolean(bool: unknown): bool is boolean {
  return typeof bool === "boolean";
}

export type NativeArg =
  | string
  | number
  | boolean
  | null
  | { [k: string]: NativeArg }
  | NativeArg[];

export function runNativeCommand<ReturnType = NativeArg>(
  module: string,
  name: string,
  nativeRef: Component,
  args: NativeArg[] = [],
): ReturnType {
  const handle = findNodeHandle(nativeRef);
  if (!handle) {
    throw new Error(`Could not find handle for native ref ${module}.${name}`);
  }

  const managerInstance = isAndroid()
    ? UIManager.getViewManagerConfig(module)
    : NativeModules[module];

  if (!managerInstance) {
    throw new Error(`Could not find ${module}`);
  }

  if (isAndroid()) {
    UIManager.dispatchViewManagerCommand(
      handle,
      managerInstance.Commands[name],
      args,
    );

    // Android uses callback instead of return
    return null as ReturnType;
  }

  return managerInstance[name](handle, ...args);
}

export function cloneReactChildrenWithProps(
  children: ReactNode,
  propsToAdd: { [key: string]: string } = {},
): ReactElement[] | null {
  if (!children) {
    return null;
  }

  const foundChildren = Array.isArray(children) ? children : [children];
  const filteredChildren = foundChildren.filter((child) => !!child);

  return Children.map(filteredChildren, (child) =>
    cloneElement(child, propsToAdd),
  );
}

export function resolveImagePath(imageRef: ImageSourcePropType): string {
  const res = Image.resolveAssetSource(imageRef);
  return res.uri;
}

export function toJSONString(json: object | string = ""): string {
  return JSON.stringify(json);
}
