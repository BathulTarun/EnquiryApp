export interface Engineer {
  id: string;
  name: string;
  username?: string;
  password?: string;
  phone: string;
  email: string;
  status?: "Available" | "Busy";
  specialization?: string;
}