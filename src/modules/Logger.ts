import {
  type EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from "react-native";
const MLRNLogging = NativeModules.MLRNLogging;

export type LogLevel = "error" | "warning" | "info" | "debug" | "verbose";
interface Log {
  message: string;
  level: LogLevel;
  tag?: string;
}

type LogCallback = (log: Log) => boolean;

export class Logger {
  static instance: Logger | null = null;

  static sharedInstance(): Logger {
    if (this.instance === null) {
      this.instance = new Logger();
    }
    return this.instance;
  }

  private loggerEmitter: NativeEventEmitter;
  private startedCount: number;
  private logCallback: LogCallback | null;
  private subscription: EmitterSubscription | null;

  constructor() {
    this.loggerEmitter = new NativeEventEmitter(MLRNLogging);
    this.startedCount = 0;
    this.logCallback = null;
    this.subscription = null;
  }

  /**
   * Set custom logger function.
   * @param {Logger~logCallback} logCallback - callback taking a log object as param. If callback return falsy value then
   * default logging will take place.
   */
  static setLogCallback(logCallback: LogCallback): void {
    this.sharedInstance().setLogCallback(logCallback);
  }

  /**
   * Set custom logger function.
   * @param {Logger~logCallback} logCallback - callback taking a log object as param. If callback return falsy value then
   * default logging will take place.
   */
  setLogCallback(logCallback: LogCallback): void {
    this.logCallback = logCallback;
  }

  /**
   * This callback is displayed as part of the Requester class.
   * @callback Logger~logCallback
   * @param {object} log
   * @param {string} log.message - the message of the log
   * @param {string} log.level - log level
   * @param {string} log.tag - optional tag used on android
   */

  /**
   * setLogLevel
   * @param {LogLevel} level
   */
  static setLogLevel(level: LogLevel): void {
    MLRNLogging.setLogLevel(level);
  }

  /**
   * @type {('error'|'warning'|'info'|'debug'|'verbose')} LogLevel - Supported log levels
   */

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

  subscribe(): void {
    this.subscription = this.loggerEmitter.addListener("LogEvent", (log) => {
      this.onLog(log);
    });
  }

  unsubscribe(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  effectiveLevel({ level, message, tag }: Log): LogLevel {
    if (level === "warning") {
      if (
        tag === "Mbgl-HttpRequest" &&
        message.startsWith("Request failed due to a permanent error: Canceled")
      ) {
        // this seems to happening too much to show a warning every time
        return "info";
      }
    }
    return level;
  }

  onLog(log: Log): void {
    if (!this.logCallback || !this.logCallback(log)) {
      const { message } = log;
      const level = this.effectiveLevel(log);
      if (level === "error") {
        console.error("MapLibre error", message, log);
      } else if (level === "warning") {
        console.warn("MapLibre warning", message, log);
      } else {
        console.log(`MapLibre [${level}]`, message, log);
      }
    }
  }
}
