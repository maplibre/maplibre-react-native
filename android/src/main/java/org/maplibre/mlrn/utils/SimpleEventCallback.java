package org.maplibre.mlrn.utils;

import org.maplibre.android.maps.MapLibreMap;

import org.maplibre.mlrn.components.AbstractEventEmitter;
import org.maplibre.mlrn.events.IEvent;

/**
 * Created by nickitaliano on 8/31/17.
 */

public class SimpleEventCallback implements MapLibreMap.CancelableCallback {
    private AbstractEventEmitter mEventEmitter;
    private IEvent mEvent;

    public SimpleEventCallback(AbstractEventEmitter eventEmitter, IEvent event) {
        mEventEmitter = eventEmitter;
        mEvent = event;
    }

    @Override
    public void onCancel() {
        mEventEmitter.handleEvent(mEvent);
    }

    @Override
    public void onFinish() {
        mEventEmitter.handleEvent(mEvent);
    }
}
