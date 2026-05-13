import { Address } from "./common";

export interface Customer {
  id?: number;
  name: string;
  mobile: string;
  mobile2:string;
  email: string;
  addresses?: Address[];
}