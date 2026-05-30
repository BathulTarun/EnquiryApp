import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Address} from "@/types/common";
import {Customer} from "@/types/customer";
import {WorkType} from "@/types/common";
import {ClipboardList} from "lucide-react";

interface EnquirySummaryProps {
  customer: Customer | null;
  workTypes: WorkType[];
  visitDate?: string;
  visitTime?: string;
  address?: Address | null;
  remarks?: string;
}

const EnquirySummary = ({
  customer,
  workTypes,
  visitDate,
  visitTime,
  address,
  remarks,
}: EnquirySummaryProps) => {
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
            <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-1">
              Customer
            </h4>
            <p className="font-medium">{customer.name}</p>
            <p className="text-muted-foreground">{customer.mobile}</p>
          </div>
        )}

        {workTypes.length > 0 && (
          <div>
            <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-2">
              Work Types
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {workTypes.map((w) => (
                <div
                  key={w.id}
                  className="rounded-md border bg-secondary px-2 py-1"
                >
                  <p className="text-xs font-medium">{w.name}</p>

                  {Object.entries(
                    (w.selectedProduct || []).reduce(
                      (acc, product) => {
                        const key = product.subCategoryName || "Others";

                        if (!acc[key]) {
                          acc[key] = [];
                        }

                        acc[key].push(product.name);

                        return acc;
                      },
                      {} as Record<string, string[]>,
                    ),
                  ).map(([subCategory, products]) => (
                    <div key={subCategory} className="mt-1">
                      <p className="text-xs text-muted-foreground font-medium">
                        {subCategory}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {products.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {visitDate && (
          <div>
            <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-1">
              Site Visit
            </h4>
            <p>
              {visitDate} at {visitTime}
            </p>
          </div>
        )}

        {address && (
          <div>
            <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-1">
              Address
            </h4>
            <p className="text-muted-foreground">
              {[address.address1, address.city, address.pincode]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}

        {remarks && (
          <div>
            <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-1">
              Remarks
            </h4>
            <p className="text-muted-foreground">{remarks}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnquirySummary;
