import {Page} from './Page';
import {Profession} from './profession.model';
import {AddressResponseDto} from './address.model';

export interface User {
  userId?: string;
  username: string;
  surname: string;
  age: string;
  addressDto?:  AddressResponseDto;
  professionDto?: Profession;
}

export type UserPage = Page<User>;
