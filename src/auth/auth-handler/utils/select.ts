export const userSelect = {
  id: true,
  email: true,
  provider: true,
  username: true,
  role: true,
  profile: {
    select: {
      name: true,
      image: true,
      cover_image: true,
      cover_image_offsetY: true,
      address: true,
      city: true,
      country: true,
      postcode: true,
      state: true,
      description: true,
    },
  },
  shop: {
    select: { id: true },
  },
  memberships_owner: { select: { id: true } },
  stripeAccountId: true,
  varify: true,
};
