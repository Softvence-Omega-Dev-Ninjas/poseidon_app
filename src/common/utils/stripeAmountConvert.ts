export function platformFee(amount: number) {
  return Math.floor(amount * 0.02) * 100;
}

export function converAmountStripe(amount: number) {
  return Number((amount * 100).toFixed(2));
}
