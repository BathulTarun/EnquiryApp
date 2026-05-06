

import { TokenManager } from "./tokenManager.service";
import { AuthService } from "./authService.service";


export class ApiService {
  static async request(url: string, options: RequestInit = {}) {
    let token = localStorage.getItem("auth_token");

    // 🔁 If no token → get using stored user
    if (!token) {
      const user = JSON.parse(localStorage.getItem("auth_user") || "{}");

      if (user.username && user.password) {
        token = await AuthService.getToken(user);
      }
    }

    const headers = {
      "Content-Type": "application/json",
      "company": import.meta.env.VITE_COMPANY_ID,
      "tenant": import.meta.env.VITE_TENANT_ID,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // 🔁 Retry if token expired
    if (response.status === 401) {
      const user = JSON.parse(localStorage.getItem("auth_user") || "{}");

      const newToken = await AuthService.getToken(user);

      if (newToken) {
        localStorage.setItem("auth_token", newToken);

        response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      }
    }

    return response;
  }
}