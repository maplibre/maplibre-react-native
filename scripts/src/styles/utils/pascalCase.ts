export function pascalCase(str: string, delimiter = "-") {
  const parts = str.split(delimiter);
  return parts
    .map((part) => {
      return part.charAt(0).toUpperCase() + part.substring(1);
    })
    .join("");
}
