export interface User {
  _id: string;
  name: string;
  userName: string;
  email: string;
  profileImage?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  userName: string;
  email: string;
  password: string;
}

export interface OtpVerification {
  email: string;
  otp: string;
}


export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}