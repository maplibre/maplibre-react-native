import { Component } from "react";
import { findNodeHandle as rnFindNodeHandle } from "react-native";

export const findNodeHandle = (ref: Component | null) => {
  const nodeHandle = rnFindNodeHandle(ref);

  if (nodeHandle === null) {
    throw new Error(
      "NativeComponent ref is null, wait for the map being initialized",
    );
  }

  return nodeHandle;
};
