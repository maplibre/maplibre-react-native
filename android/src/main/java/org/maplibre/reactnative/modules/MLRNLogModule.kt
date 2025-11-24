package org.maplibre.reactnative.modules

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import org.maplibre.android.log.Logger
import org.maplibre.android.log.LoggerDefinition
import org.maplibre.reactnative.NativeLogModuleSpec

class MLRNLogModule(reactContext: ReactApplicationContext) : NativeLogModuleSpec(
    reactContext
) {

    companion object {
        const val NAME: String = "MLRNLogModule"
    }

    override fun getName() = NAME


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


    override fun setLogLevel(level: String) {
        @Logger.LogLevel val logLevel = when (level) {
            "error" -> Logger.ERROR
            "warn" -> Logger.WARN
            "info" -> Logger.INFO
            "debug" -> Logger.DEBUG
            "verbose" -> Logger.VERBOSE
            else -> Logger.NONE
        }
        Logger.setVerbosity(logLevel)
    }


    fun onLog(level: String?, tag: String?, msg: String?, tr: Throwable?) {
        val event = Arguments.createMap()
        event.putString("message", msg)
        event.putString("tag", tag)
        event.putString("level", level)

        emitOnLog(event)
    }
}
