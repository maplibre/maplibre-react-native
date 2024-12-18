import { Children, type ReactElement } from "react";
import { View, NativeModules, requireNativeComponent } from "react-native";

import useAbstractLayer, {
  type BaseLayerProps,
  type NativeBaseProps,
} from "../hooks/useAbstractLayer";
import { type BaseProps } from "../types/BaseProps";
import { type SymbolLayerStyleProps } from "../utils/MapLibreRNStyles";

const MapLibreRN = NativeModules.MLRNModule;

export const NATIVE_MODULE_NAME = "MLRNSymbolLayer";

export interface SymbolLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: SymbolLayerStyleProps;

  /**
   * @deprecated passed children used to create an image with id of symbol in style and also set the iconImageName property accordingly.
   * This is now deprecated, use Image component instead.
   */
  children?: ReactElement | ReactElement[];
}

interface NativeProps extends Omit<SymbolLayerProps, "style">, NativeBaseProps {
  snapshot: boolean;
}

const MLRNSymbolLayer = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * SymbolLayer is a style layer that renders icon and text labels at points or along lines on the map.
 */
const SymbolLayer: React.FC<SymbolLayerProps> = ({
  sourceID = MapLibreRN.StyleSource.DefaultSourceID,
  ...props
}: SymbolLayerProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    SymbolLayerProps,
    NativeBaseProps
  >({
    ...props,
    sourceID,
  });

  const _shouldSnapshot = (): boolean => {
    let isSnapshot = false;

    if (Children.count(props.children) <= 0) {
      return isSnapshot;
    }

    Children.forEach(props.children, (child) => {
      if (child?.type === View) {
        isSnapshot = true;
      }
    });

    return isSnapshot;
  };

  const updatedProps = {
    ...baseProps,
    snapshot: _shouldSnapshot(),
  };

  return (
    <MLRNSymbolLayer ref={setNativeLayer} {...updatedProps}>
      {props.children}
    </MLRNSymbolLayer>
  );
};

export default SymbolLayer;
