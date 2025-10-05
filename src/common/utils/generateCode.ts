export function generateCode() {
  let generateCode: number;
  while (true) {
    generateCode = Math.floor(1000 + Math.random() * 900000); // Generates a 4-digit number
    if (
      generateCode.toString().length > 5 &&
      generateCode.toString().length < 7
    ) {
      break;
    }
  }
  return generateCode;
}
