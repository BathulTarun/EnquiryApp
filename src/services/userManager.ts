// services/userManager.ts
import {Engineer} from "@/types/engineer";

const USER_KEY = "logged_user";

export const UserManager = {
  setUserName(user: string) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUserName(): string | null {
    const data = localStorage.getItem(USER_KEY);

    if (!data) return null;

    return JSON.parse(data);
  },

  clearUserName() {
    localStorage.removeItem(USER_KEY);
  },
};
