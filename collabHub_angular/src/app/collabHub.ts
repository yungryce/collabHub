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

export interface UserData {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface TaskModel {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  created_by: string;
  start?: Date;
  end?: Date;
  user_ids: string[];
}

export enum TaskStatus {
  START = 'start',
  PAUSE = 'pause',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
  CLOSE = 'close'
}

// Interface for ApiResponse data map
export interface AuthResponse {
  token: string;
  user: UserData;
}

// Interface for user authentication response
export interface ApiResponse<T> {
  status: number;
  message: string;
  error?: string;
  data?: T;
}

// Gereric response interface
export interface ResponseInfo {
  status: number;
  message: string;
  error?: any;
  data?: any;
}
