import { Quotation } from "@/types/quotation";



const now = new Date();
const d = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();

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