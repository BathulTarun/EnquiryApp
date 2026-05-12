export interface Address {
  id?: number;
  placeId?: string; // For Google Places API
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

export interface ProductOption {
  id: string;
  name: string;
  price?: number;
}

export interface SubCategory  {
  id: string;   // product UID
  name: string; // product Name
  products?: ProductOption[];
  price?: number; // optional, can be fetched from backend if not provided
}


export interface SelectedProduct  {
  id: string;
  name: string;
  price?: number;
}

export interface WorkType {
  id?: string;
  name: string;
  // subOptions?: SubCategory[];
  subCategories?: SubCategory[];
   selectedSubCategory?: {
    id: string;
    name: string;
  };
  // selectedSubOption?: SelectedProduct;
  selectedProduct?: SelectedProduct;
}