import { isBoolean, isNumber, isString } from "./index";

export type RawValueType =
  | string
  | number
  | boolean
  | RawValueType[]
  | { [key: string]: RawValueType };

export type StyleValueJSON =
  | { type: "boolean"; value: boolean }
  | { type: "number"; value: number }
  | { type: "string"; value: string }
  | { type: "hashmap"; value: object }
  | { type: "array"; value: unknown[] };

type StyleValueTypes = "boolean" | "number" | "string" | "hashmap" | "array";

export class BridgeValue {
  rawValue: RawValueType;

  constructor(rawValue: RawValueType) {
    this.rawValue = rawValue;
  }

  get type(): StyleValueTypes {
    if (Array.isArray(this.rawValue)) {
      return "array";
    }
    if (isBoolean(this.rawValue)) {
      return "boolean";
    }
    if (isNumber(this.rawValue)) {
      return "number";
    }
    if (isString(this.rawValue)) {
      return "string";
    }
    if (this.rawValue && typeof this.rawValue === "object") {
      return "hashmap";
    }
    throw new Error(
      `[type - ${this.rawValue}] BridgeValue must be a primitive/array/object`,
    );
  }

  get value():
    | [StyleValueJSON, StyleValueJSON][]
    | StyleValueJSON[]
    | RawValueType {
    const { type } = this;

    let value;

    if (type === "array") {
      value = [];

      for (const innerRawValue of this.rawValue as RawValueType[]) {
        const bridgeValue = new BridgeValue(innerRawValue);
        value.push(bridgeValue.toJSON());
      }
    } else if (type === "hashmap") {
      const rawValue = this.rawValue as { [key: string]: RawValueType };

      value = Object.entries(rawValue).map(
        ([key, value]) =>
          [new BridgeValue(key).toJSON(), new BridgeValue(value).toJSON()] as [
            StyleValueJSON,
            StyleValueJSON,
          ],
      );
    } else if (type === "boolean" || type === "number" || type === "string") {
      value = this.rawValue;
    } else {
      throw new Error(
        `[value - ${this.rawValue}] BridgeValue must be a primitive/array/object`,
      );
    }

    return value;
  }

  toJSON(formatter?: <T>(arg0: T) => T): StyleValueJSON {
    return {
      type: this.type,
      value:
        typeof formatter === "function" ? formatter(this.value) : this.value,
    } as StyleValueJSON;
  }
}
