// services/location.service.ts

import { locations } from "@/data/location.mock";
import { Address } from "@/types/common";
import { useState } from "react";
import { CartesianAxis } from "recharts";
import { TokenManager } from "./tokenManager.service";
const BASE_URL = "http://localhost:7071/api";
const COMPANY_ID=import.meta.env.VITE_COMPANY_ID;
const TENANT_ID=import.meta.env.VITE_TENANT_ID;
// const Authorization=import.meta.env.VITE_TOKEN_ID;



const FixedURL= import.meta.env.VITE_API_BASE_URL;



export class LocationService {

static statesCache: any[] | null = null;

  // 🔹 Get all locations
  static async getAll(): Promise<Address[]> {
    try{
      const response=await fetch(
        `${BASE_URL}/getlocations`,
        {
          method:"GET",
            headers:{
                "company":`${COMPANY_ID}`,
                "tenant":`${TENANT_ID}`,
            }
        }
      );
      
    if(!response.ok){
      throw new Error("Failed to fetch types");
    }

    const result = await response.json();
     const locations:Address[]= result.data;
      return  locations;
    }catch(error){
    console.error("Error fetching types:", error)
    return [];
  }
    
  }

  // 🔹 Search locations
  static async search(query: string): Promise<Address[]> {
  //   if (!query || query.length < 2) return [];

  //    try {
  //   const response = await fetch(
  //     `${BASE_URL}/getlocations?search=${query}`,
  //     {
  //        method:"GET",
  //           headers:{
  //               "company":`${COMPANY_ID}`,
  //               "tenant":`${TENANT_ID}`,
  //           }
  //     }

  //   );

  //   if (!response.ok) throw new Error("Search failed");

  //    const result = await response.json();
  //    const locations:Address[]= result.data;
  //     return  locations;
  // } catch (error) {
  //   console.error("Search error:", error);
  //   return [];
  // }
  if (!query || query.length < 2) return [];

    return new Promise((resolve) => {
      const service = new google.maps.places.AutocompleteService();

      service.getPlacePredictions(
        {
          input: query,
          componentRestrictions: {
            country: "in",
          },
        },
        (predictions, status) => {
          if (
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !predictions
          ) {
            resolve([]);
            return;
          }

const results: Address[] = predictions.map((item, index) => ({
  id: (index),
  placeId: item.place_id,
  label: item.description,
  address1: item.structured_formatting?.main_text || "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  lat: 0,
  lng: 0,
}));

          resolve(results);
        }
      );
    });

    // const lower = query.toLowerCase();

    // return locations.filter((loc) =>
    //   loc.label.toLowerCase().includes(lower) ||
    //   loc.city.toLowerCase().includes(lower) ||
    //   loc.address1.toLowerCase().includes(lower)
    // );
  }

  // 🔹 Get by ID
  // static async getById(id: string): Promise<Address | null> {
  //   return locations.find((l) => l.id === id) || null;
  // }

  static async getPlaceDetails(placeId: string): Promise<Partial<Address>> {
  return new Promise((resolve) => {
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(
      {
        placeId,
        fields: [
          "address_components",
          "geometry",
          "formatted_address",
        ],
      },
      (place, status) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !place
        ) {
          resolve({});
          return;
        }

        let city = "";
        let state = "";
        let pincode = "";
        let landmark = "";


        place.address_components?.forEach((component) => {
          const types = component.types;

          if (types.includes("locality") || types.includes("administrative_area_level_2")) {
            city = component.long_name;
          }

          if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }

          if (types.includes("postal_code")) {
            pincode = component.long_name;
          }

          if (types.includes("sublocality") || types.includes("route")) {
          landmark = component.long_name;
          }
        });

        resolve({
          label: place.formatted_address || "",
          address1: place.formatted_address || "",
          city,
          state,
          pincode,
          landmark,
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0,
        });
      }
    );
  });
}


  static async getStates(): Promise<{ id: number; name: string }[]> {
    if (this.statesCache) {
      return this.statesCache;
    }

    try {
      const response = await fetch(
        `${FixedURL}/api/location/states`,
        {
          method: "GET",
          headers:{
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          }
        }
      );  
      if (!response.ok) {
        throw new Error("Failed to fetch states");
      }
      const result = await response.json();

      this.statesCache = result.Data || [];
      return this.statesCache; // Assuming API returns { data: [...] }
    } catch (error) {
      console.error("Error fetching states:", error);
      return [];
    }
  }


  static async getAllLocationsForCustomer(customerId: Number): Promise<Address[]> {
    try {
      //  const token = TokenManager.getToken();
      const response = await fetch(
        // `${FixedURL}/api/location/search`,
        `${FixedURL}/api/enquiry/get-locations?id=${customerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "company":`${COMPANY_ID}`,
            "tenant":`${TENANT_ID}`,
            // "Authorization": `Bearer ${token}`,
            "Package":`ecommerce.mobile.andhrakitchenwares.com`,
          },
        }
      );  
      if (!response.ok) {
        throw new Error("Failed to fetch locations for customer");
      } 
      const result = await response.json();

      const locations: Address[] = result.Data || [];
      return locations; // Assuming API returns { data: [...] }
    } 
    catch (error) {
      console.error("Error fetching locations for customer:", error);
      return [];
    } 
  }
}