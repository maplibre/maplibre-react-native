import { type ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { sheet } from "../styles/sheet";

interface PageProps {
  children: ReactNode;
}

export function MapSafeAreaView({ children }: PageProps) {
  return (
    <SafeAreaView edges={["bottom"]} style={sheet.matchParent}>
      {children}
    </SafeAreaView>
  );
}
