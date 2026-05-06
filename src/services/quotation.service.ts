import { QuotationItem } from "@/types/quotation";
import { quotations } from "@/data/quotation.mock";

export interface Quotation {
  id: string;
  enquiryId: string;
  items: QuotationItem[];
  notes?: string;
  createdAt: string;
}

//  Mock DB (you can move this to separate file later)


export class QuotationService {
  
  //  Create quotation
  static async create(data: {
    enquiryId: string;
    items: QuotationItem[];
    notes?: string;
  }): Promise<Quotation> {
    const newQuotation: Quotation = {
      id: `Q-${Date.now()}`,
      enquiryId: data.enquiryId,
      items: data.items,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    quotations.push(newQuotation);

    return newQuotation;
  }

  //  Get all quotations
  static async getAll(): Promise<Quotation[]> {
    return [...quotations];
  }

  //  Get by ID
  static async getById(id: string): Promise<Quotation | null> {
    return quotations.find((q) => q.id === id) || null;
  }

  // Get by enquiryId
  static async getByEnquiryId(enquiryId: string): Promise<Quotation | null> {
    return quotations.find((q) => q.enquiryId === enquiryId) || null;
  }

  // Update quotation
  static async update(
    id: string,
    data: Partial<Quotation>
  ): Promise<Quotation | null> {
    const index = quotations.findIndex((q) => q.id === id);
    if (index === -1) return null;

    quotations[index] = {
      ...quotations[index],
      ...data,
    };

    return quotations[index];
  }

  // Delete quotation
  static async delete(id: string): Promise<boolean> {
    const before = quotations.length;
      quotations.filter((q) => q.id !== id);
    return quotations.length < before;
  }
}