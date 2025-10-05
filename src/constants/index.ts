export const appointment = [
  'PENDING',
  'CONFIRMED',
  'RESCHEDULED',
  'REJECTED',
  'CANCELLED',
] as const;
export type AppointmentStatus = (typeof appointment)[number];
