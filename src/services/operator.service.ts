import { EnquiryService } from "./enquiry.service";
import { engineers } from "@/data/engineer.mock";
import { Engineer } from "@/types/engineer";
import { Enquiry } from "@/types/enquiry";
import { EnquiryStatus, WorkItem } from "@/types/enquiry";
import { mapEnquiryFromApi } from "./EnquiryPayloadMapper";
import { CustomerService } from "./customer.service";
import { AuthService } from "./authService.service";
const COMPANY_ID=import.meta.env.VITE_COMPANY_ID;
const TENANT_ID=import.meta.env.VITE_TENANT_ID;



const FixedURL= import.meta.env.VITE_API_BASE_URL;

export class OperatorService {


  static async login(username: string, password: string) {
    return engineers.find(
      (o) => o.username === username && o.password === password
    ) || null;
  }


  static async getTasksByEngineer(engineerId: number) {
    return EnquiryService.getByEngineer(engineerId);
    // return CustomerService.getEnquriesByCustomerId(19693);
  }

  static async getEngineerByTask(taskId: string): Promise<Engineer | null> {
    const enquiry = await EnquiryService.getById(taskId);
    if (!enquiry?.assignedEngineerId) return null;

    return engineers.find(e => e.id === enquiry.assignedEngineerId) || null;
  }

  static async getEngineerById(engineerId: number): Promise<Engineer | null> {
    return engineers.find(e => e.id === engineerId) || null;
  }

  static async updateTaskStatus(taskId: string, status: EnquiryStatus,note?: string) {
    await EnquiryService.updateStatus(taskId, status, note || "Updated by Operator");
  }

  static async updateWorkItems(taskId: string, items: WorkItem[]) {
    await EnquiryService.updateWorkItems(taskId, items);
  }

  static async addWorkItemsImages(taskId: string,workitemId:string, images: string[]) {
    await EnquiryService.addWorkItemsImage(taskId,workitemId, images);
  }

  static async addEnquiryImages(taskId: string, images: string[]) {
    await EnquiryService.addImages(taskId, images);
  }


  static async saveTask(taskId: string) {
    await EnquiryService.saveTask(taskId);
  }

  static async submitTask(taskId: string) {
    await EnquiryService.submitTask(taskId);
  }

  static async getAllOperators(): Promise<Engineer[]> {
    return engineers;
  }


  static async getEnquriesByOperatorId(operatorID: number){
      try{
         const response=await fetch( 
          `${FixedURL}/api/enquiry/getbyoperatorid?id=${operatorID}`,
          {
               method:"GET",
               headers:{
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
                "company":`${COMPANY_ID}`,
                "tenant":`${TENANT_ID}`,
                //  "Authorization": `Bearer ${token}`,
                "Package":"ecommerce.mobile.andhrakitchenwares.com"
               }
          }
        );
         if(!response.ok){
          throw  new Error("filed to load");
         }
  
         const result= await response.json();
         const enquiries: Enquiry[] =
    result.Data?.map((item: any) => mapEnquiryFromApi(item)) || [];
         return enquiries;
      }catch(error){
        console.error("failed to get customer",error)
        return null;
      }
      // return await EnquiryService.getByCustomer(customerID);
     }


  static async updateEnquiry(payload:any){
      return await EnquiryService.updateEnquiry(payload);
  }
}