export const verifyGivenString = (string: string | undefined, errorMessage: string): string => {
  if (!string || string.length < 1) {
    throw new Error(`${errorMessage}`);
  }
  return string;
};
