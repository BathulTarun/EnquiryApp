// services/auth.service.ts

import { TokenManager } from "./tokenManager.service";

const FixedURL= import.meta.env.VITE_API_BASE_URL;

const PackageName = "ecommerce.mobile.andhrakitchenwares.com";
const Platform = "Android";

interface TokenRequest {
  username: string;
  password: string;
}

export class AuthService {
  static async getToken({ username, password }: TokenRequest): Promise<string | null> {
    try {
      const body = new URLSearchParams();
      body.append("UserName", username);   // 👈 dynamic
      body.append("Password", password);   // 👈 dynamic
      body.append("grant_type", "password");
      body.append("Package", PackageName);

      const response = await fetch(`${FixedURL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!response.ok) throw new Error("Token fetch failed");

      const result = await response.json();

      const token = result?.access_token || result?.token;

      if (token) {
        TokenManager.setToken(token);
      }

      return token;
    } catch (error) {
      console.error("Token error:", error);
      return null;
    }
  }

  static async PackageInfo(): Promise<{ package: string } | null> {
    try {
      const response = await fetch(`${FixedURL}/api/package/configuration?package=${PackageName}&platform=${Platform}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) throw new Error("Package info fetch failed");
      const result = await response.json();
      if(result.Data){
        localStorage.setItem("tenant_guids", result.Data.tenant_guids);
        localStorage.setItem("company_guids", result.Data.company_guids);
      }
      return result;
      
    } catch (error) {
      console.error("Package info error:", error);
      return null;
    }
  }
}