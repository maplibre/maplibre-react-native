package org.maplibre.reactnative.modules

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.maplibre.android.log.Logger
import org.maplibre.android.log.LoggerDefinition

@ReactModule(name = MLRNLogging.Companion.REACT_CLASS)
class MLRNLogging(private val mReactContext: ReactApplicationContext) : ReactContextBaseJavaModule(
    mReactContext
) {
    init {
        Logger.setVerbosity(Logger.WARN)

        Logger.setLoggerDefinition(object : LoggerDefinition {
            override fun v(tag: String?, msg: String) {
                Log.v(tag, msg)
                onLog("verbose", tag, msg, null)
            }

            override fun v(tag: String?, msg: String?, tr: Throwable?) {
                Log.v(tag, msg, tr)
                onLog("verbose", tag, msg, tr)
            }

            override fun d(tag: String?, msg: String) {
                Log.d(tag, msg)
                onLog("debug", tag, msg, null)
            }

            override fun d(tag: String?, msg: String?, tr: Throwable?) {
                Log.d(tag, msg, tr)
                onLog("debug", tag, msg, tr)
            }

            override fun i(tag: String?, msg: String) {
                Log.i(tag, msg)
                onLog("info", tag, msg, null)
            }

            override fun i(tag: String?, msg: String?, tr: Throwable?) {
                Log.i(tag, msg, tr)
                onLog("info", tag, msg, tr)
            }

            override fun w(tag: String?, msg: String) {
                Log.w(tag, msg)
                onLog("warn", tag, msg, null)
            }

            override fun w(tag: String?, msg: String?, tr: Throwable?) {
                Log.w(tag, msg, tr)
                onLog("warn", tag, msg, tr)
            }

            override fun e(tag: String?, msg: String) {
                Log.e(tag, msg)
                onLog("error", tag, msg, null)
            }

            override fun e(tag: String?, msg: String?, tr: Throwable?) {
                Log.e(tag, msg, tr)
                onLog("error", tag, msg, tr)
            }
        })
    }

    override fun getName(): String {
        return REACT_CLASS
    }

    @ReactMethod
    fun setLogLevel(level: String) {
        @Logger.LogLevel var logLevel = Logger.NONE
        when (level) {
            "error" -> logLevel = Logger.ERROR
            "warn" -> logLevel = Logger.WARN
            "info" -> logLevel = Logger.INFO
            "debug" -> logLevel = Logger.DEBUG
            "verbose" -> logLevel = Logger.VERBOSE
            else -> logLevel = Logger.NONE
        }
        Logger.setVerbosity(logLevel)
    }

    @ReactMethod
    fun addListener(eventName: String?) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

    fun onLog(level: String?, tag: String?, msg: String?, tr: Throwable?) {
        val event = Arguments.createMap()
        event.putString("message", msg)
        event.putString("tag", tag)
        event.putString("level", level)

        mReactContext
            .getJSModule<DeviceEventManagerModule.RCTDeviceEventEmitter?>(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("LogEvent", event)
    }

    companion object {
        const val REACT_CLASS: String = "MLRNLogging"
    }
}
