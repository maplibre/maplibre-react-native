package org.maplibre.reactnative.events;

import com.facebook.react.bridge.WritableMap;

public interface IEvent {
    int getID();
    String getKey();
    String getType();
    long getTimestamp();
    boolean equals(IEvent event);
    boolean canCoalesce();
    WritableMap getPayload();
    WritableMap toJSON();
}
