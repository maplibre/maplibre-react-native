package com.maplibre.rctmln.components.images;

import android.graphics.drawable.BitmapDrawable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.maplibre.rctmln.components.AbstractEventEmitter;
import com.maplibre.rctmln.components.AbstractMapFeature;
import com.maplibre.rctmln.components.styles.sources.RCTMLNShapeSource;
import com.maplibre.rctmln.events.constants.EventKeys;
import com.maplibre.rctmln.utils.ImageEntry;
import com.maplibre.rctmln.utils.ResourceUtils;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


public class RCTMLNImagesManager extends AbstractEventEmitter<RCTMLNImages> {
    public static final String REACT_CLASS = "RCTMLNImages";

    private ReactApplicationContext mContext;

    @Override
    public String getName() {
        return "RCTMLNImages";
    }


    public RCTMLNImagesManager(ReactApplicationContext context) {
        super(context);
        mContext = context;
    }

    @Override
    public RCTMLNImages createViewInstance(ThemedReactContext context) {
        return new RCTMLNImages(context, this);
    }

    @ReactProp(name = "id")
    public void setId(RCTMLNImages source, String id) {
        source.setID(id);
    }

    @ReactProp(name = "images")
    public void setImages(RCTMLNImages images, ReadableMap map) {
        List<Map.Entry<String, ImageEntry>> imagesList = new ArrayList<>();

        ReadableMapKeySetIterator iterator = map.keySetIterator();
        while (iterator.hasNextKey()) {
            String imageName = iterator.nextKey();
            ImageEntry imageEntry = null;
            if (map.getType(imageName) == ReadableType.Map) {
                ReadableMap imageMap = map.getMap(imageName);
                String uri = imageMap.getString("uri");
                boolean hasScale = imageMap.hasKey("scale") && imageMap.getType("scale") == ReadableType.Number;
                double scale = hasScale ? imageMap.getDouble("scale") : ImageEntry.defaultScale;
                imageEntry = new ImageEntry(uri, scale);
            } else {
                imageEntry = new ImageEntry(map.getString(imageName));
            }
            imagesList.add(new AbstractMap.SimpleEntry<String, ImageEntry>(imageName, imageEntry));
        }

        images.setImages(imagesList);
    }

    @ReactProp(name = "hasOnImageMissing")
    public void setHasOnImageMissing(RCTMLNImages images, Boolean value) {
        images.setHasOnImageMissing(value);
    }

    @ReactProp(name = "nativeImages")
    public void setNativeImages(RCTMLNImages images, ReadableArray arr) {
        List<Map.Entry<String, BitmapDrawable>> resources = new ArrayList<>();

        for (int i = 0; i < arr.size(); i++) {
            String resourceName = arr.getString(i);
            BitmapDrawable drawable = (BitmapDrawable) ResourceUtils.getDrawableByName(mContext, resourceName);

            if (drawable != null) {
                resources.add(new AbstractMap.SimpleEntry<String, BitmapDrawable>(resourceName, drawable));
            }
        }

        images.setNativeImages(resources);
    }

    @Override
    public Map<String, String> customEvents() {
        return MapBuilder.<String, String>builder()
                .put(EventKeys.IMAGES_MISSING, "onImageMissing")
                .build();
    }
}
