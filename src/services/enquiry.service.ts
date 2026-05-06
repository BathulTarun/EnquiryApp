
import {
  Enquiry,
  EnquiryStatus,
  WorkItem,
} from "@/types/enquiry";
import {Remark } from "@/types/common";
import { enquiries } from "@/data/enquiry.mock";
import { promises } from "dns";

import {mapEnquiryToApi} from "./EnquiryPayloadMapper"
import { TokenManager } from "./tokenManager.service";

// simulate API delay

const BASE_URL= "http://localhost:7071/api";
const COMPANY_ID=import.meta.env.VITE_COMPANY_ID;
const TENANT_ID=import.meta.env.VITE_TENANT_ID;



const FixedURL= import.meta.env.VITE_API_BASE_URL;

export class EnquiryService {

  //Get All enquiries
  static async getAllEnquiries(): Promise<Enquiry[]> {
    return enquiries;
  }


  //  Get enquiry by ID
  static async getById(id: string): Promise<Enquiry | null> {
   
    const enquiry = enquiries.find((e) => e.id === id);
    return enquiry || null;
  }

  //  Get enquiries by customer ID
  // static async getByCustomer(customerId: string): Promise<Enquiry[]> {
   
  //   return enquiries.filter((e) => e.customer.id === customerId);
  // }

  //  Get enquiries by mobile
  static async getByMobile(mobile: string): Promise<Enquiry[]> {
    
    return enquiries.filter((e) => e.customer.mobile === mobile);
  }

  //  Get enquiries by engineer
  static async getByEngineer(engineerId: string): Promise<Enquiry[]> {
   
    return enquiries.filter((e) => e.assignedEngineerId === engineerId);
  }


  //Get enquiries by status
  static async getByStatus(status: EnquiryStatus): Promise<Enquiry[]> {
    return enquiries.filter((e) => e.status === status);
  }

  // Create enquiry (based on addEnquiry)
  static async create(enquiry: Enquiry): Promise<string | null> {
   
    try {
      const token = TokenManager.getToken();
    // const response = await fetch(`${BASE_URL}/CreateEnquiry`, {
    //   method: "POST",
    //   headers: {
    //    "Content-Type":"application/json",
    //         "company":`${COMPANY_ID}`,
    //         "tenant":`${TENANT_ID}`,
    //   },
    //   body: JSON.stringify({
    //     ...enquiry,
    //     createdAt: enquiry.createdAt || new Date().toISOString(),
    //     updatedAt: new Date().toISOString(),
    //   }),
    // });
    const payload = mapEnquiryToApi(enquiry);
    console.log("FINAL PAYLOAD:", payload); // 🔥 MUST CHECK
    const response = await fetch(`${FixedURL}/api/enquiry/create`, {
      
      method: "POST",
      headers: {
       "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "Authorization": `Bearer ${token}`,
            "Package":`ecommerce.mobile.andhrakitchenwares.com`,
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

  //  Update enquiry (based on updateEnquiry)
  static async update(
    id: string,
    updates: Partial<Enquiry>
  ): Promise<Enquiry | null> {
   

    const index = enquiries.findIndex((e) => e.id === id);
    if (index === -1) return null;

    enquiries[index] = {
      ...enquiries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return enquiries[index];
  }

  // Update status (based on updateEnquiryStatus)
  static async updateStatus(
    enquiryId: string,
    status: EnquiryStatus,
    note?: string
  ): Promise<void> {
    

    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (!enquiry) return;

    enquiry.status = status;
    enquiry.updatedAt = new Date().toISOString();

    enquiry.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      updatedBy: "Admin",
      remarks: note,
    });
  }

  //  Assign engineer
  static async assignEngineer(
    enquiryId: string,
    engineerId: string
  ): Promise<void> {
    

    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (!enquiry) return;

    enquiry.assignedEngineerId = engineerId;
    enquiry.updatedAt = new Date().toISOString();
  }

  //  Add remark
  static async addRemark(
    enquiryId: string,
    text: string
  ): Promise<void> {
    

    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (!enquiry) return;

    const remark: Remark = {
      id: `r${Date.now()}`,
      text,
      timestamp: new Date().toISOString(),
      author: "Admin",
    };

    enquiry.remarks = [...(enquiry.remarks || []), remark];
  }

  //  Update work items (moved from task logic)
  static async updateWorkItems(
    enquiryId: string,
    items: WorkItem[]
  ): Promise<void> {
   

    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (!enquiry) return;

    enquiry.workItems = items;
  }

  //  Add images
  static async addImages(
    enquiryId: string,
    images: string[]
  ): Promise<void> {
    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (!enquiry) return;

    enquiry.images = [...(enquiry.images || []), ...images];
  }

  //Add images To Work
  static async addWorkItemsImage(enquiryId: string,workitemId:string,images:string[]):Promise<void>{
       const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (!enquiry) return;
    const workItem=enquiry.workItems.find((e)=>e.id === workitemId);
    if(!workItem) return;

     if (!workItem.images) {
    workItem.images = [];
  }
   workItem.images.push(...images);
  }

  //  Submit task (site visit completed)
  static async submitTask(enquiryId: string): Promise<void> {
   

    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (!enquiry) return;

    enquiry.status = "SiteVisitCompleted";
    enquiry.updatedAt = new Date().toISOString();
  }
   
  //Save task (draft)
  static async saveTask(enquiryId: string): Promise<void> { 
    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (!enquiry) return;
    enquiry.updatedAt = new Date().toISOString();
    }

  //  Generate enquiry ID (from your store)
  static generateEnquiryId(): string {
    return `ENQ-${Date.now()}`;
  }
}