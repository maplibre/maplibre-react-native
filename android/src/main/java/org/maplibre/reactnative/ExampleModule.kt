package org.maplibre.reactnative;

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = ExampleModule.NAME)
class ExampleModule(reactContext: ReactApplicationContext) : NativeExampleModuleSpec(reactContext) {

    override fun getName() = NAME

    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    override fun multiply(a: Double, b: Double): Double {
        return a * b
    }

    companion object {
        const val NAME = "ExampleModule"
    }
}
