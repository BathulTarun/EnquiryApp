import { Enquiry } from "@/types/enquiry";
import { customers } from "@/data/customer.mock";
import { WorkType } from "@/types/common";


const now = new Date();
const d = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();
export const enquiries: Enquiry[] = [
  {
    id: "enq1",
    address: customers[0].addresses[0],
    customer: customers[0],
    // customerId:"c1",
    // customerName:"Rajesh Kumar",
    // customerMobile:"9876543210",
    // customerEmail:"rajesh@example.com",
    workTypes: [
      { id: "wt-1", name: "Electrical", selectedSubOption: "Option 1" },
    ],
    description: "Complete house rewiring needed",
    status: "SiteVisitScheduled",
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
      { status: "SiteVisitScheduled", timestamp: d(3), remarks: "Scheduled for next week" },
    ],

    remarks: [
      { id: "r1", text: "Customer prefers morning visits", timestamp: d(4), author: "Admin" },
    ],
  },

  {
    id: "enq2",
    address: customers[1].addresses[0],
    customer: customers[1],
    // customerId:"c2",
    // customerName:"Priya Sharma",
    // customerMobile:"9876543211",
    // customerEmail:"priya@example.com",
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
    customer: customers[2],
    // customerId:"c3",
    // customerName:"Amit Patel",
    // customerMobile:"9876543212",
    // customerEmail:"amit@example.com",
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
      { status: "SiteVisitScheduled", timestamp: d(13) },
      { status: "SiteVisitCompleted", timestamp: d(10) },
      { status: "ReadyForQuotation", timestamp: d(5) },
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
    customer: customers[3],
    // customerId:"c4",
    // customerName:"Sneha Reddy",
    // customerMobile:"9876543213",
    // customerEmail:"sneha@example.com",
    workTypes: [
      { id: "wt-1", name: "Electrical", selectedSubOption: "Option 2" },
    ],
    description: "Upgrade main electrical panel",
    status: "SiteVisitRescheduled",
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
      { status: "SiteVisitScheduled", timestamp: d(6) },
      { status: "SiteVisitRescheduled", timestamp: d(1), remarks: "Customer not available" },
    ],

    remarks: [
      { id: "r4", text: "Rescheduled due to customer request", timestamp: d(1), author: "Admin" },
    ],
  },

  {
    id: "enq5",
    address: customers[4].addresses[0],
    customer: customers[4],
    // customerId:"c5",
    // customerName:"Vikram Singh",
    // customerMobile:"9876543214",
    // customerEmail:"vikram@example.com",
    workTypes: [
      { id: "wt-4", name: "Civil", selectedSubOption: "Option 1" },
    ],
    description: "Bathroom renovation project",
    status: "SiteVisitCompleted",
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
      { status: "SiteVisitScheduled", timestamp: d(7) },
      { status: "SiteVisitCompleted", timestamp: d(2) },
    ],

    remarks: [],
  },

  {
    id: "enq6",
    address: customers[5].addresses[0],
    customer: customers[5],
    // customerId:"c6",
    // customerName:"Rajesh Kumar",
    // customerMobile:"9876543210",
    // customerEmail:"rajesh@example.com",
    workTypes: [
      { id: "wt-2", name: "Plumbing", selectedSubOption: "Option 2" },
    ],
    description: "Complete bathroom plumbing",
    status: "ReadyForQuotation",
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
      { status: "SiteVisitScheduled", timestamp: d(10) },
      { status: "SiteVisitCompleted", timestamp: d(6) },
      { status: "ReadyForQuotation", timestamp: d(1) },
    ],

    remarks: [
      { id: "r5", text: "High-end fixtures requested", timestamp: d(5), author: "Admin" },
    ],
  },
];



// export const WORK_TYPES: WorkType[] = [
//   {
//     id: "wt-1",
//     name: "Aluminium Work",
//     subOptions: ["Sliding", "Openable"],
//   },
//   {
//     id: "wt-2",
//     name: "SS Railing",
//     subOptions: ["Steel", "Glass"],
//   },
//   {
//     id: "wt-3",
//     name: "Bathroom Door",
//     subOptions: ["PVC", "Aluminium"],
//   },
//   {
//     id: "wt-4",
//     name: "Wooden Door",
//     subOptions: ["Teak", "Plywood"],
//   },
//   {
//     id: "wt-5",
//     name: "Glass Work",
//     subOptions: ["Toughened", "Laminated"],
//   },
//   {
//     id: "wt-6",
//     name: "ACP Work",
//     subOptions: ["Exterior", "Interior"],
//   },
//   {
//     id: "wt-7",
//     name: "Modular Kitchen",
//     subOptions: ["L Shape", "U Shape"],
//   },
//   {
//     id: "wt-8",
//     name: "Room Interior",
//     subOptions: ["Full", "Partial"],
//   },
//   {
//     id: "wt-9",
//     name: "UPVC Windows & Doors",
//     subOptions: ["Sliding", "Casement"],
//   },
//   {
//     id: "wt-10",
//     name: "Steel Work",
//     subOptions: ["Fabrication", "Welding"],
//   },
// ];

export const SUB_OPTIONS: Record<string, string[]> = {
   Windows: ["Sliding", "Openable"],
  Doors: ["Wood", "PVC", "Steel", "Aluminium"],
};