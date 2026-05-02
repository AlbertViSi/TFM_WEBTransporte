export interface User {
  id: number;
  username: string;
  email: string;
  role_id: number;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}
