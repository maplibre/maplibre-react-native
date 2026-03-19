package org.maplibre.reactnative.components.camera

import org.maplibre.reactnative.components.mapview.MLRNMapView
import java.util.LinkedList
import java.util.Queue

class CameraUpdateQueue {
    private var queue: Queue<CameraStop?>

    private var completeListener: OnCompleteAllListener? = null

    interface OnCompleteAllListener {
        fun onCompleteAll()
    }

    init {
        queue = LinkedList<CameraStop?>()
    }

    fun offer(item: CameraStop?) {
        queue.offer(item)
    }

    fun size(): Int = queue.size

    val isEmpty: Boolean
        get() = queue.isEmpty()

    fun flush() {
        while (queue.size > 0) {
            queue.remove()
        }
        queue = LinkedList<CameraStop?>()
    }

    fun setOnCompleteAllListener(listener: OnCompleteAllListener?) {
        completeListener = listener
    }

    fun execute(map: MLRNMapView) {
        if (queue.isEmpty()) {
            if (completeListener != null) {
                completeListener!!.onCompleteAll()
            }

            return
        }

        val stop = queue.poll()
        if (stop == null) {
            return
        }

        val item = stop.toCameraUpdate(map)
        item.run()
        execute(map)
    }
}
