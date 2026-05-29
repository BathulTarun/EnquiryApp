import {useState, useEffect} from "react";

import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Customer} from "@/types/customer";
import {Enquiry} from "@/types/enquiry";
import {Quotation} from "@/types/quotation";
import {EnquiryService} from "@/services/enquiry.service";
import {CustomerService} from "@/services/customer.service";
import {QuotationService} from "@/services/quotation.service";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Plus, FileText, ArrowLeft} from "lucide-react";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";

const QuotationsPage = () => {
  const [enquiriesList, setEnquriesList] = useState<Enquiry[] | null>([]);
  const [customersList, setCustomersList] = useState<Customer[] | null>([]);
  const [quotationsList, setQuotationsList] = useState<Quotation[] | null>([]);

  useEffect(() => {
    const enquiries = async () => {
      const res = await EnquiryService.getAllEnquiries();
      setEnquriesList(res);
    };
    enquiries();
    const customers = async () => {
      const res = await CustomerService.getAllCustomers();
      setCustomersList(res);
    };
    customers();
    const quotations = async () => {
      const res = await QuotationService.getAll();
      setQuotationsList(res);
    };
    quotations();
  }, []);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  //  Get customer + enquiry label
  const getEnquiryLabel = (eId: string) => {
    const enq = enquiriesList.find((e) => e.id === eId);
    const cust = enq
      ? customersList.find((c) => c.id === enq.customer.id)
      : undefined;

    return cust
      ? `${cust.name} – ${enq?.workTypes.map((wt) => wt.name).join(", ")}`
      : eId;
  };

  // Ready enquiries
  const readyEnquiries = enquiriesList.filter((e) => {
    const hasQuotation = quotationsList.some((q) => q.enquiryId === e.id);
    return e.status === "Ready For Quotation" && !hasQuotation;
  });

  //  Filter quotations
  const filteredQuotations = quotationsList.filter((q) => {
    const label = getEnquiryLabel(q.enquiryId).toLowerCase();

    if (search && !label.includes(search.toLowerCase())) return false;

    return true;
  });

  return (
    <div className=" space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
          Quotations
        </h2>
        <Button onClick={() => navigate("/admin/quotations/create")}>
          <Plus className="h-4 w-4 mr-1" />
          New Quotation
        </Button>
      </div>

      {/*  ENQUIRIES READY FOR QUOTATION */}
      {readyEnquiries.length > 0 && (
        <Card>
          <CardContent className="pt-4 pb-4">
            <h3 className="text-sm font-semibold mb-2">
              Enquiries Ready for Quotation
            </h3>

            {readyEnquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No enquiries are ready for quotation
              </p>
            ) : (
              <div className="space-y-2">
                {readyEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {getEnquiryLabel(enq.id)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {enq.workTypes.map((wt) => wt.name).join(",")}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(`/admin/quotations/create?enquiryId=${enq.id}`)
                      }
                    >
                      Create
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* SEARCH + FILTER */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3">
            <Input
              placeholder="Search by customer or enquiry"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/*  QUOTATION TABLE */}
      <Card>
        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Customer</th>
                <th className="text-left py-3 px-2">Enquiry</th>
                <th className="text-right py-3 px-2">Amount</th>

                <th className="text-left py-3 px-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredQuotations.map((q) => {
                const sub = q.items.reduce((s, i) => s + i.unitPrice, 0);

                return (
                  <tr
                    key={q.id}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/admin/quotations/${q.id}`)}
                  >
                    <td className="py-3 px-2 font-medium">
                      {getEnquiryLabel(q.enquiryId)}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {q.enquiryId}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      ₹{sub.toLocaleString()}
                    </td>

                    <td className="py-3 px-2 text-muted-foreground">
                      {format(new Date(q.createdAt), "dd MMM yyyy")}
                    </td>
                  </tr>
                );
              })}

              {filteredQuotations.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No quotations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotationsPage;
