import { Address } from "./common";

export interface Customer {
  id?: number;
  name: string;
  mobile: string;
  email: string;
  addresses?: Address[];
}