---
# DO NOT MODIFY
# This file is auto-generated from src/types/PressEventWithFeatures.ts
sidebar_label: PressEventWithFeatures
---

# PressEventWithFeatures

Press event data enriched with GeoJSON features at the pressed location.

## Type

```ts
interface PressEventWithFeatures extends PressEvent {
  features: GeoJSON.Feature[];
}
```
