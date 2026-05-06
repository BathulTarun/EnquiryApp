import { Enquiry } from "@/types/enquiry";

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
      CategoryID: Number(item.id), // ⚠️ replace with real mapping
      ProductID: Number(item.productsId), // ⚠️ replace with real mapping
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
  return {
    id: apiEnquiry.ID?.toString(),

    customer: undefined, // not provided

    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      stateId: 0,
      pincode: "",
      landmark: ""
    },

    workItems: apiEnquiry.ProblemDescription?.map((item: any, i: number) => ({
      id: i.toString(),
      name: item.Description || `Product ${item.ProductID}`,
      quantity: item.Quantity,
      unitPrice: item.Price,
      images: item.Images || [],
      notes: item.Notes,
      measurement: item.Unit
    })) || [],

    description: apiEnquiry.Notes || apiEnquiry.Description || "",

    siteVisit: apiEnquiry.SiteVisit
      ? {
          scheduledDate: apiEnquiry.SiteVisit.ScheduledDate,
          scheduledTime: apiEnquiry.SiteVisit.ScheduledSlots,
          engineerId: apiEnquiry.SiteVisit.AssignedTo?.toString(),
          contactNumber: "",
          rescheduleReason: apiEnquiry.SiteVisit.Notes
        }
      : undefined,

    status: apiEnquiry.Status,

    statusHistory: [],

    remarks: apiEnquiry.Remarks ? [apiEnquiry.Remarks] : [],

    assignedEngineerId: apiEnquiry.AssignedEngineerId?.toString(),

    images:
      apiEnquiry.ProblemDescription?.flatMap((x: any) => x.Images || []) || [],
  };
};
