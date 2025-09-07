type profileDto = {
  name: string;
  image: string;
};

export interface PayloadType {
  id: string;
  provider: string;
  email: string;
  role: string;
  profile?: profileDto;
  shop_id?: string;
  memberships_owner_id?: string;
  stripeAccountId?: string;
  iat: number;
  exp: number;
}
