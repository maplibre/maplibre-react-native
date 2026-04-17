import { Text } from "react-native";
import { z, type ZodType } from "zod";

import { AssertMonospaceText } from "@/components/AssertMonospaceText";

export function AssertZod<T extends ZodType>({
  schema,
  actual,
}: {
  schema: T;
  actual: z.infer<T> | undefined;
}) {
  const result = schema.safeParse(actual);

  return (
    <>
      <Text testID="assert-result">{result.success ? "✅" : "❌"}</Text>

      <AssertMonospaceText>
        {JSON.stringify(actual, null, 2)}

        {result.error && (
          <>
            {"\n\n"}
            {result.error.issues
              .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
              .join("\n")}
          </>
        )}
      </AssertMonospaceText>
    </>
  );
}
