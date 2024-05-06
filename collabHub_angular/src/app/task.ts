export interface TaskModel {
  title: string;
  description?: string;
  status: TaskStatus;
  created_by: string;
  start?: Date;
  end?: Date;
  users: string[];
}


export enum TaskStatus {
  START = 'start',
  PAUSE = 'pause',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
  CLOSE = 'close'
}


export interface ResponseInfo {
  status: number;
  message?: string;
  data?: any;
}
