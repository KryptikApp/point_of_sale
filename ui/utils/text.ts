/**
 * Removes all spaces from a given string.
 * @param text text to format
 * @returns
 */
export function removeAllSpaces(text: string) {
  // Create a regular expression to match all spaces.
  const regex = /\s/g;

  // Replace all spaces with the given replacement string.
  const newString = text.replace(regex, "");

  // Return the new string.
  return newString;
}
