package org.maplibre.reactnative.components.sources.imagesource

import android.content.Context
import android.net.Uri
import android.util.Log
import com.facebook.react.views.imagehelper.ResourceDrawableIdHelper
import org.maplibre.android.geometry.LatLngQuad
import org.maplibre.android.style.sources.ImageSource
import org.maplibre.reactnative.components.sources.MLRNSource
import java.net.URL

class MLRNImageSource(
    context: Context,
) : MLRNSource<ImageSource>(context) {
    companion object {
        const val LOG_TAG = "MLRNImageSource"
    }

    private var mURL: URL? = null
    private var mResourceId: Int = 0
    private var mCoordQuad: LatLngQuad? = null

    override fun makeSource(): ImageSource =
        if (mURL == null) {
            ImageSource(mID, mCoordQuad!!, mResourceId)
        } else {
            ImageSource(mID, mCoordQuad!!, mURL!!)
        }

    fun setURL(url: String?) {
        if (url == null) return

        try {
            val uri = Uri.parse(url)

            if (uri.scheme == null) {
                mResourceId =
                    ResourceDrawableIdHelper
                        .getInstance()
                        .getResourceDrawableId(context, url)

                source?.setImage(mResourceId)
            } else {
                mURL = URL(url)
                source?.setUri(mURL!!.toURI())
            }
        } catch (e: Exception) {
            Log.w(LOG_TAG, e.localizedMessage ?: "Error setting URL")
        }
    }

    fun setCoordinates(coordQuad: LatLngQuad?) {
        mCoordQuad = coordQuad
        if (coordQuad == null) return

        source?.setCoordinates(coordQuad)
    }
}
