export interface QuotationItem {
  id: string;
  description: string;
  quantity: string;
  unitPrice: number;
}

export interface Quotation {
  id: string;
  enquiryId: string;
  items: QuotationItem[];
  notes?: string;
  totalAmount?: number;
  createdAt: string;
}