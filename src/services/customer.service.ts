
import { Customer } from "@/types/customer";
import { customers } from "@/data/customer.mock";
import { Address } from "@/types/common";
import { EnquiryService } from "./enquiry.service";
import { Enquiry } from "@/types/enquiry";
import { CartesianGrid } from "recharts";
import { json } from "stream/consumers";
import { ad } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";
import { mapCustomerFromApi ,mapCustomerToApi} from "./CustomerPayloadMapper";
import { mapEnquiryFromApi } from "./EnquiryPayloadMapper";
import { mapAddressToApi } from "./AddressPayloadMapper";
import { TokenManager } from "./tokenManager.service";
const BASE_URL= "http://localhost:7071/api";
const COMPANY_ID=import.meta.env.VITE_COMPANY_ID;
const TENANT_ID=import.meta.env.VITE_TENANT_ID;



const FixedURL= import.meta.env.VITE_API_BASE_URL;

export class CustomerService {
  
  //  Get all customers
  static async getAllCustomers(): Promise<Customer[]> {
    return [...customers]; 
  }

  //  Get customer by ID
  // static async getById(id: string): Promise<Customer | null> {
  //   const customer = customers.find((c) => c.id === id);
  //   return customer || null;
  // }

  //  Get customer by mobile 
  static async getByMobile(mobile: string): Promise<Customer | null> {
    try{
      //  const token = TokenManager.getToken();
      // const response= await fetch(
      //   `${BASE_URL}/getcustomerbymobile?mobile=${mobile}`,
      //   {
      //      method:"GET",
      //     headers:{
      //       "company":`${COMPANY_ID}`,
      //       "tenant":`${TENANT_ID}`,
      //     }
      //   }
      // );
       const response= await fetch(
        `${FixedURL}/api/user/getcustomerbymobile?mobile=${mobile}`,
        {
           method:"GET",
          headers:{
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
              "company":`${COMPANY_ID}`,
              "tenant":`${TENANT_ID}`,
            // "Authorization": `Bearer ${token}`,
            "Package":`ecommerce.mobile.andhrakitchenwares.com`,
          }
        }
      );
      if(!response.ok){
        throw new Error("Failed");
      }

      const result= await response.json();
      // return result || null;
      // console.log(result.Data);
      if(result.Status === "Success"){
        return mapCustomerFromApi(result);
      }
      if (result.Status !== "Success") {
         console.warn("API Error:", result.ErrorMessage);
         }
      return null;
    }catch(error){
      console.error("Failed to fetch customer by mobile:", error);
      return null;
    }

    // const customer = customers.find((c) => c.mobile === mobile);
    // return customer || null;
  }

  // Get Enquiries by mobile
  //  static async getEnquriesByMobile(mobile: string) {
  //    return await EnquiryService.getByMobile(mobile);
  //  }

   //GET Enquiries by Cust ID
   static async getEnquriesByCustomerId(customerID: number){
    try{
      //  const token = TokenManager.getToken();
      // const response=await fetch(
      //   `${BASE_URL}/getenquiriesbyCustomerId?customerId=${customerID}`,
      //   {
      //        method:"GET",
      //        headers:{
      //          "company":`${COMPANY_ID}`,
      //       "tenant":`${TENANT_ID}`,
      //        }
      //   }
      // );
       const response=await fetch( 
        `${FixedURL}/api/enquiry/get?id=${customerID}`,
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


  // Create new customer 
  static async createCustomer(customer: Omit<Customer, "id">): Promise<any | null> {

    try{
      //  const token = TokenManager.getToken();
      // const response= await fetch(
      //   `${BASE_URL}/createcustomer`,
      //   {
      //     method:"POST",
      //     headers:{
      //       "Content-Type":"application/json",
      //       "company":`${COMPANY_ID}`,
      //       "tenant":`${TENANT_ID}`,
      //     },
      //     body: JSON.stringify(customer),
      //   }
      // );

      const payload = mapCustomerToApi(customer);
          // console.log("FINAL PAYLOAD:", payload); // 
          const response = await fetch(
            // `${FixedURL}/api/user/register`,
             `${FixedURL}/api/enquiry/register-customer`,
             {
            
            method: "POST",
            headers: {
             "Content-Type": "application/json",
                  "ngrok-skip-browser-warning": "true",
                  // "Authorization": `Bearer ${token}`,
                  "company":`${COMPANY_ID}`,
                  "tenant":`${TENANT_ID}`,
                  "Package":`ecommerce.mobile.andhrakitchenwares.com`,
            },
            body: JSON.stringify(payload),
          });
      if(!response.ok) throw new Error("Failed to create customer");
      const result = await response.json();
      return result;
    }catch(error){
      console.error("Unable to create customer",error);
      return null;
    }

  }

  // Add address to customer 
static async addAddress( customerId: Number, address: Address): Promise<any | null> {

  try{
    //  const token = TokenManager.getToken();
    // const response= await fetch(
    //   `${BASE_URL}/addaddress`,
    //   {
    //     "method":"POST",
    //     headers:{
    //         "Content-Type":"application/json",
    //         "company":`${COMPANY_ID}`,
    //         "tenant":`${TENANT_ID}`,
    //       },
    //        body: JSON.stringify({
    //         customerId,
    //         address
    //        }),
    //   }
    // );
    const payload = mapAddressToApi(address,customerId);
      const response= await fetch(
      // `${FixedURL}/api/location/create`,
       `${FixedURL}/api/enquiry/create-location`,
      {
        "method":"POST",
        headers:{
            "Content-Type": "application/json",
                  "ngrok-skip-browser-warning": "true",
                  // "Authorization": `Bearer ${token}`,
                  "Package":`ecommerce.mobile.andhrakitchenwares.com`,
                  "company":`${COMPANY_ID}`,
                  "tenant":`${TENANT_ID}`,
          },
           body: JSON.stringify({
            customerId:customerId,
        ...payload
           }),
      }
    );

    if(!response.ok) throw new Error("Failed to add address");

    const result = await response.json();
      return result;
  }catch(error){
    console.error("Error adding address:", error);
    return null;
  }
}


static async createEnquiry(enquiry: Enquiry): Promise<string | null> {
  return await EnquiryService.create(enquiry);
}

}