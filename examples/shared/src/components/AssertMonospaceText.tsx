import type { ReactNode } from "react";
import { Platform, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
  root: {
    padding: 16,
    width: "100%",
    textAlign: "left",
    fontFamily: Platform.select({
      android: "monospace",
      ios: "ui-monospace",
    }),
  },
});

type AssertMonospaceTextProps = { children: ReactNode };

export function AssertMonospaceText({ children }: AssertMonospaceTextProps) {
  return <Text style={styles.root}>{children}</Text>;
}
