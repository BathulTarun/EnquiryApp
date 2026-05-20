export interface Engineer {
  id: number;
  name: string;
  username?: string;
  password?: string;
  phone: string;
  email: string;
  status?: "Available" | "Busy";
  specialization?: string;
}