import { equals } from "@jest/expect-utils";
import { diff } from "jest-diff";
import { Text } from "react-native";

import { AssertMonospaceText } from "@/components/AssertMonospaceText";

export function AssertEquals<T>({
  expect,
  actual,
}: {
  expect: T;
  actual: T | undefined;
}) {
  const equalsResult = equals(actual, expect);

  return (
    <>
      <Text testID="assert-result">{equalsResult ? "✅" : "❌"}</Text>

      <AssertMonospaceText>
        {JSON.stringify(actual, null, 2)}

        {!equalsResult && (
          <>
            {"\n\n"}
            {diff(expect, actual)}
          </>
        )}
      </AssertMonospaceText>
    </>
  );
}
