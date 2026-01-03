import { type ReactNode, useState } from "react";
import { Button, Platform, StyleSheet, Text } from "react-native";

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
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Button
        title={expanded ? "Hide" : "Show"}
        onPress={() => setExpanded(!expanded)}
      />

      {expanded && <Text style={styles.root}>{children}</Text>}
    </>
  );
}
