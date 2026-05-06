import { Customer } from "@/types/customer";

export const customers: Customer[] = [
  { id: "c1", name: "Rajesh Kumar", mobile: "9876543210", email: "rajesh@example.com", addresses: [{ id: "a1", address1: "12, MG Road", address2: "", city: "Bangalore", state: "Karnataka", pincode: "560001", landmark: "" }] },
  { id: "c2", name: "Priya Sharma", mobile: "9876543211", email: "priya@example.com", addresses: [{ id: "a2", address1: "45, Nehru Nagar", address2: "", city: "Mumbai", state: "Maharashtra", pincode: "400001", landmark: "" }] },
  { id: "c3", name: "Amit Patel" , mobile: "9876543212", email: "amit@example.com", addresses: [{ id: "a3", address1: "78, Gandhi Street", address2: "", city: "Delhi", state: "Delhi", pincode: "110001", landmark: "" }] },
  { id: "c4", name: "Sneha Reddy", mobile: "9876543213", email: "sneha@example.com", addresses: [{ id: "a4", address1: "23, Lake View", address2: "", city: "Hyderabad", state: "Telangana", pincode:"500001", landmark: "" }] },
  { id: "c5", name: "Vikram Singh", mobile: "9876543214", email: "vikram@example.com", addresses: [{ id: "a5", address1: "56, Park Avenue", address2: "", city: "Pune", state: "Maharashtra", pincode: "411001", landmark: "" }] },
  { id: "c6", name: "Meera Nair", mobile:"9876543215", email: "meera@example.com", addresses: [{ id:"a6", address1:"89, Beach Road", address2:"", city:"Chennai", state:"Tamil Nadu", pincode:"600001", landmark:"" }] }, 
];