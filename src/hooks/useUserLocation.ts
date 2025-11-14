import {
  type GeolocationPosition,
  LocationManager,
} from "@maplibre/maplibre-react-native";
import { useCallback, useEffect, useState } from "react";

interface UseUserLocationOptions {
  enabled?: boolean;
  minDisplacement?: number;
}

export function useUserLocation({
  enabled,
  minDisplacement,
}: UseUserLocationOptions) {
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
