import {runNativeCommand, isAndroid, NativeArg} from '../utils';

import {Component, SyntheticEvent} from 'react';

export type RNMLEvent<PayloadType = {[key: string]: string}> = {
  payload: PayloadType;
  type: string;
};

let callbackIncrement = 0;

const NativeBridgeComponent = <
  Props extends object,
  BaseComponent extends new (...args: any[]) => Component<Props>,
>(
  B: BaseComponent,
  nativeModuleName: string,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
) => {
  const NativeBridge = class extends B {
    _nativeModuleName: string;
    _onAndroidCallback: (e: any) => void;
    _callbackMap: Map<string, any>;
    _preRefMapMethodQueue: any[];

    constructor(...args: any[]) {
      super(...args);

      this._nativeModuleName = nativeModuleName;
      this._onAndroidCallback = this._onAndroidCallback0.bind(this);
      this._callbackMap = new Map();
      this._preRefMapMethodQueue = [];
    }

    _addAddAndroidCallback<ReturnType>(
      id: string,
      resolve: (value: ReturnType) => void,
      reject: (error: Error) => void,
    ): void {
      this._callbackMap.set(id, {resolve, reject});
    }

    _removeAndroidCallback(id: string): void {
      this._callbackMap.delete(id);
    }

    _onAndroidCallback0(e: SyntheticEvent<Element, RNMLEvent>): void {
      const callbackID = e.nativeEvent.type;
      const callback = this._callbackMap.get(callbackID);

      if (!callback) {
        return;
      }

      this._callbackMap.delete(callbackID);
      const {payload} = e.nativeEvent;
      if (payload.error) {
        callback.reject.call(null, new Error(payload.error));
      } else {
        callback.resolve.call(null, payload);
      }
    }

    async _runPendingNativeCommands<RefType extends Component>(
      nativeRef: RefType | null | undefined,
    ): Promise<void> {
      if (nativeRef) {
        while (this._preRefMapMethodQueue.length > 0) {
          const item = this._preRefMapMethodQueue.pop();

          if (item && item.method && item.resolver) {
            const res = await this._runNativeCommand(
              item.method.name,
              nativeRef,
              item.method.args,
            );
            item.resolver(res);
          }
        }
      }
    }

    _runNativeCommand<RefType extends Component, ReturnType = NativeArg>(
      methodName: string,
      nativeRef: RefType | undefined | null,
      args: NativeArg[] = [],
    ): Promise<ReturnType> {
      if (!nativeRef) {
        return new Promise(resolve => {
          this._preRefMapMethodQueue.push({
            method: {name: methodName, args},
            resolver: resolve,
          });
        });
      }

      if (isAndroid()) {
        return new Promise((resolve, reject) => {
          callbackIncrement += 1;
          const callbackID = `${methodName}_${callbackIncrement}`;
          this._addAddAndroidCallback(callbackID, resolve, reject);
          args.unshift(callbackID);
          runNativeCommand(this._nativeModuleName, methodName, nativeRef, args);
        });
      }
      return runNativeCommand(
        this._nativeModuleName,
        methodName,
        nativeRef,
        args,
      );
    }
  };
  return NativeBridge;
};

export default NativeBridgeComponent;
