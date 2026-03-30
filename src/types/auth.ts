import type { User } from './user';

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  isVerified?: boolean;
}