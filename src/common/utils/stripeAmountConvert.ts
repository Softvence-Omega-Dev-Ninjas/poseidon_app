export function platformFee(amount: number, tranAmount?: number) {
  const free = tranAmount || 0.2;
  return Math.floor(amount * free) * 100;
}

export function converAmountStripe(amount: number) {
  return Number((amount * 100).toFixed(2));
}
