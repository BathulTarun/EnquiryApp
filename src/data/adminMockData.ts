
import { Customer } from '@/types/customer';
import { Enquiry } from '@/types/enquiry';
import { Engineer } from '@/types/engineer';
import { Quotation } from '@/types/quotation';

export const customers: Customer[] = [
  { id: "c1", name: "Rajesh Kumar", mobile: "9876543210", email: "rajesh@example.com", addresses: [{ id: "a1", address1: "12, MG Road", address2: "", city: "Bangalore", state: "Karnataka", pincode: "560001", landmark: "" }] },
  { id: "c2", name: "Priya Sharma", mobile: "9876543211", email: "priya@example.com", addresses: [{ id: "a2", address1: "45, Nehru Nagar", address2: "", city: "Mumbai", state: "Maharashtra", pincode: "400001", landmark: "" }] },
  { id: "c3", name: "Amit Patel" , mobile: "9876543212", email: "amit@example.com", addresses: [{ id: "a3", address1: "78, Gandhi Street", address2: "", city: "Delhi", state: "Delhi", pincode: "110001", landmark: "" }] },
  { id: "c4", name: "Sneha Reddy", mobile: "9876543213", email: "sneha@example.com", addresses: [{ id: "a4", address1: "23, Lake View", address2: "", city: "Hyderabad", state: "Telangana", pincode:"500001", landmark: "" }] },
  { id: "c5", name: "Vikram Singh", mobile: "9876543214", email: "vikram@example.com", addresses: [{ id: "a5", address1: "56, Park Avenue", address2: "", city: "Pune", state: "Maharashtra", pincode: "411001", landmark: "" }] },
  { id: "c6", name: "Meera Nair", mobile:"9876543215", email: "meera@example.com", addresses: [{ id:"a6", address1:"89, Beach Road", address2:"", city:"Chennai", state:"Tamil Nadu", pincode:"600001", landmark:"" }] }, 
];

export const engineers: Engineer[] = [  
  { id: "e1", name: "Suresh Babu", phone: "9988776601", username: "suresh", password: "pass123", email: "suresh@company.com", status: "Available", specialization: "Electrical" },
  { id: "e2", name: "Ramesh Iyer", phone: "9988776602", username: "ramesh", password: "pass123", email: "ramesh@company.com", status: "Busy", specialization: "Plumbing" },
  { id: "e3", name: "Karthik Menon", phone: "9988776603", username: "karthik", password: "pass123", email: "karthik@company.com", status: "Available", specialization: "HVAC" },
  { id: "e4", name: "Deepak Joshi", phone: "9988776604", username: "deepak", password: "pass123", email: "deepak@company.com", status: "Busy", specialization: "Civil" },
];

const now = new Date();
const d = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();

export const enquiries: Enquiry[] = [
  {
    id: "enq1",
    address: customers[0].addresses[0],
    // customer: customers[0],
    workTypes: [
      { id: "wt-1", name: "Electrical", selectedSubOption: "Option 1" },
    ],
    description: "Complete house rewiring needed",
    status: "Site Visit Scheduled",
    assignedEngineerId: "e1",
    createdAt: d(5),
    updatedAt: d(3),

    siteVisit: {
      scheduledDate: d(3).split("T")[0],
      scheduledTime: "10:00 AM - 11:00 AM",
      contactNumber: "9876543210",
      address: customers[0].addresses[0],
      engineerId: "e1",
    },

    workItems: [
      { id: "w1", name: "Kitchen Sink Pipe", measurement: "", quantity: "1", notes: "" },
      { id: "w2", name: "Bathroom Drainage", measurement: "", quantity: "1", notes: "" },
    ],

    statusHistory: [
      { status: "Pending", timestamp: d(5) },
      { status: "Site Visit Scheduled", timestamp: d(3), remarks: "Scheduled for next week" },
    ],

    remarks: [
      { id: "r1", text: "Customer prefers morning visits", timestamp: d(4), author: "Admin" },
    ],
  },

  {
    id: "enq2",
    address: customers[1].addresses[0],
    // customer: customers[1],
    workTypes: [
      { id: "wt-2", name: "Plumbing", selectedSubOption: "Option 1" },
    ],
    description: "Kitchen pipe leakage",
    status: "Pending",
    createdAt: d(2),
    updatedAt: d(2),
    assignedEngineerId: "e2",

    siteVisit: {
      scheduledDate: d(2).split("T")[0],
      scheduledTime: "12:00 PM - 01:00 PM",
      contactNumber: "9876543211",
      address: customers[1].addresses[0],
    },

    workItems: [
      { id: "w3", name: "Main Board Wiring", measurement: "", quantity: "1", notes: "" },
      { id: "w4", name: "Room Switch Points", measurement: "", quantity: "1", notes: "" },
    ],

    statusHistory: [{ status: "Pending", timestamp: d(2) }],
    remarks: [],
  },

  {
    id: "enq3",
    address: customers[2].addresses[0],
    // customer: customers[2],
    // subType: "AC Installation",
    workTypes: [
      { id: "wt-3", name: "HVAC", selectedSubOption: "Option 2" },
    ],
    description: "Install split AC in 3 rooms",
    status: "Completed",
    assignedEngineerId: "e3",
    createdAt: d(15),
    updatedAt: d(1),

    siteVisit: {
      scheduledDate: d(13).split("T")[0],
      scheduledTime: "02:00 PM - 03:00 PM",
      contactNumber: "9876543212",
      address: customers[2].addresses[0],
      engineerId: "e3",
    },

    workItems: [
      { id: "w5", name: "Bedroom Wardrobe", measurement: "8ft x 7ft", quantity: "1", notes: "Sliding doors" },
      { id: "w6", name: "Kitchen Cabinet", measurement: "6ft x 3ft", quantity: "1", notes: "" },
    ],

    statusHistory: [
      { status: "Pending", timestamp: d(15) },
      { status: "Site Visit Scheduled", timestamp: d(13) },
      { status: "Site Visit Completed", timestamp: d(10) },
      { status: "Ready For Quotation", timestamp: d(5) },
      { status: "Completed", timestamp: d(1) },
    ],

    remarks: [
      { id: "r2", text: "Customer wants premium brand", timestamp: d(14), author: "Admin" },
      { id: "r3", text: "Quotation approved by customer", timestamp: d(3), author: "Admin" },
    ],
  },

  {
    id: "enq4",
    address: customers[3].addresses[0],
    // customer: customers[3],
    workTypes: [
      { id: "wt-1", name: "Electrical", selectedSubOption: "Option 2" },
    ],
    description: "Upgrade main electrical panel",
    status: "Site Visit Rescheduled",
    assignedEngineerId: "e1",
    createdAt: d(8),
    updatedAt: d(1),

    siteVisit: {
      scheduledDate: d(6).split("T")[0],
      scheduledTime: "11:00 AM - 12:00 AM",
      contactNumber: "9876543213",
      address: customers[3].addresses[0],
      engineerId: "e1",
      rescheduledDate: d(1).split("T")[0],
      rescheduledTime: "02:00 PM",
      rescheduleReason: "Customer not available in the morning",
    },

    workItems: [
      { id: "w7", name: "Living Room Walls", measurement: "", quantity: "1", notes: "Customer prefers off-white" },
    ],

    statusHistory: [
      { status: "Pending", timestamp: d(8) },
      { status: "Site Visit Scheduled", timestamp: d(6) },
      { status: "Site Visit Rescheduled", timestamp: d(1), remarks: "Customer not available" },
    ],

    remarks: [
      { id: "r4", text: "Rescheduled due to customer request", timestamp: d(1), author: "Admin" },
    ],
  },

  {
    id: "enq5",
    address: customers[4].addresses[0],
    // customer: customers[4],
    workTypes: [
      { id: "wt-4", name: "Civil", selectedSubOption: "Option 1" },
    ],
    description: "Bathroom renovation project",
    status: "Site Visit Completed",
    assignedEngineerId: "e4",
    createdAt: d(10),
    updatedAt: d(2),

    siteVisit: {
      scheduledDate: d(9).split("T")[0],
      scheduledTime: "01:00 PM - 02:00 PM",
      contactNumber: "9876543214",
      address: customers[4].addresses[0],
      engineerId: "e4",
    },

    workItems: [
      { id: "w8", name: "Split AC 1.5 Ton", measurement: "1 unit", quantity: "1", notes: "Wall mount, bedroom" },
    ],

    statusHistory: [
      { status: "Pending", timestamp: d(10) },
      { status: "Site Visit Scheduled", timestamp: d(7) },
      { status: "Site Visit Completed", timestamp: d(2) },
    ],

    remarks: [],
  },

  {
    id: "enq6",
    address: customers[5].addresses[0],
    // customer: customers[5],
    workTypes: [
      { id: "wt-2", name: "Plumbing", selectedSubOption: "Option 2" },
    ],
    description: "Complete bathroom plumbing",
    status: "Ready For Quotation",
    assignedEngineerId: "e2",
    createdAt: d(12),
    updatedAt: d(1),

    siteVisit: {
      scheduledDate: d(11).split("T")[0],
      scheduledTime: "03:00 PM - 04:00 PM",
      contactNumber: "9876543215",
      address: customers[5].addresses[0],
      engineerId: "e2",
    },

    workItems: [
      { id: "w9", name: "Overhead Tank Installation", measurement: "", quantity: "1", notes: "" },
    ],

    statusHistory: [
      { status: "Pending", timestamp: d(12) },
      { status: "Site Visit Scheduled", timestamp: d(10) },
      { status: "Site Visit Completed", timestamp: d(6) },
      { status: "Ready For Quotation", timestamp: d(1) },
    ],

    remarks: [
      { id: "r5", text: "High-end fixtures requested", timestamp: d(5), author: "Admin" },
    ],
  },
];

export const quotations: Quotation[] = [
  {
    id: "q1", enquiryId: "enq3",
    items: [
      { id: "qi1", description: "Split AC 1.5 Ton", quantity: "3", unitPrice: 35000 },
      { id: "qi2", description: "Installation Charges", quantity: "3", unitPrice: 3000 },
      { id: "qi3", description: "Copper Piping (per meter)", quantity: "15", unitPrice: 800 },
    ],
   notes: "Warranty: 5 years on compressor", createdAt: d(5),
  },
  {
    id: "q2", enquiryId: "enq6",
    items: [
      { id: "qi4", description: "Premium Basin", quantity: "2", unitPrice: 8000 },
      { id: "qi5", description: "Plumbing Labour", quantity: "1", unitPrice: 15000 },
    ],
    notes: "Materials extra if needed", createdAt: d(1),
  },
];
