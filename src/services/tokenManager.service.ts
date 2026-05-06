

export class TokenManager {
  static getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  static setToken(token: string) {
    localStorage.setItem("auth_token", token);
  }

  static clearToken() {
    localStorage.removeItem("auth_token");
  }
}