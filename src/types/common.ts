export interface Address {
  id?: number;
  customerID?:number;
  label?: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  stateId?: number;
  pincode: string;
  landmark: string;
  lat?: number;
  lng?: number;
  verified?: boolean;
  country?: string;
}

export interface Remark {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

export interface SubOption {
  id: string;   // product UID
  name: string; // product Name
  price?: number; // optional, can be fetched from backend if not provided
}

export interface SelectedSubOption {
  id: string;
  name: string;
  price?: number;
}

export interface WorkType {
  id?: string;
  name: string;
  subOptions?: SubOption[];
  selectedSubOption?: string;
}