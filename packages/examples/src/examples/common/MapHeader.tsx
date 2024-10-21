import { Header } from "@rneui/themed";
import React from "react";
import { StatusBarStyle, StyleSheet } from "react-native";

import colors from "../../styles/colors";

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0,
  },
  label: {
    color: colors.secondary.white,
    fontSize: 24,
  },
});

interface MapHeaderProps {
  label: string;
  backgroundColor?: string;
  statusBarColor?: string;
  statusBarTextTheme?: StatusBarStyle;
  onBack?: () => void;
}

export default function MapHeader({
  label,
  backgroundColor = colors.primary.blue,
  statusBarTextTheme = "light-content",
  statusBarColor = colors.primary.blueDark,
  onBack,
}: MapHeaderProps) {
  const statusBarProps = {
    barStyle: statusBarTextTheme,
    backgroundColor: statusBarColor,
  };

  return (
    <Header
      placement="left"
      backgroundColor={backgroundColor}
      statusBarProps={statusBarProps}
      containerStyle={styles.container}
      leftComponent={{
        icon: onBack ? "arrow-back" : "",
        onPress: onBack,
        color: colors.secondary.white,
      }}
      centerComponent={{ text: label, style: styles.label }}
    />
  );
}
