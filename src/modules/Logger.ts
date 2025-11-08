import {
  type EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from "react-native";

const MLRNLogging = NativeModules.MLRNLogging;

/**
 * Log levels in decreasing order of severity
 */
export type LogLevel = "error" | "warn" | "info" | "debug" | "verbose";

interface LogEvent {
  message: string;
  level: LogLevel;
  tag?: string;
}

/**
 * Handler for `onLog` events
 *
 * @param event
 */
type LogHandler = (event: LogEvent) => boolean;

class Logger {
  private logLevel: LogLevel = "warn";
  private loggerEmitter: NativeEventEmitter = new NativeEventEmitter(
    MLRNLogging,
  );
  private startedCount: number = 0;
  private logCallback: LogHandler | null = null;
  private subscription: EmitterSubscription | null = null;

  /**
   * Override logging behavior
   *
   * @param logCallback Called before logging a message, return falsy to proceed with default logging
   */
  onLog(logCallback: LogHandler): void {
    this.logCallback = logCallback;
  }

  /**
   * Set the minimum log level for a message to be logged
   *
   * @param level Minimum log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
    MLRNLogging.setLogLevel(level);
  }

  start(): void {
    if (this.startedCount === 0) {
      this.subscribe();
    }

    this.startedCount += 1;
  }

  stop(): void {
    this.startedCount -= 1;

    if (this.startedCount === 0) {
      this.unsubscribe();
    }
  }

  private subscribe(): void {
    this.subscription = this.loggerEmitter.addListener("LogEvent", (log) => {
      this.handleLog(log);
    });
  }

  private unsubscribe(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  private effectiveLevel({ level, message, tag }: LogEvent): LogLevel {
    // Reduce level of cancelled HTTP requests from warn to info
    if (
      level === "warn" &&
      tag === "Mbgl-HttpRequest" &&
      message.startsWith("Request failed due to a permanent error: Canceled")
    ) {
      return "info";
    }

    return level;
  }

  private handleLog(log: LogEvent): void {
    if (!this.logCallback || !this.logCallback(log)) {
      const { message, tag } = log;
      const level = this.effectiveLevel(log);

      const consoleMessage = `MapLibre Native [${level}]: ${tag ? `[${tag}] ` : ""}${message}`;

      if (level === "error") {
        console.error(consoleMessage);
      } else if (level === "warn" && this.logLevel !== "error") {
        console.warn(consoleMessage);
      } else if (this.logLevel !== "error" && this.logLevel !== "warn") {
        console.info(consoleMessage);
      }
    }
  }
}

const logger = new Logger();
logger.setLogLevel("verbose");
export { logger as Logger };
