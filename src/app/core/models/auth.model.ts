export interface Auth {
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  expiracion: string;
}