#!/bin/sh

echo "Downloading MapLibre Style Spec"
cd style-spec/

FILENAME=v8.json

if [ -e "./${FILENAME}" ]; then
  echo "Removing old style spec ${FILENAME}"
  rm "./${FILENAME}"
fi

echo "Fetching new style spec ${FILENAME}"
curl -sS https://raw.githubusercontent.com/maplibre/maplibre-style-spec/main/src/reference/${FILENAME} -o ${FILENAME}
cd ..
