import { Profile } from 'passport-google-oauth20';

export const providers = ['google', 'x', 'facebook'] as const;
export type Providers = (typeof providers)[number];

type UserProfile = Profile['_json'];
export interface GoogleStrategy extends UserProfile {
  authPrvider: Providers;
}
export type GoogleStrategyUser = Partial<GoogleStrategy> & {};
