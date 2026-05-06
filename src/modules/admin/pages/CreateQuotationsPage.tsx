import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ArrowLeft, Pencil } from "lucide-react";

import { useNavigate ,useSearchParams} from "react-router-dom";
import { useAppStore } from "@/services/appStore";
import { QuotationItem } from "@/types/quotation";
import { Enquiry } from "@/types/enquiry";
import { EnquiryService } from "@/services/enquiry.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Customer } from "@/types/customer";
import { CustomerService } from "@/services/customer.service";
import { QuotationService } from "@/services/quotation.service";

export default function CreateQuotationPage() {
  
   const [searchParams] = useSearchParams();
const enquiryId = searchParams.get("enquiryId");



  const[enquiriesList,setEnquriesList]=useState<Enquiry[]|null>([]);
  const[customersList,setCustomersList]=useState<Customer[]|null>([]);

  const navigate = useNavigate();

  const [selectedEnquiry, setSelectedEnquiry] = useState("");
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [notes, setNotes] = useState("");

  // Modal states
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    description: "",
    quantity:"1",
    unitPrice: 0,
  });

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

}, []);
  useEffect(() => {
  if (!enquiryId) return;

  // 👉 prevent re-running if already set
  if (selectedEnquiry) return;

  setSelectedEnquiry(enquiryId);

  const enq = enquiriesList.find((e) => e.id === enquiryId);
  if (!enq) return;

  if (enq.workItems && enq.workItems.length > 0) {
    const autoItems = enq.workItems.map((w: any, index: number) => ({
      id: w.id ,
      description: enq.workTypes ? `${enq.workTypes} - ${w.name}` : w.name,
      quantity: w.quantity || "1",
      unitPrice: w.unitPrice || w.rate || 0,
    }));

    setItems(autoItems);
    console.log("Auto-filled items from enquiry:", autoItems);
  }
}, [enquiryId, enquiriesList]);

  // ✅ Add item
  const addItem = (item: QuotationItem) => {
    setItems((prev) => [...prev, item]);
  };

  // ✅ Remove item
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // ✅ Save (Add + Edit)
  const saveItem = () => {
    if (!newItem.description.trim()) return;

    if (editingItemId) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItemId ? { ...i, ...newItem } : i
        )
      );
    } else {
      addItem({
        id: Date.now().toString(),
        ...newItem,
      });
    }

    // reset
    setNewItem({
      description: "",
      quantity: "1",
      unitPrice: 0,
    });

    setEditingItemId(null);
    setItemDialogOpen(false);
  };

  // ✅ Edit handler
  const handleEdit = (item: QuotationItem) => {
    setEditingItemId(item.id);
    setNewItem({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    });
    setItemDialogOpen(true);
  };

  const subtotal = items.reduce(
    // (s, i) => s + i.quantity * i.unitPrice,
    // 0
   (s, i) => s +  i.unitPrice,
    0
  );
 
  const handleCreate =async () => {
    if (!selectedEnquiry || items.length === 0) return;

    // addQuotation({
    //   enquiryId: selectedEnquiry,
    //   items,
    //   notes,
    // });

   await QuotationService.create({enquiryId: selectedEnquiry,items,notes,});

    navigate("/admin/quotations");
  };

  const getEnquiryLabel = (eId: string) => {
    const enq = enquiriesList.find((e) => e.id === eId);
    const cust = enq
      ? customersList.find((c) => c.id === enq.customer.id)
      : undefined;
    return cust ? `${cust.name} – ${enq?.workTypes}` : eId;
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">
          Create Quotation
        </h2>
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/quotations")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Enquiry Select */}
      <Select
        value={selectedEnquiry}
        onValueChange={setSelectedEnquiry}
        disabled={!!enquiryId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select enquiry" />
        </SelectTrigger>
        <SelectContent>
          {enquiriesList.map((e) => (
            <SelectItem key={e.id} value={String(e.id)}>
              {getEnquiryLabel(e.id)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>



      {/* Work Items */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Work Items</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingItemId(null);
              setNewItem({
                description: "",
                quantity: "1",
                unitPrice: 0,
              });
              setItemDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No items added yet
            </p>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border rounded-lg p-3"
            >
              <div>
                <p className="font-medium break-words">
                  {item.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} × ₹{item.unitPrice}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p className="font-medium">
                  ₹{item.unitPrice}
                </p>

                <button onClick={() => handleEdit(item)}>
                  <Pencil className="h-4 w-4 text-blue-500" />
                </button>

                <button onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="text-right font-bold">
        Total: ₹{subtotal.toLocaleString()}
      </div>

      {/* Notes */}
      <div>
        <Label>Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes..."
        />
      </div>

      {/* Save */}
      <Button className="w-full" onClick={handleCreate}>
        Save Quotation
      </Button>

      {/* Modal */}
      <Dialog
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItemId ? "Edit Item" : "Add Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  description: e.target.value,
                })
              }
            />

            <Input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  quantity: e.target.value === "" ? undefined : e.target.value,
                })
              }
            />

            <Input
              type="number"
              placeholder="Unit Price"
              value={newItem.unitPrice}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  unitPrice: Number(e.target.value),
                })
              }
            />

            <p className="text-right text-sm">
              Total: ₹
              { newItem.unitPrice}
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setItemDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button onClick={saveItem}>
                {editingItemId ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}