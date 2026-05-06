import { create } from "zustand";
import {
  enquiries as mockEnquiries,
  engineers as mockEngineers,
  customers as mockCustomers,
  quotations as mockQuotations,
  customers,
  engineers,
} from "@/data/adminMockData";
import { OperatorService } from "./operator.service";

interface AppState {
  isLoggedIn: boolean;
  role: "admin" | "operator" | "id";

  login: ( username: string, password: string) => Promise<{ role: "admin" | "operator"; id: string } | null>;
  logout: () => void;

}


export const useAppStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
 role: null,
 
  login:async (username: string, password: string) => {
  if (username === "admin" && password === "admin123") {
    set({ isLoggedIn: true, role: "admin" });
    return { role: "admin", id: "admin" };
  }

const eng = await OperatorService.login(username, password);
  if (eng) {
    set({ isLoggedIn: true, role: "operator" });
    return { role: "operator" ,id: eng.id};
  }


  return null;
},
  logout: () => set({ isLoggedIn: false, role: null }),

 
}));
