export const userSelect = {
  id: true,
  provider: true,
  username: true,
  email: true,
  password: true,
  role: true,
  varify: true,
  stripeAccountId: true,
  profile: {
    select: {
      name: true,
      image: true,
    },
  },
  shop: {
    select: {
      id: true,
    },
  },
  memberships_owner: {
    select: { id: true },
  },
};
