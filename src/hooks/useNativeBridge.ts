import {
  Component,
  type MutableRefObject,
  type SyntheticEvent,
  useRef,
} from "react";

import { runNativeCommand, isAndroid, type NativeArg } from "../utils";

export type RNMLEvent<PayloadType = { [key: string]: string }> = {
  payload: PayloadType;
  type: string;
};

let callbackIncrement = 0;

type UseNativeBridge = {
  _nativeModuleName: string;
  _onAndroidCallback: (e: SyntheticEvent<Element, RNMLEvent>) => void;
  _callbackMap: MutableRefObject<Map<string, any>>;
  _preRefMapMethodQueue: MutableRefObject<any[]>;
  _addAddAndroidCallback: <ReturnType>(
    id: string,
    resolve: (value: ReturnType) => void,
    reject: (error: Error) => void,
  ) => void;
  _removeAndroidCallback: (id: string) => void;
  _runPendingNativeCommands: <RefType extends Component>(
    nativeRef: RefType | null | undefined,
  ) => Promise<void>;
  _runNativeCommand: <RefType extends Component, ReturnType = NativeArg>(
    methodName: string,
    nativeRef: RefType | undefined | null,
    args?: NativeArg[],
  ) => Promise<ReturnType>;
};

export const useNativeBridge: (moduleName: string) => UseNativeBridge = (
  _nativeModuleName: string,
) => {
  const _callbackMap = useRef<Map<string, any>>(new Map());
  const _preRefMapMethodQueue = useRef<any[]>([]);

  const _addAddAndroidCallback = <ReturnType>(
    id: string,
    resolve: (value: ReturnType) => void,
    reject: (error: Error) => void,
  ): void => {
    _callbackMap.current.set(id, { resolve, reject });
  };

  const _removeAndroidCallback = (id: string): void => {
    _callbackMap.current.delete(id);
  };

  const _onAndroidCallback = (e: SyntheticEvent<Element, RNMLEvent>): void => {
    const callbackID = e.nativeEvent.type;
    const callback = _callbackMap.current.get(callbackID);

    if (!callback) {
      return;
    }

    _callbackMap.current.delete(callbackID);
    const { payload } = e.nativeEvent;
    if (payload.error) {
      callback.reject.call(null, new Error(payload.error));
    } else {
      callback.resolve.call(null, payload);
    }
  };

  const _runPendingNativeCommands = async <RefType extends Component>(
    nativeRef: RefType | null | undefined,
  ): Promise<void> => {
    if (nativeRef) {
      while (_preRefMapMethodQueue.current.length > 0) {
        const item = _preRefMapMethodQueue.current.pop();

        if (item && item.method && item.resolver) {
          const res = await _runNativeCommand(
            item.method.name,
            nativeRef,
            item.method.args,
          );
          item.resolver(res);
        }
      }
    }
  };

  const _runNativeCommand = <RefType extends Component, ReturnType = NativeArg>(
    methodName: string,
    nativeRef: RefType | undefined | null,
    args: NativeArg[] = [],
  ): Promise<ReturnType> => {
    if (!nativeRef) {
      return new Promise((resolve) => {
        _preRefMapMethodQueue.current.push({
          method: { name: methodName, args },
          resolver: resolve,
        });
      });
    }

    if (isAndroid()) {
      return new Promise((resolve, reject) => {
        callbackIncrement += 1;
        const callbackID = `${methodName}_${callbackIncrement}`;
        _addAddAndroidCallback(callbackID, resolve, reject);
        args.unshift(callbackID);
        runNativeCommand(_nativeModuleName, methodName, nativeRef, args);
      });
    }
    return runNativeCommand(_nativeModuleName, methodName, nativeRef, args);
  };

  return {
    _nativeModuleName,
    _onAndroidCallback,
    _callbackMap,
    _preRefMapMethodQueue,
    _addAddAndroidCallback,
    _removeAndroidCallback,
    _runPendingNativeCommands,
    _runNativeCommand,
  };
};
