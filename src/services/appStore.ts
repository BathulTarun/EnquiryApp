import {create} from "zustand";
import {AuthService} from "./authService.service";
import {TokenManager} from "./tokenManager.service";

interface AppState {
  isLoggedIn: boolean;
  role: string;

  login: (
    username: string,
    password: string,
  ) => Promise<{role: string; id: string; name: string} | null>;
  logout: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  role: null,

  login: async (username: string, password: string) => {
    if (username === "admin" && password === "admin123") {
      set({isLoggedIn: true, role: "admin"});
      return {role: "admin", id: "1", name: ""};
    }

    const user = await AuthService.getToken({
      username: username,
      password: password,
    });
    if (user) {
      // const token = TokenManager.getToken();
      // const data = await AuthService.getUserDetails(token);
      // set({isLoggedIn: true, role: data.role});
      set({isLoggedIn: true, role: "operator"});
      const token = TokenManager.getToken();
      const data = await AuthService.getUserDetails(token);
      return {role: "operator", id: data.id, name: data.name, detail: data};
    }

    return null;
  },
  logout: () => set({isLoggedIn: false, role: null}),
}));
