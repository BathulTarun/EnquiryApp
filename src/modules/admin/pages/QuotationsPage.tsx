// import { useState } from "react";
// import { useAppStore } from "@/services/appStore";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Plus, Trash2, FileText, Printer } from "lucide-react";
// import { format } from "date-fns";
// import type { QuotationItem } from "@/types/enquiry";
// import { useNavigate } from "react-router-dom";

// const QuotationsPage = () => {
//   const { quotations, enquiries, customers, addQuotation } = useAppStore();
//   const [createOpen, setCreateOpen] = useState(false);
//   const [viewId, setViewId] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const [selectedEnquiry, setSelectedEnquiry] = useState("");
//   const [items, setItems] = useState<QuotationItem[]>([{ id: "1", description: "", quantity: 1, unitPrice: 0 }]);
//   const [taxPercent, setTaxPercent] = useState(18);
//   const [notes, setNotes] = useState("");

//   const addItem = () => setItems([...items, { id: String(Date.now()), description: "", quantity: 1, unitPrice: 0 }]);
//   const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));
//   const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
//     setItems(items.map((i) => i.id === id ? { ...i, [field]: value } : i));
//   };

//   const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
//   const tax = subtotal * taxPercent / 100;
//   const total = subtotal + tax;

//   const handleCreate = () => {
//     if (!selectedEnquiry || items.some((i) => !i.description)) return;
//     addQuotation({ enquiryId: selectedEnquiry, items, notes });
//     setCreateOpen(false);
//     setSelectedEnquiry("");
//     setItems([{ id: "1", description: "", quantity: 1, unitPrice: 0 }]);
//     setNotes("");
//   };

//   const viewQuotation = quotations.find((q) => q.id === viewId);
//   const getEnquiryLabel = (eId: string) => {
//     const enq = enquiries.find((e) => e.id === eId);
//     const cust = enq ? customers.find((c) => c.id === enq.customer.id) : undefined;
//     return cust ? `${cust.name} – ${enq?.workTypes}` : eId;
//   };

//   return (
//     <div className="space-y-4 animate-fade-in">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-medium">Quotations</h2>
//         <Dialog open={createOpen} onOpenChange={setCreateOpen}>
//           <DialogTrigger asChild>
//             <Button className="gap-2" onClick={() => navigate("/admin/quotations/create")}><Plus className="h-4 w-4" />New Quotation</Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader><DialogTitle>Create Quotation</DialogTitle></DialogHeader>
//             <div className="space-y-4">
//               <div>
//                 <Label>Link to Enquiry</Label>
//                 <Select value={selectedEnquiry} onValueChange={setSelectedEnquiry}>
//                   <SelectTrigger><SelectValue placeholder="Select enquiry" /></SelectTrigger>
//                   <SelectContent>
//                     {enquiries.map((e) => (
//                       <SelectItem key={e.id} value={e.id}>{getEnquiryLabel(e.id)}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <Label>Work Items</Label>
//                   <Button variant="outline" size="sm" onClick={addItem}><Plus className="h-3 w-3 mr-1" />Add</Button>
//                 </div>
//                 <div className="space-y-2">
//                   {items.map((item) => (
//                     <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
//                       <Input className="col-span-5" placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} />
//                       <Input className="col-span-2" type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} />
//                       <Input className="col-span-3" type="number" placeholder="Price" value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))} />
//                       <Button variant="ghost" size="icon" className="col-span-2" onClick={() => removeItem(item.id)} disabled={items.length === 1}>
//                         <Trash2 className="h-4 w-4 text-destructive" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                    {/* Tax % */}
//                   {/* <Label>Tax %</Label>
//                   <Input type="number" value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))} /> */}
//                 </div>
//                 <div className="text-right space-y-1 text-sm pt-5">
//                   {/* <p>Subtotal: ₹{subtotal.toLocaleString()}</p>
//                   <p>Tax: ₹{tax.toLocaleString()}</p>
//                   <p className="font-bold text-base">Total: ₹{total.toLocaleString()}</p> */}
//                  <p className="font-bold text-base">Total: ₹{subtotal.toLocaleString()}</p>
//                 </div>
//               </div>

//               <div>
//                 <Label>Notes</Label>
//                 <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." />
//               </div>

//               <Button className="w-full" onClick={handleCreate}>Save Quotation</Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {quotations.map((q) => {
//           const sub = q.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
         
//           return (
//             <Card key={q.id} className="material-shadow cursor-pointer hover:material-shadow-lg transition-shadow" onClick={() => navigate(`/admin/quotations/${q.id}`)}>
//               <CardContent className="p-4 space-y-2">
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-2">
//                     <FileText className="h-4 w-4 text-primary" />
//                     <span className="font-medium text-sm">{getEnquiryLabel(q.enquiryId)}</span>
//                   </div>
//                 </div>
//                 <div className="text-sm text-muted-foreground">
//                   <p>{q.items.length} items</p>
//                   <p className="font-bold text-foreground text-base">₹{(sub ).toLocaleString()}</p>
//                   <p className="text-xs">{format(new Date(q.createdAt), "dd MMM yyyy")}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {quotations.length === 0 && <div className="text-center py-12 text-muted-foreground">No quotations yet.</div>}

//       {/* View Dialog */}
      
//     </div>
//   );
// };

// export default QuotationsPage;


// new file: src/modules/admin/pages/QuotationsPage.tsx
import { useState,useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Customer } from "@/types/customer";
import { Enquiry } from "@/types/enquiry";
import { Quotation } from "@/types/quotation";
import { EnquiryService } from "@/services/enquiry.service";
import { CustomerService } from "@/services/customer.service";
import { QuotationService } from "@/services/quotation.service";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, FileText, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const QuotationsPage = () => {
 
   const[enquiriesList,setEnquriesList]=useState<Enquiry[]|null>([]);
    const[customersList,setCustomersList]=useState<Customer[]|null>([]);
    const[quotationsList,setQuotationsList]=useState<Quotation[]|null>([]);

    useEffect(() =>{
       const enquiries = async()=>{
           const res=await EnquiryService.getAllEnquiries();
           setEnquriesList(res);
           console.log("Enquiries for admin:", res);
      };
      enquiries();
      const customers=async()=>{
         const res=await CustomerService.getAllCustomers();
         setCustomersList(res);
         console.log("Customer for admin:",res);
      };
      customers();
      const quotations=async()=>{
        const res=await QuotationService.getAll();
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

    return cust ? `${cust.name} – ${enq?.workTypes.map((wt)=> wt.name).join(", ")}` : eId;
  };

  // Ready enquiries
  const readyEnquiries = enquiriesList.filter((e) => {
  const hasQuotation = quotationsList.some(
    (q) => q.enquiryId === e.id
  );
  return e.status === "ReadyForQuotation" && !hasQuotation;
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
        <h2 className="text-2xl font-bold"><Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>Quotations</h2>
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
                {enq.workTypes.map((wt)=> wt.name).join(",")}
              </p>
            </div>

            <Button
              size="sm"
              onClick={() =>
                navigate(
                  `/admin/quotations/create?enquiryId=${enq.id}`
                )
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
                const sub = q.items.reduce( 
                  (s, i) => s +  i.unitPrice,
                  0
                );

                return (
                  <tr
                    key={q.id}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/quotations/${q.id}`)
                    }
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