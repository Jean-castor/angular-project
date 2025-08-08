import {Page} from './Page';
import {Profession} from './profession.model';
import {AddressResponseDto} from './address.model';
import {CepResponseDto} from './cep.model/cep.model.component';

export interface User {
  userId?: string;
  username: string;
  surname: string;
  age: string;
  email: string;
  phone: string;
  password?: string;
  addressDto?:  AddressResponseDto;
  cepDto?: CepResponseDto;
  professionDto?: Profession;
}

export type UserPage = Page<User>;
