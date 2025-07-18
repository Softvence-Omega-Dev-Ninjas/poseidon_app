type ProfileType = {
  name: string;
  image: string;
};

export interface UserInfoType {
  id: string;
  provider: string;
  email: string;
  password: string;
  role: true;
  profile: ProfileType;
}
