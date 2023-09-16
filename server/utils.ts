export const convertToASCII = (inputString: string) => {
  const asciiString = inputString.replaceAll(/[^\x00-\x7F]+/g, "");
  return asciiString;
};
