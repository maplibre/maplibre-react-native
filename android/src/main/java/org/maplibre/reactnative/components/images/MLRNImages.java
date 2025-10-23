package org.maplibre.reactnative.components.images;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.res.ResourcesCompat;

import org.maplibre.android.maps.MapLibreMap;
import org.maplibre.android.maps.Style;
import org.maplibre.android.utils.BitmapUtils;
import org.maplibre.reactnative.R;
import org.maplibre.reactnative.components.AbstractMapFeature;
import org.maplibre.reactnative.components.mapview.MLRNMapView;
import org.maplibre.reactnative.events.ImageMissingEvent;
import org.maplibre.reactnative.utils.DownloadMapImageTask;
import org.maplibre.reactnative.utils.ImageEntry;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class MLRNImages extends AbstractMapFeature {
    private static Bitmap mImagePlaceholder;
    Set<String> mCurrentImages;
    private Map<String, ImageEntry> mImages;
    private Map<String, BitmapDrawable> mNativeImages;
    private MLRNImagesManager mManager;
    private boolean mSendMissingImageEvents = false;
    private MapLibreMap mMap;

    protected String mID;

    public String getID() {
        return mID;
    }

    public void setID(String id) {
        mID = id;
    }

    public MLRNImages(Context context, MLRNImagesManager manager) {
        super(context);
        mManager = manager;
        mCurrentImages = new HashSet<>();
        mImages = new HashMap<>();
        mNativeImages = new HashMap();
        if (mImagePlaceholder == null) {
            mImagePlaceholder = BitmapUtils.getBitmapFromDrawable(ResourcesCompat.getDrawable(context.getResources(), R.drawable.empty_drawable, null));
        }
    }

    public void setImages(List<Map.Entry<String, ImageEntry>> images) {
        Map<String, ImageEntry> newImages = new HashMap<>();
        for (Map.Entry<String, ImageEntry> entry : images) {
            String key = entry.getKey();
            ImageEntry value = entry.getValue();
            ImageEntry oldValue = mImages.put(key, value);
            if (oldValue == null) {
                newImages.put(key, value);
            }
        }
        if (mMap != null && mMap.getStyle() != null) {
            addImagesToStyle(newImages, mMap);
        }
    }

    public void setNativeImages(List<Map.Entry<String, BitmapDrawable>> nativeImages) {
        Map<String, BitmapDrawable> newImages = new HashMap<>();
        for (Map.Entry<String, BitmapDrawable> entry : nativeImages) {
            String key = entry.getKey();
            BitmapDrawable value = entry.getValue();
            BitmapDrawable oldValue = mNativeImages.put(key, value);
            if (oldValue == null) {
                newImages.put(key, value);
            }
        }
        if (mMap != null && mMap.getStyle() != null) {
            addNativeImagesToStyle(newImages, mMap);
        }
    }

    public void setHasOnImageMissing(boolean value) {
        mSendMissingImageEvents = value;
    }

    @Override
    public void removeFromMap(MLRNMapView mapView) {
        removeImages(mapView);
        mMap = null;
        mNativeImages = new HashMap<>();
        mImages = new HashMap<>();
        mCurrentImages = new HashSet<>();
    }

    private void removeImages(MLRNMapView mapView) {
        mapView.getStyle(new Style.OnStyleLoaded() {
            @Override
            public void onStyleLoaded(@NonNull Style style) {
            if (hasImages()) {
                for (Map.Entry<String, ImageEntry> image : mImages.entrySet()) {
                    style.removeImage(image.getKey());
                }
            }

            if (hasNativeImages()) {
                for (Map.Entry<String, BitmapDrawable> image : mNativeImages.entrySet()) {
                    style.removeImage(image.getKey());
                }
            }
        }});
    }

    private boolean hasImages() {
        return mImages != null && mImages.size() > 0;
    }

    private boolean hasNativeImages() {
        return mNativeImages != null && mNativeImages.size() > 0;
    }


    static <K, V> List<Map.Entry<K,V>> entry(K k, V v) {
        return Collections.singletonList((Map.Entry<K,V>)new AbstractMap.SimpleEntry<K, V>(k, v));
    }

    public boolean addMissingImageToStyle(@NonNull String id, @NonNull MapLibreMap map) {
        if (mNativeImages != null) {
            BitmapDrawable drawable = mNativeImages.get(id);
            if (drawable != null) {
                addNativeImages(MLRNImages.entry(id, drawable), map);
                return true;
            }
        }
        if (mImages != null) {
            ImageEntry entry = mImages.get(id);
            if (entry != null) {
                addRemoteImages(MLRNImages.entry(id, entry), map);
                return true;
            }
        }

        return false;
    }

    public void addImagesToStyle(Map<String, ImageEntry> images, @NonNull MapLibreMap map) {
        if (images != null) {
            addRemoteImages(new ArrayList<>(images.entrySet()), map);
        }
    }

    public void addNativeImagesToStyle(Map<String, BitmapDrawable> images, @NonNull MapLibreMap map) {
        if (images != null) {
            addNativeImages(new ArrayList<>(images.entrySet()), map);
        }
    }

    public void sendImageMissingEvent(@NonNull String id, @NonNull MapLibreMap map) {
        if (mSendMissingImageEvents) {
            mManager.handleEvent(ImageMissingEvent.makeImageMissingEvent(this, id));
        }
    }

    private boolean hasImage(String imageId, @NonNull MapLibreMap map) {
        Style style = map.getStyle();
        return style != null && style.getImage(imageId) != null;
    }

    @Override
    public void addToMap(final MLRNMapView mapView) {
        // Wait for style before adding the source to the map
        // only then we can pre-load required images / placeholders into the style
        // before we add the ShapeSource to the map
        mapView.getStyle(new Style.OnStyleLoaded() {
            @Override
            public void onStyleLoaded(@NonNull Style style) {
                MapLibreMap map = mapView.getMapLibreMap();
                mMap = map;
                addNativeImagesToStyle(mNativeImages, map);
                addImagesToStyle(mImages, map);
                // super.addToMap(mapView);
            }
        });
    }

    private void addNativeImages(@Nullable List<Map.Entry<String, BitmapDrawable>> imageEntries, @NonNull MapLibreMap map) {
        Style style = map.getStyle();
        if (style == null || imageEntries == null) return;

        for (Map.Entry<String, BitmapDrawable> imageEntry : imageEntries) {
            if (!hasImage(imageEntry.getKey(), map)) {
                style.addImage(imageEntry.getKey(), imageEntry.getValue());
                mCurrentImages.add(imageEntry.getKey());
            }
        }
    }

    private void addRemoteImages(@Nullable List<Map.Entry<String, ImageEntry>> imageEntries, @NonNull MapLibreMap map) {
        Style style = map.getStyle();
        if (style == null || imageEntries == null) return;

        List<Map.Entry<String, ImageEntry>> missingImages = new ArrayList<>();

        // Add image placeholder for images that are not yet available in the style. This way
        // we can load the images asynchronously and add the ShapeSource to the map without delay.
        // The same is required when this ShapeSource is updated with new/added images and the
        // data references them. In which case addMissingImageToStyle will take care of loading
        // them in a similar way.
        //
        // See also: https://github.com/mapbox/mapbox-gl-native/pull/14253#issuecomment-478827792
        for (Map.Entry<String, ImageEntry> imageEntry : imageEntries) {
            if (!hasImage(imageEntry.getKey(), map)) {
                style.addImage(imageEntry.getKey(), mImagePlaceholder);
                missingImages.add(imageEntry);
                mCurrentImages.add(imageEntry.getKey());
            }
        }

        if (missingImages.size() > 0) {
            DownloadMapImageTask task = new DownloadMapImageTask(getContext(), map, null);
            Map.Entry[] params = missingImages.toArray(new Map.Entry[missingImages.size()]);
            //noinspection unchecked
            task.execute(params);
        }
    }
}
