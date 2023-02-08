export interface LoginPayload {
  email: string;
  password: string;
}
export interface LoginValidatePayload {
  email: string;
  password: string;
  otpCode: string;
}

export interface TPermissions {
  name: string;
  type: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  role?: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  permissions: TPermissions[];
}

export interface ForgotPasswordValidatePayload {
  email: string;
}

export interface NewPasswordPayload {
  token: string;
  password: string;
}
