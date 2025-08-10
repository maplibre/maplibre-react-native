package org.maplibre.reactnative.components.camera

import org.maplibre.reactnative.components.mapview.MLRNMapView
import java.util.LinkedList
import java.util.Queue

class CameraUpdateQueue {
    private var mQueue: Queue<CameraStop?>

    private var mCompleteListener: OnCompleteAllListener? = null

    interface OnCompleteAllListener {
        fun onCompleteAll()
    }

    init {
        mQueue = LinkedList<CameraStop?>()
    }

    fun offer(item: CameraStop?) {
        mQueue.offer(item)
    }

    fun size(): Int {
        return mQueue.size
    }

    val isEmpty: Boolean
        get() = mQueue.isEmpty()

    fun flush() {
        while (mQueue.size > 0) {
            mQueue.remove()
        }
        mQueue = LinkedList<CameraStop?>()
    }

    fun setOnCompleteAllListener(listener: OnCompleteAllListener?) {
        mCompleteListener = listener
    }

    fun execute(map: MLRNMapView) {
        if (mQueue.isEmpty()) {
            if (mCompleteListener != null) {
                mCompleteListener!!.onCompleteAll()
            }
            return
        }

        val stop = mQueue.poll()
        if (stop == null) {
            return
        }

        val item = stop.toCameraUpdate(map)
        item.run()
        execute(map)
    }
}
