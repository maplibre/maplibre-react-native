package org.maplibre.reactnative.utils

import android.view.View
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UIManager
import com.facebook.react.uimanager.IllegalViewOperationException
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType
import org.maplibre.android.log.Logger

data class Await<V>(
    val fn: (V) -> Unit,
    val reject: Promise?,
)

const val LOG_TAG = "ReactTagResolver"

typealias ReactTag = Double

// https://github.com/rnmapbox/maps/pull/3074
open class ReactTagResolver(
    val context: ReactApplicationContext,
) {
    private val createdViews: HashSet<Int> = hashSetOf<Int>()
    private val awaitedViews: HashMap<Int, MutableList<Await<View?>>> = hashMapOf()

    // To be called from view.setId
    fun tagAssigned(reactTag: Int) {
        createdViews.add(reactTag)

        val list = awaitedViews[reactTag]
        if (list != null) {
            context.runOnUiQueueThread {
                try {
                    val view = manager.resolveView(reactTag)

                    list.forEach { it.fn(view) }
                } catch (err: IllegalViewOperationException) {
                    list.forEach { it.reject?.reject(err) }
                }
                awaitedViews.remove(reactTag)
            }
        }
    }

    fun viewRemoved(reactTag: Int) {
        awaitedViews.remove(reactTag)
        createdViews.remove(reactTag)
    }

    private val manager: UIManager
        get() = UIManagerHelper.getUIManager(context, UIManagerType.FABRIC)!!

    fun <V> withViewResolved(
        reactTag: Int,
        promise: Promise? = null,
        fn: (V) -> Unit,
    ) {
        context.runOnUiQueueThread {
            try {
                val resolvedView: View? = manager.resolveView(reactTag)
                val view = resolvedView as? V
                if (view != null) {
                    fn(view)
                } else {
                    val message =
                        "`reactTag` $reactTag resolved to `view` $resolvedView which is null or a wrong type"
                    Logger.e(LOG_TAG, message)
                    promise?.reject(Throwable(message))
                }
            } catch (err: IllegalViewOperationException) {
                if (!createdViews.contains(reactTag)) {
                    awaitedViews.getOrPut(reactTag) { mutableListOf() }.add(
                        Await({ view ->
                            if (view != null) {
                                fn(view as V)
                            } else {
                                val message = "`reactTag` $reactTag resolved null"
                                Logger.e(LOG_TAG, message)
                                promise?.reject(Throwable(message))
                            }
                        }, promise),
                    )
                } else {
                    promise?.reject(err)
                }
            }
        }
    }
}
