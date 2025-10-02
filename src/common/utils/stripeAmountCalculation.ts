export function calculateStripeBalances({
  available,
  pending,
  refundAvailable,
  refundPending,
  instantAvailable,
}: {
  available: number;
  pending: number;
  refundAvailable: number;
  refundPending: number;
  instantAvailable: number;
}) {
  return {
    totalEarningBalance: available + pending + refundAvailable + refundPending,
    totalWithdrawalBalance: available, // funds ready for payout
    totalAvailableBalance: available + instantAvailable, // includes instantly available
  };
}
