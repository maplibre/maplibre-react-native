import { type EventSubscription } from "react-native";

import NativeLogModule from "./NativeLogModule";

/**
 * Log levels in decreasing order of severity
 */
export type LogLevel = "error" | "warn" | "info" | "debug" | "verbose";

interface LogEvent {
  level: LogLevel;
  tag: string;
  message: string;
}

/**
 * Handler for `onLog` events
 *
 * Called before logging a message, return false to proceed with default logging.
 *
 * @param event
 */
type LogHandler = (event: LogEvent) => boolean;

class LogManager {
  private logLevel: LogLevel = "warn";
  private startedCount: number = 0;
  private logHandler: LogHandler | undefined = undefined;
  private subscription: EventSubscription | undefined = undefined;

  constructor() {
    this.handleLog = this.handleLog.bind(this);
  }

  /**
   * Override logging behavior
   *
   * @param logHandler
   */
  onLog(logHandler: LogHandler): void {
    this.logHandler = logHandler;
  }

  /**
   * Set the minimum log level for a message to be logged
   *
   * @param level Minimum log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
    NativeLogModule.setLogLevel(level);
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
    this.subscription = NativeLogModule.onLog(this.handleLog);
  }

  private unsubscribe(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = undefined;
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
    if (!this.logHandler || !this.logHandler(log)) {
      const { message, tag } = log;
      const level = this.effectiveLevel(log);

      const consoleMessage = `MapLibre Native [${level.toUpperCase()}] [${tag}] ${message}`;

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

const logManager = new LogManager();

export { logManager as LogManager };
