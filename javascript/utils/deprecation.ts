/**
 * Copy properties from origObject to newObject, which not exists in newObject,
 * calls onDeprecatedCalled callback in case a copied property is invoked.
 */

export function copyPropertiesAsDeprecated<
  DeprecatedType extends object,
  WithDeprecatedType extends Record<string, unknown>,
>(
  origObject: DeprecatedType,
  newObject: WithDeprecatedType,
  onDeprecatedCalled: (key: string) => void,
  accessors: Record<string, (value: any) => unknown> = {},
): WithDeprecatedType {
  const result = newObject;
  for (const [key, value] of Object.entries(origObject)) {
    if (!newObject[key]) {
      // eslint-disable-next-line fp/no-mutating-methods
      Object.defineProperty(result, key, {
        get() {
          onDeprecatedCalled(key);
          return accessors[key] ? accessors[key](value) : value;
        },
      });
    }
  }
  return result;
}
