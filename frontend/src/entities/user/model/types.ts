export type UserRole = 'admin' | 'volunteer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthErrorResponse {
  message: string;
}

export interface MessageResponse {
  message: string;
}
