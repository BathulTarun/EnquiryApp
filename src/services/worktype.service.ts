// /services/worktype.service.ts

import {Product} from "@/types/common";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;
const TENANT_ID = import.meta.env.VITE_TENANT_ID;
const Package_ID = import.meta.env.VITE_PACKAGE_ID;
const FixedURL = import.meta.env.VITE_API_BASE_URL;

class WorkTypeService {
  static async getCategores(): Promise<string[]> {
    try {
      const response = await fetch(`${FixedURL}/api/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "ngrok-skip-browser-warning": "true",
          company: `${COMPANY_ID}`,
          tenant: `${TENANT_ID}`,
        },
      });
      const data = await response.json();
      // return data.data;
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  static async getSubCategories(categoryId: number) {
    try {
      const response = await fetch(
        `${FixedURL}/api/subcategory/get?category=${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // "ngrok-skip-browser-warning": "true",
            company: `${COMPANY_ID}`,
            tenant: `${TENANT_ID}`,
          },
        },
      );
      const data = await response.json();
      // return data.data;
      return data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return [];
    }
  }

  static async getProductsBySubcategory(
    subcategoryId: number,
  ): Promise<string[]> {
    try {
      const response = await fetch(
        `${FixedURL}/api/products/get?subCategory=${subcategoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // "ngrok-skip-browser-warning": "true",
            company: `${COMPANY_ID}`,
            tenant: `${TENANT_ID}`,
          },
        },
      );
      const data = await response.json();
      // return data.data;
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  static async getProductsByID(productID: string): Promise<Product> {
    try {
      const response = await fetch(
        `${FixedURL}/api/products/getbyuid?UID=${productID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // "ngrok-skip-browser-warning": "true",
            company: `${COMPANY_ID}`,
            tenant: `${TENANT_ID}`,
            Package: `${Package_ID}`,
          },
        },
      );
      const data = await response.json();
      // return data.data;
      return data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return;
    }
  }
}

export default WorkTypeService;
