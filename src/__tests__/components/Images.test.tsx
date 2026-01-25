import { Images, type ImagesProps } from "@maplibre/maplibre-react-native";
import { render } from "@testing-library/react-native";

const TEST_ID = "MLRNImages";

function renderImages(props: ImagesProps = { images: {} }) {
  return render(<Images testID={TEST_ID} {...props} />);
}

describe("Images", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("renders", () => {
    test("with empty images", () => {
      const { getByTestId } = renderImages({ images: {} });
      expect(getByTestId(TEST_ID).props.images).toEqual({});
    });
  });

  describe("images prop", () => {
    test("handles string URLs", () => {
      const { getByTestId } = renderImages({
        images: {
          pin: "https://example.com/pin.png",
        },
      });

      expect(getByTestId(TEST_ID).props.images).toEqual({
        pin: "https://example.com/pin.png",
      });
    });

    test("handles native asset names (strings without URL prefix)", () => {
      const { getByTestId } = renderImages({
        images: {
          marker: "marker",
          pin: "custom_pin",
        },
      });

      // Native asset names are passed through as strings
      expect(getByTestId(TEST_ID).props.images).toEqual({
        marker: "marker",
        pin: "custom_pin",
      });
    });

    test("handles mixed string types", () => {
      const { getByTestId } = renderImages({
        images: {
          nativePin: "pin",
          remoteIcon: "https://example.com/icon.png",
          fileIcon: "file:///path/to/icon.png",
          pathIcon: "/absolute/path/icon.png",
        },
      });

      const images = getByTestId(TEST_ID).props.images;
      // All strings are passed through
      expect(images.nativePin).toBe("pin");
      expect(images.remoteIcon).toBe("https://example.com/icon.png");
      expect(images.fileIcon).toBe("file:///path/to/icon.png");
      expect(images.pathIcon).toBe("/absolute/path/icon.png");
    });
  });

  describe("onImageMissing", () => {
    test("sets hasOnImageMissing to true when callback is provided", () => {
      const onImageMissing = jest.fn();
      const { getByTestId } = renderImages({ images: {}, onImageMissing });

      expect(getByTestId(TEST_ID).props.hasOnImageMissing).toBe(true);
    });

    test("sets hasOnImageMissing to false when callback is not provided", () => {
      const { getByTestId } = renderImages();

      expect(getByTestId(TEST_ID).props.hasOnImageMissing).toBe(false);
    });

    test("wraps callback to extract imageKey from event", () => {
      const onImageMissing = jest.fn();
      const { getByTestId } = renderImages({ images: {}, onImageMissing });

      const nativeCallback = getByTestId(TEST_ID).props.onImageMissing;
      expect(nativeCallback).toBeDefined();

      // Simulate native event
      nativeCallback({ nativeEvent: { imageKey: "missing-icon" } });

      expect(onImageMissing).toHaveBeenCalledWith("missing-icon");
    });
  });
});
