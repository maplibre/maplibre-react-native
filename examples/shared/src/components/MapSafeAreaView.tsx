import { type ReactNode } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});

interface PageProps {
  children: ReactNode;
}

export function MapSafeAreaView({ children }: PageProps) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.flex1}>
      {children}
    </SafeAreaView>
  );
}
