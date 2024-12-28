import { useRef } from "react";

export const useOnce: (callback: () => void) => void = (
  callback: () => void,
) => {
  const once = useRef(false);

  if (!once.current) {
    once.current = true;
    callback();
  }
};
