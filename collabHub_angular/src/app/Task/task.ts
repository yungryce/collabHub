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

export interface UserData {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}


export interface ResponseInfo {
  status: number;
  message?: string;
  data?: any;
}
