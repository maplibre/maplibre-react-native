import { useState } from "react";

let generatedIdCounter = 0;

export function useFrozenId(id?: string) {
  const [frozenId] = useState(id ? id : `shape-source-${generatedIdCounter++}`);

  if (id && id !== frozenId) {
    throw new Error("Source id cannot be changed");
  }

  return frozenId;
}
