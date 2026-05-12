import { Customer } from "./customer";
import { Address, Remark, WorkType } from "./common";

export type EnquiryStatus =
  | 'Pending'
  | 'SiteVisitScheduled'
  | 'SiteVisitRescheduled'
  | 'SiteVisitCompleted'
  | 'ReadyForQuotation'
  | 'Completed';

export const ALL_STATUSES: EnquiryStatus[] = [
  'Pending',
  'SiteVisitScheduled',
  'SiteVisitRescheduled',
  'SiteVisitCompleted',
  'ReadyForQuotation',
  'Completed',
];

export interface StatusEntry {
  status: EnquiryStatus;
  timestamp: string;
  updatedBy?: string;
  remarks?: string;
}



export interface WorkItem {
  id: string;
  productsId?: string; // maps to product UID from ERP
  productName?: string; // for display, can be fetched from backend if not provided
  CategoryID?: number; // maps to work type ID
  subCategoryID?: number; // maps to subcategory ID
  subCategoryName?: string; // for display, can be fetched from backend if not provided
  name: string;
  measurement?: string;
  quantity?: string;
  unitPrice?: number;
  notes?: string;
  isCustom?: boolean;
  images?: string[];
}

export interface SiteVisit {
  scheduledDate: string;
  scheduledTime: string;
  contactNumber?: string;
  address?: Address;
  engineerId?: string;
  rescheduledDate?: string;
  rescheduledTime?: string;
  rescheduleReason?: string;
  remarks?: string;
}


export interface Enquiry {
  id?: string;
  customer?: Customer;
  addressId?: number;
  address: Address;
  workItems?: WorkItem[];
  workTypes?: WorkType[];
  description?: string; // user 
  siteVisit?: SiteVisit;
  statusHistory: StatusEntry[];
  status?: EnquiryStatus;
  remarks?: Remark[];   // admin 
  assignedEngineerId?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}