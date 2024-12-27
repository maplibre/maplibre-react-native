import { type ReactNode, useState } from "react";

import { ButtonGroup } from "./ButtonGroup";
import { MapSafeAreaView } from "./MapSafeAreaView";

interface TabBarViewProps<DataT> {
  children: ReactNode;
  scrollable?: boolean;
  options: { label: string; data: DataT }[];
  onOptionPress: (index: number, data: DataT) => void;
  defaultValue?: number;
}

export function TabBarView<DataT>({
  children,
  scrollable = false,
  options,
  onOptionPress,
  defaultValue,
}: TabBarViewProps<DataT>) {
  const [value, setValue] = useState(defaultValue);

  return (
    <MapSafeAreaView>
      {children}
      <ButtonGroup
        value={value}
        options={options.map((option) => option.label)}
        onPress={(index: number) => {
          setValue(index);
          onOptionPress(index, options[index]!.data);
        }}
        scrollable={scrollable}
      />
    </MapSafeAreaView>
  );
}
