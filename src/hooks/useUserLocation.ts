import { useCallback, useEffect, useState } from "react";

import {
  type GeolocationPosition,
  LocationManager,
} from "../modules/location/LocationManager";

interface UseUserLocationOptions {
  enabled?: boolean;
  minDisplacement?: number;
}

export function useUserLocation({
  enabled = true,
  minDisplacement,
}: UseUserLocationOptions = {}) {
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition>();

  useEffect(() => {
    if (minDisplacement !== undefined) {
      LocationManager.setMinDisplacement(minDisplacement);
    }
  }, [minDisplacement]);

  const handleUpdate = useCallback((position: GeolocationPosition): void => {
    setCurrentPosition(position);
  }, []);

  useEffect(() => {
    if (enabled) {
      LocationManager.addListener(handleUpdate);
    }

    return () => {
      LocationManager.removeListener(handleUpdate);
    };
  }, [enabled, handleUpdate]);

  return currentPosition;
}
