import React, { ReactNode, useState } from "react";

import { ButtonGroup } from "./ButtonGroup";
import Page from "./Page";

interface TabBarPageProps<DataT> {
  children: ReactNode;
  scrollable?: boolean;
  options: { label: string; data: DataT }[];
  onOptionPress: (index: number, data: DataT) => void;
  defaultValue?: number;
}

function TabBarPage<DataT>({
  children,
  scrollable = false,
  options,
  onOptionPress,
  defaultValue,
}: TabBarPageProps<DataT>) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Page safeAreaView>
      {children}
      <ButtonGroup
        value={value}
        options={options.map((option) => option.label)}
        onPress={(index: number) => {
          setValue(index);
          onOptionPress(index, options[index].data);
        }}
        scrollable={scrollable}
      />
    </Page>
  );
}
export default TabBarPage;
