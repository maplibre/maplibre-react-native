import { point } from "@turf/helpers";

import { makeNativeBounds } from "./makeNativeBounds";
import {
  CameraStop,
  nativeAnimationMode,
  NativeCameraStop,
} from "../components/Camera";

export function makeNativeStop(
  stop?: CameraStop,
): NativeCameraStop | undefined {
  if (!stop) {
    return undefined;
  }

  const nativeStop: NativeCameraStop = {};

  if (stop.animationDuration !== undefined) {
    nativeStop.duration = stop.animationDuration;
  }
  if (stop.animationMode !== undefined) {
    nativeStop.mode = nativeAnimationMode(stop.animationMode);
  }
  if (stop.centerCoordinate) {
    nativeStop.centerCoordinate = JSON.stringify(point(stop.centerCoordinate));
  }
  if (stop.heading !== undefined) {
    nativeStop.heading = stop.heading;
  }
  if (stop.pitch !== undefined) {
    nativeStop.pitch = stop.pitch;
  }
  if (stop.zoomLevel !== undefined) {
    nativeStop.zoom = stop.zoomLevel;
  }

  if (stop.bounds && stop.bounds.ne && stop.bounds.sw) {
    const { ne, sw } = stop.bounds;
    nativeStop.bounds = makeNativeBounds(ne, sw);
  }

  const paddingTop = stop.padding?.paddingTop ?? stop.bounds?.paddingTop;
  if (paddingTop !== undefined) {
    nativeStop.paddingTop = paddingTop;
  }

  const paddingRight = stop.padding?.paddingRight ?? stop.bounds?.paddingRight;
  if (paddingRight !== undefined) {
    nativeStop.paddingRight = paddingRight;
  }

  const paddingBottom =
    stop.padding?.paddingBottom ?? stop.bounds?.paddingBottom;
  if (paddingBottom !== undefined) {
    nativeStop.paddingBottom = paddingBottom;
  }

  const paddingLeft = stop.padding?.paddingLeft ?? stop.bounds?.paddingLeft;
  if (paddingLeft !== undefined) {
    nativeStop.paddingLeft = paddingLeft;
  }

  return nativeStop;
}
