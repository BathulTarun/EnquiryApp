import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {  Address } from "@/types/common";
import { Customer } from "@/types/customer";
import { WorkType } from "@/types/common";
import { ClipboardList } from "lucide-react";

interface EnquirySummaryProps {
  customer: Customer | null;
  workTypes: WorkType[];
  visitDate?: string;
  visitTime?: string;
  address?: Address | null;
  remarks?: string;
}

const EnquirySummary = ({ customer, workTypes, visitDate, visitTime, address, remarks }: EnquirySummaryProps) => {
  if (!customer && workTypes.length === 0) return null;

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ClipboardList size={20} className="text-primary" />
          Enquiry Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {customer && (
          <div>
            <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-1">Customer</h4>
            <p className="font-medium">{customer.name}</p>
            <p className="text-muted-foreground">{customer.mobile}</p>
          </div>
        )}

        {workTypes.length > 0 && (
          <div>
            <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-2">Work Types</h4>
            <div className="flex flex-wrap gap-1.5">
              {workTypes.map((w) => (
                <Badge key={w.id} variant="secondary" className="text-xs">{w.name}</Badge>
              ))}
            </div>
           {/* {workTypes.map((w) =>
  w.selectedSubOption ? (
    <p
      key={w.id}
      className="text-xs text-muted-foreground mt-1"
    >
      {w.name}: {w.selectedSubOption.name}
    </p>
  ) : null
)} */}

{workTypes.map((w) => (
  <div key={w.id}>
    <p className="text-xs font-medium">
      {w.name}
    </p>

    {w.selectedSubCategory && (
      <p className="text-xs text-muted-foreground">
        {w.selectedSubCategory.name}
      </p>
    )}

    {w.selectedProduct && (
      <p className="text-xs text-primary">
        {w.selectedProduct.name}
      </p>
    )}
  </div>
))}
          </div>
        )}

        {visitDate && (
          <div>
            <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-1">Site Visit</h4>
            <p>{visitDate} at {visitTime}</p>
          </div>
        )}

        {address && (
          <div>
            <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-1">Address</h4>
            <p className="text-muted-foreground">{[address.address1, address.city, address.pincode].filter(Boolean).join(", ")}</p>
          </div>
        )}

        {remarks && (
          <div>
            <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-1">Remarks</h4>
            <p className="text-muted-foreground">{remarks}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnquirySummary;
