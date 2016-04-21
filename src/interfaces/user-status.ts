export type UserStatus = 'offline' | 'idle' | 'active' | 'mobile';

export interface UserStatuses {
  fbAppStatus: UserStatus;
  messengerStatus: UserStatus;
  otherStatus: UserStatus;
  status: UserStatus;
  webStatus: UserStatus;
}
