// /services/worktype.service.ts

import { WorkType,Product } from "@/types/common";
// import { WORK_TYPES, SUB_OPTIONS } from "@/data/enquiry.mock";
import { error } from "console";

const BASE_URL = "http://localhost:7071/api";
const COMPANY_ID=import.meta.env.VITE_COMPANY_ID;
const TENANT_ID=import.meta.env.VITE_TENANT_ID;
const Package_ID=import.meta.env.VITE_Package_ID;
const FixedURL= import.meta.env.VITE_API_BASE_URL;

class WorkTypeService {
  

// static async getAll(): Promise<WorkType[]> {
//   try{
//      const response=await fetch(
//           `${BASE_URL}/getworktypes`,
//       {
//           method:"GET",
//             headers:{
//                 "company":`${COMPANY_ID}`,
//                 "tenant":`${TENANT_ID}`,
//             }
//       }
//       );

//     if(!response.ok){
//       throw new Error("Failed to fetch types");
//     }

//     const result= await response.json();

//     const worktypes: WorkType[] = result.data;

//     return worktypes;
  
//   }catch(error){
//     console.error("Error fetching types:", error)
//     return [];
//   }
// }

  // static async getById(id: string): Promise<WorkType | undefined> {
  //   const all = await this.getAll();
  //   return all.find((w) => w.id === id);
  // }




  static async getCategores(): Promise<string[]> {
    try{
        const response=await fetch(
          `${FixedURL}/api/category`,
          {
            method:"GET",
            headers:{
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
              "company":`${COMPANY_ID}`,
              "tenant":`${TENANT_ID}`,
            }
          }
        );
      //    const response=await fetch(
      //     `${BASE_URL}/GetCategories`,
      // {
      //     method:"GET",
      //       headers:{
      //           "company":`${COMPANY_ID}`,
      //           "tenant":`${TENANT_ID}`,
      //       }
      // }
      // );
        const data= await response.json();
        // return data.data; 
        return data;
    }catch(error){
      console.error("Error fetching categories:", error);
      return [];
    } 
  }


    static async getSubCategories(categoryId: number) {
    try {
      const response = await fetch(
        `${FixedURL}/api/subcategory/get?category=${categoryId}`,
        {
          method:"GET",
            headers:{
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
                "company":`${COMPANY_ID}`,
                "tenant":`${TENANT_ID}`,
            }
        }
      );
      // const response = await fetch(
      //   `${BASE_URL}/GetSubCategories?categoryId=${categoryId}`,
      //   {
      //     method:"GET",
      //       headers:{
      //           "company":`${COMPANY_ID}`,
      //           "tenant":`${TENANT_ID}`,
      //       }
      //   }
      // );
      const data= await response.json();
        // return data.data; 
        return data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return [];
    }
  }


  static async getProductsBySubcategory(subcategoryId: number): Promise<string[]> {
    try{
        const response=await fetch(
          `${FixedURL}/api/products/get?subCategory=${subcategoryId}`,
          {
            method:"GET",
            headers:{
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
              "company":`${COMPANY_ID}`,
              "tenant":`${TENANT_ID}`,
            }
          }
        );
      //   const response=await fetch(
      //     `${BASE_URL}/GetProductsBySubCategory?subCategoryId=${subcategoryId}`,
      // {
      //     method:"GET",
      //       headers:{
      //           "company":`${COMPANY_ID}`,
      //           "tenant":`${TENANT_ID}`,
      //       }
      // }
      // );
        const data= await response.json();
        // return data.data; 
         return data;
    }catch(error){
      console.error("Error fetching categories:", error);
      return [];
    } 
  }


   static async getProductsByID(productID: string): Promise<Product> {
    try {
      const response = await fetch(
        `${FixedURL}/api/products/getbyuid?UID=${productID}`,
        {
          method:"GET",
            headers:{
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
                "company":`${COMPANY_ID}`,
                "tenant":`${TENANT_ID}`,
                "Package":`${Package_ID}`,
            }
        }
      );
      const data= await response.json();
        // return data.data; 
        return data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return ;
    }
  }
}

export default WorkTypeService;