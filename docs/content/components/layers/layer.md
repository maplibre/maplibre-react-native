---
# DO NOT MODIFY
# This file is auto-generated from src/components/Layer.tsx
sidebar_label: Layer
---

# `<Layer />`

Layer is a style layer that renders geospatial data on the map.<br/><br/>This is a unified, type-safe layer component that supports all layer types.<br/>The props are constrained based on the `type` prop:<br/>- Background layers don't support `source`, `sourceLayer`, or `filter` props<br/>- All other layers support these props<br/>- The `style` prop is typed according to the layer type<br/><br/>@example<br/>`tsx<br/>// Fill layer with source<br/><Layer type="fill" id="parks" source="parks-source" style={{ fillColor: "green" }} /><br/><br/>// Background layer (no source props allowed)<br/><Layer type="background" id="bg" style={{ backgroundColor: "blue" }} /><br/><br/>// Line layer with filter<br/><Layer<br/>  type="line"<br/>  id="routes"<br/>  source="routes-source"<br/>  filter={["==", ["get", "type"], "highway"]}<br/>  style={{ lineColor: "red", lineWidth: 2 }}<br/>/><br/>`
