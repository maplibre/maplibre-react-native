import { useRef } from "react";

const useOnce: (callback: () => void) => void = (callback: () => void) => {
  const once = useRef(false);

  if (!once.current) {
    once.current = true;
    callback();
  }
};

export default useOnce;
