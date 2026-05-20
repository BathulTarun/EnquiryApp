import { Enquiry } from "@/types/enquiry";
import { Customer } from "@/types/customer";
import { Address } from "@/types/common";
import { WorkItem } from "@/types/enquiry";
import { Sub } from "@radix-ui/react-context-menu";
import { mapCustomerFromApi } from "./CustomerPayloadMapper";

export const mapEnquiryToApi = (enquiry: Enquiry) => {
  return {
    Ledger: {
      // CustomerID: Number(enquiry.customer?.id),
    CustomerID:enquiry.customer?.id,
      FirmName: enquiry.customer?.name,
      ContactPerson: enquiry.customer?.name,
      MobileFirst: enquiry.customer?.mobile,
      Email: enquiry.customer?.email,
      AddressLine1: enquiry.address?.address1,
      City: enquiry.address?.city,
      State: enquiry.address?.stateId || 0,
      PostalCode: enquiry.address?.pincode,
      landmark: enquiry.address?.landmark || "",
      Country: null,
    },

    Location: {
      // LocationID:Number(enquiry.address?.id) || 0,
       LocationID: enquiry.addressId ,
      label: null,
      AddressLine1: enquiry.address?.address1,
      AddressLine2: enquiry.address?.address2 || "",
      City: enquiry.address?.city,
      State: enquiry.address?.stateId || 0,
      PostalCode: enquiry.address?.pincode,
      Landmark: enquiry.address?.landmark || "",
      Country: null,
    },

    Notes: enquiry.description || "",

    Status: enquiry.status || "Pending",

    Remarks: enquiry.description || "",

    ProblemDescription: enquiry.workItems?.map((item) => ({
      CategoryID: Number(item.id), 
      SubCategoryID: Number(item.subCategoryID), 
      ProductID: item.productsId, 
      Description: item.name,
      Images: item.images || [],
      Price: item.unitPrice || 0,
    })) || [],

    StatusHistory: enquiry.statusHistory?.map((s) => ({
      Status: s.status,
      Timestamp: s.timestamp,
      Remarks: s.remarks || "",
    })) || [],

    SiteVisit: {
      ScheduledDate: enquiry.siteVisit?.scheduledDate,
      ScheduledSlots: enquiry.siteVisit?.scheduledTime,
      // LocationID: Number(enquiry.address?.id) || 0,
      LocationID: enquiry.address?.id ,
      AssignedTo: Number(enquiry.assignedEngineerId) || 0,
      Notes: enquiry.siteVisit?.remarks || "",
    },
  };
};


export const mapEnquiryFromApi = (apiEnquiry: any): Enquiry => {

  const customer: Customer = {
    id: apiEnquiry.Ledger?.CustomerID,
    name: apiEnquiry.Ledger?.ContactPerson || "",
    mobile: apiEnquiry.Ledger?.MobileFirst || "",
    email: apiEnquiry.Ledger?.Email || "",
    mobile2:apiEnquiry.Ledger?.MobileSecond || "",
  };

  const address:Address={
    id: apiEnquiry.Location.LocationID, // backend ID
  address1: apiEnquiry.Location.AddressLine1,
  address2: apiEnquiry.Location.AddressLine2 || "",
  customerID:apiEnquiry.Location.LedgerID,
  city: apiEnquiry.Location.City,
  state: apiEnquiry.Location.StateName,
  stateId: apiEnquiry.Location.StateID,
  pincode: apiEnquiry.Location.PostalCode,
  landmark: apiEnquiry.Location.LandMark || "",
  lat:  apiEnquiry.Location.Latitude, // not provided
  lng:  apiEnquiry.Location.Longitude,
  addressType: apiEnquiry.Location.Name || "Home",
  verified: true, // sin
  }

  return {
    id: apiEnquiry.ID?.toString(),
    EnquiryNumber:apiEnquiry.EnquiryNumber, 
    customer:customer, // not provided
    customerId:apiEnquiry.LedgerID,
    address:address,

    workItems: apiEnquiry.ProblemDescription?.map((item: any, i: number) => ({
      id: i.toString(),
      name: item.Description || "",
      productsId:item.ProductID,
      CategoryID:item.CategoryID,
      subCategoryID:item.SubCategoryID,
      quantity: item.Quantity,
      unitPrice: item.Price,
      images: item.Images || [],
      notes: item.Notes,
      measurement: item.Unit
    })) || [],

    description: apiEnquiry.Notes  || "",
    
    
    siteVisit: apiEnquiry.SiteVisit
      ? {
          id:apiEnquiry.SiteVisit.ID,
          scheduledDate: apiEnquiry.SiteVisit.ScheduledDate,
          scheduledTime: apiEnquiry.SiteVisit.ScheduledSlots,
          engineerId: apiEnquiry.SiteVisit.AssignedTo,
          contactNumber: "",
          rescheduleReason: apiEnquiry.SiteVisit.Notes
        }
      : undefined,

    status: apiEnquiry.Status,

    statusHistory: [],

    // remarks: apiEnquiry.Remarks ? [apiEnquiry.Remarks] : [],

    assignedEngineerId: apiEnquiry.AssignedTo,

    images:
      apiEnquiry.ProblemDescription?.flatMap((x: any) => x.Images || []) || [],
      
  };
};


export const mapUpdatedEnquiryToApi = (
  enquiry: Enquiry,
  workItems: WorkItem[],
  status?: string
) => {

  return {
    ID: Number(enquiry.id),

    EnquiryNumber: enquiry.EnquiryNumber || null,

    LedgerID: enquiry.customer.id,

    LocationID: enquiry.address.id,

    SiteVisit: {
      ID: enquiry.siteVisit.id,
      EnquiryID: Number(enquiry.id),

      ScheduledDate: enquiry.siteVisit.scheduledDate,

      ScheduledSlots: enquiry.siteVisit.scheduledTime,

      LocationID: enquiry.address.id,

      AssignedTo: enquiry.siteVisit.engineerId,

      Notes: enquiry.siteVisit.remarks || "",
    },

    ProblemDescription: workItems.map((item) => ({
      CategoryID: item.CategoryID || 0,

      SubCategoryID: item.subCategoryID || 0,

      ProductID: item.productsId || "",

      Description: item.name || "",

      Images: item.images || [],

      Price: item.unitPrice || 0,

      Quantity: item.quantity || null,

      Notes: item.notes || "",

      Unit: item.measurement || "",
    })),

    StatusHistory: [
      ...(enquiry.statusHistory || []),

      {
        Status: status || enquiry.status,

        Timestamp: new Date().toISOString(),

        UpdatedBy: enquiry.assignedEngineerId || null,

        Remarks: "Updated by operator",
      },
    ],

   Notes: enquiry.description || "",
    Status: status || enquiry.status,
  };
};