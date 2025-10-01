export function generateCode() {
  let generateCode: number;
  while (true) {
    generateCode = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
    if (
      generateCode.toString().length > 4 &&
      generateCode.toString().length < 7
    ) {
      break;
    }
  }
  return generateCode;
}
