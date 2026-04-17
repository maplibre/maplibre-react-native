import { type ReactNode } from "react";
import {
  type GestureResponderEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    borderRadius: 30,
    bottom: 16,
    left: 16,
    minHeight: 60,
    maxHeight: "80%",
    paddingVertical: 16,
    position: "absolute",
    right: 16,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

interface BubbleProps {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
}

export function Bubble({ children, onPress }: BubbleProps) {
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.contentContainer}
    >
      {onPress ? (
        <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
      ) : (
        children
      )}
    </ScrollView>
  );
}
