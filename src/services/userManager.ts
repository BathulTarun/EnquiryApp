// services/userManager.ts
import { Engineer } from "@/types/engineer";


const USER_KEY = "logged_user";

export const UserManager = {
  setUser(user: Engineer) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser(): Engineer | null {
    const data = localStorage.getItem(USER_KEY);

    if (!data) return null;

    return JSON.parse(data);
  },

  clearUser() {
    localStorage.removeItem(USER_KEY);
  },
};