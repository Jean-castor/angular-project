import {Page} from './Page';

export interface User {
  userId?: string;
  username: string;
  surName: string;
  age: string;
}

export type UserPage = Page<User>;
