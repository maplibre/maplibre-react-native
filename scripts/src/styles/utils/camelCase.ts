export function camelCase(str: string, delimiter = "-") {
  const parts = str.split(delimiter);
  return parts
    .map((part, index) => {
      if (index === 0) {
        return part;
      }
      return part.charAt(0).toUpperCase() + part.substring(1);
    })
    .join("");
}
