import {EnquiryService} from "./enquiry.service";
import {AdminEnquiryService} from "./AdminEnquiry.service";
import {engineers} from "@/data/engineer.mock";
import {Engineer} from "@/types/engineer";
import {Enquiry} from "@/types/enquiry";
import {EnquiryStatus, WorkItem} from "@/types/enquiry";
import {mapEnquiryFromApi} from "./EnquiryPayloadMapper";
import {TokenManager} from "./tokenManager.service";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;
const TENANT_ID = import.meta.env.VITE_TENANT_ID;
const Package_ID = import.meta.env.VITE_PACKAGE_ID;

const FixedURL = import.meta.env.VITE_API_BASE_URL;

export class OperatorService {
  //  Admin Mock  services
  // {
  static async getTasksByEngineer(engineerId: string) {
    return AdminEnquiryService.getByEngineer(engineerId);
    // return CustomerService.getEnquriesByCustomerId(19693);
  }

  static async getEngineerByTask(taskId: string): Promise<Engineer | null> {
    const enquiry = await AdminEnquiryService.getById(taskId);
    if (!enquiry?.assignedEngineerId) return null;

    return engineers.find((e) => e.id === enquiry.assignedEngineerId) || null;
  }

  static async getEngineerById(engineerId: string): Promise<Engineer | null> {
    return engineers.find((e) => e.id === engineerId) || null;
  }

  static async updateTaskStatus(
    taskId: string,
    status: EnquiryStatus,
    note?: string,
  ) {
    await AdminEnquiryService.updateStatus(
      taskId,
      status,
      note || "Updated by Operator",
    );
  }

  static async getAllOperators(): Promise<Engineer[]> {
    return engineers;
  }

  // }

  // Real API services

  static async getEnquriesByOperatorId(operatorID: string) {
    const token = TokenManager.getToken;
    try {
      const response = await fetch(`${FixedURL}/api/enquiry/getbyoperatorid`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          company: `${COMPANY_ID}`,
          tenant: `${TENANT_ID}`,
          Authorization: `Bearer ${operatorID}`,
          Package: `${Package_ID}`,
        },
      });
      if (!response.ok) {
        throw new Error("filed to load");
      }

      const result = await response.json();
      if (result.Status === "Success") {
        const enquiries: Enquiry[] =
          result.Data?.map((item: any) => mapEnquiryFromApi(item)) || [];
        return enquiries;
      } else {
        return null;
      }
    } catch (error) {
      console.error("failed to get customer", error);
      return null;
    }
    // return await EnquiryService.getByCustomer(customerID);
  }

  static async updateEnquiry(payload: any) {
    return await EnquiryService.updateEnquiry(payload);
  }

  static async uploadImages(
    files: File[],
    productID: string,
    EnquiryID: string,
  ): Promise<string[]> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("file", file);
    });

    formData.append("productID", productID);
    formData.append("enquiryID", EnquiryID);
    const response = await fetch(`${FixedURL}/api/enquiry/upload-image`, {
      method: "POST",
      headers: {
        company: `${COMPANY_ID}`,
        tenant: `${TENANT_ID}`,
        Package: `${Package_ID}`,
      },
      body: formData,
    });

    const result = await response.json();

    return result.Data?.Images || [];
  }

  static async deleteImage(
    enquiryID: string,
    productID: string,
    imageUrl: string,
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${FixedURL}/api/enquiry/delete-image?enquiryID=${enquiryID}&productID=${productID}&imageUrl=${encodeURIComponent(imageUrl)}`,
        {
          method: "DELETE",
          headers: {
            company: `${COMPANY_ID}`,
            tenant: `${TENANT_ID}`,
            Package: `${Package_ID}`,
          },
        },
      );

      const result = await response.json();

      return result.Status === "Success";
    } catch (error) {
      console.error("Delete image failed:", error);
      return false;
    }
  }
}
