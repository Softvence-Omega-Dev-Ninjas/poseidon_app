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
  iat: number;
  exp: number;
}
