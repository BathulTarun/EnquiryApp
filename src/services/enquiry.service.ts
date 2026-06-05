import {Enquiry, EnquiryStatus, WorkItem} from "@/types/enquiry";
import {Remark} from "@/types/common";
import {enquiries} from "@/data/enquiry.mock";
import {promises} from "dns";

import {mapEnquiryToApi} from "./EnquiryPayloadMapper";
import {TokenManager} from "./tokenManager.service";

// simulate API delay

const BASE_URL = "http://localhost:7071/api";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;
const TENANT_ID = import.meta.env.VITE_TENANT_ID;
const Package_ID = import.meta.env.VITE_PACKAGE_ID;

const FixedURL = import.meta.env.VITE_API_BASE_URL;

export class EnquiryService {
  // Create enquiry (Customer Create Enquiry)
  static async create(enquiry: Enquiry): Promise<string | null> {
    try {
      const payload = mapEnquiryToApi(enquiry);
      const response = await fetch(`${FixedURL}/api/enquiry/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          company: `${COMPANY_ID}`,
          tenant: `${TENANT_ID}`,
          // "Authorization": `Bearer ${token}`,
          Package: `${Package_ID}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create enquiry");
      }

      const result = await response.json();

      return result.Data; //  important
    } catch (error) {
      console.error("Error creating enquiry:", error);
      return null;
    }
  }

  // Update Enquiry (Admin Updates Enquiry)
  static async updateEnquiry(payload: any) {
    try {
      const response = await fetch(`${FixedURL}/api/enquiry/update`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          company: `${COMPANY_ID}`,
          tenant: `${TENANT_ID}`,
          Package: `${Package_ID}`,
        },

        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update enquiry");
      }

      const result = await response.json();
      if (result.Status === "Success") {
        return result;
      }
      return "";
    } catch (error) {
      console.error("Update enquiry error:", error);

      throw error;
    }
  }
}
