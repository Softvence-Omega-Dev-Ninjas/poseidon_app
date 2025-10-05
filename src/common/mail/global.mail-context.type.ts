export type MailTemplateType = 'otp' | 'friend-request' | 'none';

export type MailContext = {
  otp?: string;
  senderName?: string;
  avatarUrl?: string;
  data?: any;
  // it is allow to passing anothers key value that i'm not define yet
  [key: string]: string | number | boolean | undefined;
};
