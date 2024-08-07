package com.maplibre.rctmln.utils;

import org.maplibre.android.maps.MapLibreMap;

import com.maplibre.rctmln.components.AbstractEventEmitter;
import com.maplibre.rctmln.events.IEvent;

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
