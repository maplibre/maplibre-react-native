import { LogManager } from "@maplibre/maplibre-react-native";

import {
  mockNativeModules,
  mockNativeModuleSubscription,
} from "../../__mocks__/NativeModules.mock";

describe("LogManager", () => {
  beforeEach(() => {
    LogManager["startedCount"] = 0;
    LogManager["logHandler"] = undefined;
    LogManager["subscription"] = undefined;
    LogManager["logLevel"] = "warn";

    jest.spyOn(console, "error").mockImplementation(jest.fn());
    jest.spyOn(console, "warn").mockImplementation(jest.fn());
    jest.spyOn(console, "info").mockImplementation(jest.fn());

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("setLogLevel", () => {
    test("sets the log level and calls native module", () => {
      mockNativeModules.MLRNLogModule.setLogLevel = jest.fn();

      LogManager.setLogLevel("debug");

      expect(LogManager["logLevel"]).toBe("debug");
      expect(mockNativeModules.MLRNLogModule.setLogLevel).toHaveBeenCalledWith(
        "debug",
      );
    });

    test("accepts all log levels", () => {
      mockNativeModules.MLRNLogModule.setLogLevel = jest.fn();

      const levels = ["error", "warn", "info", "debug", "verbose"] as const;

      levels.forEach((level) => {
        LogManager.setLogLevel(level);
        expect(LogManager["logLevel"]).toBe(level);
      });

      expect(mockNativeModules.MLRNLogModule.setLogLevel).toHaveBeenCalledTimes(
        5,
      );
    });
  });

  describe("onLog", () => {
    test("sets the custom log handler", () => {
      const customHandler = jest.fn();

      LogManager.onLog(customHandler);

      expect(LogManager["logHandler"]).toBe(customHandler);
    });
  });

  describe("start", () => {
    test("subscribes to logs on first start", () => {
      LogManager.start();

      expect(mockNativeModules.MLRNLogModule.onLog).toHaveBeenCalledTimes(1);
      expect(LogManager["startedCount"]).toBe(1);
    });

    test("increments counter but does not re-subscribe on subsequent starts", () => {
      LogManager.start();
      LogManager.start();
      LogManager.start();

      expect(mockNativeModules.MLRNLogModule.onLog).toHaveBeenCalledTimes(1);
      expect(LogManager["startedCount"]).toBe(3);
    });
  });

  describe("stop", () => {
    test("decrements counter but does not unsubscribe until last stop", () => {
      LogManager.start();
      LogManager.start();
      LogManager.start();

      LogManager.stop();

      expect(LogManager["startedCount"]).toBe(2);
      expect(mockNativeModuleSubscription.remove).not.toHaveBeenCalled();
      expect(LogManager["subscription"]).toBe(mockNativeModuleSubscription);

      LogManager.stop();

      expect(LogManager["startedCount"]).toBe(1);
      expect(mockNativeModuleSubscription.remove).not.toHaveBeenCalled();
    });

    test("unsubscribes when counter reaches zero", () => {
      LogManager.start();
      LogManager.start();

      LogManager.stop();
      LogManager.stop();

      expect(LogManager["startedCount"]).toBe(0);
      expect(mockNativeModuleSubscription.remove).toHaveBeenCalledTimes(1);
      expect(LogManager["subscription"]).toBeUndefined();
    });

    test("handles stop when not started", () => {
      LogManager.stop();

      expect(LogManager["startedCount"]).toBe(-1);
      expect(mockNativeModuleSubscription.remove).not.toHaveBeenCalled();
    });
  });

  describe("handleLog", () => {
    beforeEach(() => {
      LogManager.start();
    });

    afterEach(() => {
      LogManager["startedCount"] = 1;
      LogManager.stop();
    });

    describe("default logging behavior", () => {
      test("logs error messages to console.error", () => {
        const logEvent = {
          level: "error" as const,
          tag: "TestTag",
          message: "Test error message",
        };

        LogManager["handleLog"](logEvent);

        expect(console.error).toHaveBeenCalledWith(
          "MapLibre Native [ERROR] [TestTag] Test error message",
        );
      });

      test("logs warn messages to console.warn when logLevel is warn", () => {
        LogManager.setLogLevel("warn");

        const logEvent = {
          level: "warn" as const,
          tag: "TestTag",
          message: "Test warning message",
        };

        LogManager["handleLog"](logEvent);

        expect(console.warn).toHaveBeenCalledWith(
          "MapLibre Native [WARN] [TestTag] Test warning message",
        );
      });

      test("does not log warn messages when logLevel is error", () => {
        LogManager.setLogLevel("error");

        const logEvent = {
          level: "warn" as const,
          tag: "TestTag",
          message: "Test warning message",
        };

        LogManager["handleLog"](logEvent);

        expect(console.warn).not.toHaveBeenCalled();
      });

      test("logs info messages to console.info when logLevel is info", () => {
        LogManager.setLogLevel("info");

        const logEvent = {
          level: "info" as const,
          tag: "TestTag",
          message: "Test info message",
        };

        LogManager["handleLog"](logEvent);

        expect(console.info).toHaveBeenCalledWith(
          "MapLibre Native [INFO] [TestTag] Test info message",
        );
      });

      test("does not log info messages when logLevel is warn", () => {
        LogManager.setLogLevel("warn");

        const logEvent = {
          level: "info" as const,
          tag: "TestTag",
          message: "Test info message",
        };

        LogManager["handleLog"](logEvent);

        expect(console.info).not.toHaveBeenCalled();
      });

      test("logs debug messages to console.info when logLevel is debug", () => {
        LogManager.setLogLevel("debug");

        const logEvent = {
          level: "debug" as const,
          tag: "TestTag",
          message: "Test debug message",
        };

        LogManager["handleLog"](logEvent);

        expect(console.info).toHaveBeenCalledWith(
          "MapLibre Native [DEBUG] [TestTag] Test debug message",
        );
      });

      test("logs verbose messages to console.info when logLevel is verbose", () => {
        LogManager.setLogLevel("verbose");

        const logEvent = {
          level: "verbose" as const,
          tag: "TestTag",
          message: "Test verbose message",
        };

        LogManager["handleLog"](logEvent);

        expect(console.info).toHaveBeenCalledWith(
          "MapLibre Native [VERBOSE] [TestTag] Test verbose message",
        );
      });
    });

    describe("custom log handler", () => {
      test("calls custom handler and proceeds with default logging when handler returns false", () => {
        const customHandler = jest.fn().mockReturnValue(false);
        LogManager.onLog(customHandler);

        const logEvent = {
          level: "error" as const,
          tag: "TestTag",
          message: "Test message",
        };

        LogManager["handleLog"](logEvent);

        expect(customHandler).toHaveBeenCalledWith(logEvent);
        expect(console.error).toHaveBeenCalledWith(
          "MapLibre Native [ERROR] [TestTag] Test message",
        );
      });

      test("calls custom handler and skips default logging when handler returns true", () => {
        const customHandler = jest.fn().mockReturnValue(true);
        LogManager.onLog(customHandler);

        const logEvent = {
          level: "error" as const,
          tag: "TestTag",
          message: "Test message",
        };

        LogManager["handleLog"](logEvent);

        expect(customHandler).toHaveBeenCalledWith(logEvent);
        expect(console.error).not.toHaveBeenCalled();
      });

      test("proceeds with default logging when handler is not set", () => {
        const logEvent = {
          level: "error" as const,
          tag: "TestTag",
          message: "Test message",
        };

        LogManager["handleLog"](logEvent);

        expect(console.error).toHaveBeenCalledWith(
          "MapLibre Native [ERROR] [TestTag] Test message",
        );
      });
    });

    describe("effectiveLevel", () => {
      test("reduces cancelled HTTP request level from warn to info", () => {
        LogManager.setLogLevel("info");

        const logEvent = {
          level: "warn" as const,
          tag: "Mbgl-HttpRequest",
          message:
            "Request failed due to a permanent error: Canceled; Request was aborted",
        };

        LogManager["handleLog"](logEvent);

        expect(console.warn).not.toHaveBeenCalled();
        expect(console.info).toHaveBeenCalledWith(
          "MapLibre Native [INFO] [Mbgl-HttpRequest] Request failed due to a permanent error: Canceled; Request was aborted",
        );
      });

      test("does not reduce level for other warning messages", () => {
        LogManager.setLogLevel("warn");

        const logEvent = {
          level: "warn" as const,
          tag: "Mbgl-HttpRequest",
          message: "Some other warning",
        };

        LogManager["handleLog"](logEvent);

        expect(console.warn).toHaveBeenCalledWith(
          "MapLibre Native [WARN] [Mbgl-HttpRequest] Some other warning",
        );
        expect(console.info).not.toHaveBeenCalled();
      });

      test("does not reduce level for cancelled request from different tag", () => {
        LogManager.setLogLevel("warn");

        const logEvent = {
          level: "warn" as const,
          tag: "OtherTag",
          message: "Request failed due to a permanent error: Canceled",
        };

        LogManager["handleLog"](logEvent);

        expect(console.warn).toHaveBeenCalledWith(
          "MapLibre Native [WARN] [OtherTag] Request failed due to a permanent error: Canceled",
        );
      });
    });
  });

  describe("integration scenarios", () => {
    test("complete lifecycle: start, log, stop", () => {
      LogManager.start();

      expect(mockNativeModules.MLRNLogModule.onLog).toHaveBeenCalledTimes(1);

      LogManager["handleLog"]({
        level: "error",
        tag: "IntegrationTest",
        message: "Integration test message",
      });

      expect(console.error).toHaveBeenCalledWith(
        "MapLibre Native [ERROR] [IntegrationTest] Integration test message",
      );

      LogManager.stop();

      expect(mockNativeModuleSubscription.remove).toHaveBeenCalledTimes(1);
    });

    test("multiple start/stop pairs", () => {
      LogManager.start();
      LogManager.start();

      expect(mockNativeModules.MLRNLogModule.onLog).toHaveBeenCalledTimes(1);

      LogManager.stop();
      expect(mockNativeModuleSubscription.remove).not.toHaveBeenCalled();

      LogManager.stop();
      expect(mockNativeModuleSubscription.remove).toHaveBeenCalledTimes(1);

      LogManager.start();
      expect(mockNativeModules.MLRNLogModule.onLog).toHaveBeenCalledTimes(2);

      LogManager.stop();
      expect(mockNativeModuleSubscription.remove).toHaveBeenCalledTimes(2);
    });

    test("custom handler with dynamic log level", () => {
      const customHandler = jest.fn((event) => {
        return event.level === "debug";
      });

      LogManager.onLog(customHandler);
      LogManager.setLogLevel("debug");
      LogManager.start();

      LogManager["handleLog"]({
        level: "debug",
        tag: "Test",
        message: "Debug message",
      });
      expect(customHandler).toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();

      LogManager["handleLog"]({
        level: "error",
        tag: "Test",
        message: "Error message",
      });
      expect(customHandler).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();

      LogManager.stop();
    });
  });
});
