import {Enquiry, EnquiryStatus, WorkItem} from "@/types/enquiry";
import {Remark} from "@/types/common";
import {enquiries} from "@/data/enquiry.mock";
export class AdminEnquiryService {
  //  For Admin Mock
  //Get All enquiries
  static async getAllEnquiries(): Promise<Enquiry[]> {
    return enquiries;
  }

  //  Get enquiry by ID
  static async getById(id: string): Promise<Enquiry | null> {
    const enquiry = enquiries.find((e) => e.id === id);
    return enquiry || null;
  }

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

  //  Add remark
  static async addRemark(enquiryId: string, text: string): Promise<void> {
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

  //  Update enquiry (based on updateEnquiry)
  static async update(
    id: string,
    updates: Partial<Enquiry>,
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
    note?: string,
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
    engineerId: string,
  ): Promise<void> {
    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (!enquiry) return;

    enquiry.assignedEngineerId = engineerId;
    enquiry.updatedAt = new Date().toISOString();
  }
}
