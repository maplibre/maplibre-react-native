import { type ReactNode } from "react";
import {
  type StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";
import { type GestureResponderEvent } from "react-native/Libraries/Types/CoreEventTypes";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    bottom: 16,
    justifyContent: "center",
    left: 48,
    minHeight: 60,
    paddingVertical: 16,
    position: "absolute",
    right: 48,
  },
});

interface BubbleProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: (event: GestureResponderEvent) => void;
}

export function Bubble({ children, style, onPress }: BubbleProps) {
  return (
    <View style={[styles.container, style]}>
      {onPress ? (
        <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
      ) : (
        children
      )}
    </View>
  );
}
