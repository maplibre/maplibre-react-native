import { ButtonGroup, ButtonGroupProps } from "@rneui/themed";
import React, { ReactNode, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Page from "./Page";
import colors from "../../styles/colors";

const TAB_BAR_HEIGHT = 64;
const styles = StyleSheet.create({
  buttonGroup: {
    backgroundColor: colors.secondary.white,
    height: TAB_BAR_HEIGHT,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
  },
  scrollableButton: {
    paddingHorizontal: 24,
  },
});

interface TabBarPageProps<DataT> {
  children: ReactNode;
  scrollable?: boolean;
  options: { label: string; data: DataT }[];
  onOptionPress: (index: number, data: DataT) => void;
  initialIndex?: number;
}

function TabBarPage<DataT>({
  children,
  scrollable = false,
  options,
  onOptionPress,
  initialIndex,
}: TabBarPageProps<DataT>) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePress = (index: number) => {
    setCurrentIndex(index);
    onOptionPress(index, options[index].data);
  };

  const buttonGroupProps: ButtonGroupProps = {
    selectedButtonStyle: { backgroundColor: colors.primary.grayFaint },
    buttonContainerStyle: {
      borderRadius: 0,
    },
    onPress: handlePress,
    selectedIndex: currentIndex,
    buttons: options.map((option) => option.label),
    containerStyle: styles.buttonGroup,
    buttonStyle: scrollable ? styles.scrollableButton : undefined,
    activeOpacity: 1,
  };

  return (
    <Page>
      {children}
      <SafeAreaView edges={["right", "bottom", "left"]}>
        {scrollable ? (
          <ScrollView horizontal style={{ maxHeight: TAB_BAR_HEIGHT }}>
            <ButtonGroup {...buttonGroupProps} />
          </ScrollView>
        ) : (
          <ButtonGroup {...buttonGroupProps} />
        )}
      </SafeAreaView>
    </Page>
  );
}
export default TabBarPage;
