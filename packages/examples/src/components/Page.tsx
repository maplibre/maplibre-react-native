import { type ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import sheet from "../styles/sheet";

interface PageProps {
  children: ReactNode;
  safeAreaView?: boolean;
}

const Page = ({ children, safeAreaView }: PageProps) => {
  if (safeAreaView) {
    return (
      <SafeAreaView edges={["bottom"]} style={sheet.matchParent}>
        {children}
      </SafeAreaView>
    );
  } else {
    return children;
  }
};

export default Page;
