// Interface for user registration data
export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}


// Interface for user login data
export interface LoginData {
  username: string;
  password: string;
}

// Interface for user data
export interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

// Interface for user authentication response
export interface AuthResponse {
  token: string;
  user: UserData;
}

export interface ApiResponse<T> {
  status: number;
  message?: string;
  data?: T;
}
