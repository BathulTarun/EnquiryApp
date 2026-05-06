import { useParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import { enquiries } from "@/data/adminMockData";
import { customers } from "@/data/adminMockData";
import { useEffect, useState } from "react";
import { Quotation } from "@/types/quotation";
import { QuotationService } from "@/services/quotation.service";

export default function QuotationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const[selectedQuotation,setSelectedQuotation]=useState<Quotation | null>();

  useEffect(()=>{
    const quotation=async()=>{
      const res=await QuotationService.getById(id);
      setSelectedQuotation(res);
    };
    quotation();
  })

 



  const getEnquiryLabel = (eId: string) => {
    const enq = enquiries.find((e) => e.id === eId);
    const cust =  customers.find((c) => c.id === enq?.customer?.id);
    return cust ? `${cust.name} – ${enq?.workTypes}` : eId;
  };

  if (!selectedQuotation) {
    return <div className="p-6">Quotation not found</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-1" /> Print
        </Button>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">Quotation Details</h2>

      {/* Enquiry */}
      <p className="text-sm font-medium mb-4">
        {getEnquiryLabel(selectedQuotation.enquiryId)}
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2">Item</th>
              <th className="pb-2 text-right">Qty</th>
              <th className="pb-2 text-right">Price</th>
              <th className="pb-2 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {selectedQuotation.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 max-w-[200px] whitespace-normal break-words">
                  {item.description}
                </td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">
                  ₹{item.unitPrice.toLocaleString()}
                </td>
                <td className="py-2 text-right">
                  ₹{(item.unitPrice).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="text-sm text-right space-y-1 mt-4">
        <p className="font-bold text-base">
          Total: ₹
          {selectedQuotation.items
            .reduce((s, i) => s +  i.unitPrice, 0)
            .toLocaleString()}
        </p>
      </div>

      {/* Notes */}
      {selectedQuotation.notes && (
        <p className="text-sm text-muted-foreground border-t pt-3 mt-4">
          {selectedQuotation.notes}
        </p>
      )}
    </div>
  );
}