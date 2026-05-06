import { Customer } from "@/types/customer";
import { Address } from "@/types/common";

export const mapCustomerFromApi = (apiResponse: any): Customer | null => {
  if (!apiResponse || !apiResponse.Data) return null;

  const data = apiResponse.Data;

  const address: Address = {
    // id: data.CustomerID,
    label: data.AddressLine1 || "",
    address1: data.AddressLine1 || "",
    address2: data.AddressLine2 || "",
    city: data.City || "",
    state: data.State?.Name || "",
    stateId: data.State?.ID || 0,
    pincode: data.PostalCode || "",
    landmark: "", // not available from backend
    country: data.Country?.Name || "",
    lat: undefined,
    lng: undefined,
    verified: true
  };

  const customer: Customer = {
    id: data.CustomerID,
    name: data.ContactPerson || "",
    mobile: data.MobileFirst || "",
    email: data.Email || "",
    // addresses: [address]
  };

  return customer;
};


export const mapCustomerToApi = (customer: Omit<Customer, "id">) => {
  const address = customer.addresses?.[0];

  return {
    BasicDetails: {
      FirmName: customer.name,
      ContactPerson: customer.name,
      Email: customer.email,
      MobileFirst: customer.mobile,

      City: address?.city || "",
      PostalCode: address?.pincode || "",

      State: {
        ID: address?.stateId || 0,   // ⚠️ IMPORTANT
        Name: address?.state // optional (backend usually ignores or fills)
      },

      Country: {
        ID: 1,
        Name: "India"
      },



      AddressLine1: address?.address1 || "",
      AddressLine2: address?.address2 || "",
      LandMark: address?.landmark || "",

    },
     IdentityInformation: {
    Username: customer.mobile,
    Password: customer.mobile,
    ConfirmPassword: customer.mobile
  }
  };
};