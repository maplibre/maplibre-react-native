jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter", () => {
  return {
    default: jest.fn(() => ({
      addListener: jest.fn(() => ({
        remove: jest.fn(),
      })),
    })),
  };
});
