import { useCallback, useEffect, useState } from "react";

import {
  type GeolocationPosition,
  LocationManager,
} from "../modules/location/LocationManager";

interface UseCurrentPositionOptions {
  /**
   * Enable or disable position updates
   *
   * @default true
   */
  enabled?: boolean;

  /**
   * Minimum displacement in meters to trigger position update
   *
   * @default 0
   */
  minDisplacement?: number;
}

export function useCurrentPosition({
  enabled = true,
  minDisplacement,
}: UseCurrentPositionOptions = {}) {
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition>();

  useEffect(() => {
    if (minDisplacement !== undefined) {
      LocationManager.setMinDisplacement(minDisplacement);
    }
  }, [minDisplacement]);

  const handleUpdate = useCallback((position: GeolocationPosition) => {
    setCurrentPosition(position);
  }, []);

  useEffect(() => {
    if (enabled) {
      LocationManager.addListener(handleUpdate);
    }

    return () => {
      if (enabled) {
        LocationManager.removeListener(handleUpdate);
      }
    };
  }, [enabled, handleUpdate]);

  return currentPosition;
}
