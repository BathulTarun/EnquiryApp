import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {   Address } from "@/types/common";
import { Customer } from "@/types/customer";
import { Enquiry } from "@/types/enquiry";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Mail, Phone, Plus, X } from "lucide-react";
import LocationSearch, { LocationResult } from "@/modules/customers/components/LocationSearch";
import { CustomerService } from "@/services/customer.service";
import { stat } from "fs";
import { LocationService } from "@/services/location.service";
import { mapLocationToAddress } from "@/services/AddressPayloadMapper";
import { toast } from "sonner";
interface CustomerDetailsProps {
  addresses: Address[];
  customer: Customer;
  enquiries: Enquiry[];
  onUpdateCustomer?: (customer: Customer) => void;
  onSelectEnquiry?: (enquiry: Enquiry) => void;
}


const statusColor: Record<string, string> = {
 "Pending": "bg-amber-50 text-amber-600 border-amber-200",
  "SiteVisitScheduled": "bg-primary/10 text-primary border-primary/20",
  "SiteVisitRescheduled": "bg-orange-50 text-orange-600 border-orange-200",
  "SiteVisitCompleted": "bg-violet-50 text-violet-600 border-violet-200",
  "ReadyForQuotation": "bg-accent/10 text-accent border-accent/20",
  "Completed": "bg-emerald-50 text-emerald-600 border-emerald-200",
};


const CustomerDetails = ({ customer, enquiries, addresses, onUpdateCustomer, onSelectEnquiry }: CustomerDetailsProps) => {
const [states, setStates] = useState<any[]>([]);
// new for address
const [locations, setLocations] = useState<Address[]>([]);

const navigate=useNavigate();

//new for address
useEffect(() => {
  const fetchLocations = async () => {
    const data = await LocationService.getAllLocationsForCustomer(customer.id);

    const mapped = data.map(mapLocationToAddress);

    setLocations(mapped);
  };

  fetchLocations();
}, []);

useEffect(() => {
  LocationService.getStates().then((data) => {
    setStates(data);
  });
}, []);

// new for address  
const allAddresses = [
  ...(addresses || []),
  ...(locations || []),
];

const uniqueAddresses = allAddresses.filter(
  (addr, index, self) =>
    index === self.findIndex((a) => a.id === addr.id)
);
  
  const [showAddAddress, setShowAddAddress] = useState(false);
  
  const [newAddr, setNewAddr] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    stateId: 0,
    pincode: "",
    landmark: "",
    lat: 0,
    lng: 0,
    verified: false,
    addressType: "",
  });

const getStatusNote = (status: string) => {
  switch (status) {
    case "Pending":
      return "Scheduling Shortly";

    case "SiteVisitScheduled":
      return "Engineer Assigned";

    case "SiteVisitRescheduled":
      return "Visit Rescheduled";

    case "SiteVisitCompleted":
      return "Site Visit Completed";

    case "ReadyForQuotation":
      return "Quotation in Progress";

    case "Completed":
      return "Service Completed";

    default:
      return "Status Updating";
  }
};

  const handleLocationSelect = (loc: LocationResult) => {
     const matchedState = states.find(
    (s) => s.Name.toLowerCase() === loc.state.toLowerCase()
  );

    setNewAddr({
      address1: loc.address1,
      address2: loc.address2,
      city: loc.city,
      state: matchedState?.Name || loc.state,
      stateId: matchedState ? Number(matchedState.ID) : 0,
      pincode: loc.pincode,
      landmark: loc.landmark,
      lat: loc.lat,
      lng: loc.lng,
      verified: loc.verified,
      addressType: "",
    });
  };

  const handleSaveAddress =async () => {
    if (!newAddr.address1 || !newAddr.city || !newAddr.pincode) return;
    const address: Address = {
      // id: `A${Date.now()}`,
      ...newAddr,
    };
    try{
       const res = await CustomerService.addAddress(customer.id, address);

       if (res?.Status === "Success") {
        toast.success("Address added successfully.",{
          duration: 5000,
        });
        const savedAddress: Address = {
        id: res.Data, //  use backend ID
          ...address,
          };
  // ✅ Update UI immediately
setLocations((prev) => [...prev, savedAddress]);

// (optional) still inform parent if needed
onUpdateCustomer?.({
  ...customer,
  addresses: [...(addresses || []), savedAddress],
});

   setShowAddAddress(false);
      setNewAddr({
        address1: "",
        address2: "",
        city: "",
        state: "",
        stateId: 0,
        pincode: "",
        landmark: "",
        lat: 0,
        lng: 0,
        verified: false,
        addressType: "Home",
      });
    } else {
      toast.error("Failed to add address.",{
        duration: 5000,
      });
      console.error("Failed to update customer");
    }
  } catch (error) {
    toast.error("Error saving address.",{
      duration: 5000,
    });
    console.error("Error saving address:", error);
  }
};

  //   const updated = { ...customer, addresses: [...customer.addresses, address] };
  //   onUpdateCustomer?.(updated);
  //   setShowAddAddress(false);
  //   setNewAddr({ address1: "", address2: "", city: "", state: "", pincode: "", landmark: "", lat: 0, lng: 0, verified: false });
  // };

  const update = (key: string, value: string) =>
    setNewAddr((p) => ({ ...p, [key]: value, verified: false }));

  const addressFields = [
    { key: "address1", label: "Address Line 1", required: true, wide: true },
    { key: "address2", label: "Address Line 2" },
    { key: "city", label: "City", required: true },
    { key: "state", label: "State" },
    { key: "pincode", label: "Pincode", required: true },
    { key: "landmark", label: "Landmark" },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User size={20} className="text-primary" />
            Customer Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="font-semibold text-base">{customer.name}</p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Phone size={14} /> {customer.mobile} , {customer.mobile2}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Mail size={14} /> {customer.email}
          </p>
          {/* {customer.addresses.map((addr,index) => ( */}
            {uniqueAddresses.map((addr,index) => (
            <div key={addr.id || index} className="flex items-start gap-2 text-muted-foreground">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <span className=" text-xs text-primary">{ addr.addressType || "Home"} </span>
              <div>
                <span>{[addr.address1, addr.address2, addr.city, addr.pincode].filter(Boolean).join(", ")}</span>
                {addr.verified && (
                  <span className="ml-2 text-xs text-primary">✓ Verified</span>
                )}
              </div>
            </div>
          ))}

          {/* Add New Address */}
          {!showAddAddress ? (
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setShowAddAddress(true)}>
              <Plus size={14} /> Add Site Address
            </Button>
          ) : (
            <div className="mt-3 p-4 border border-border rounded-lg space-y-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">New Address</h4>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddAddress(false)}>
                  <X size={14} />
                </Button>
              </div>

              <LocationSearch onSelect={handleLocationSelect}  />
              <div className="space-y-1">
  <Label className="text-xs">
    Address Type
  </Label>

  <div className="flex gap-2">
    {["Home", "Office", "Other"].map((type) => (
      <Button
        key={type}
        type="button"
        size="sm"
        variant={
          newAddr.addressType === type
            ? "default"
            : "outline"
        }
        onClick={() =>
          setNewAddr((p) => ({
            ...p,
            addressType: type,
          }))
        }
        className="h-8 px-3 text-xs"
      >
        {type}
      </Button>
    ))}
  </div>
</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {addressFields.map((f) => (
  <div key={f.key} className={f.wide ? "md:col-span-2" : ""}>
    <Label className="text-xs">
      {f.label} {f.required && <span className="text-destructive">*</span>}
    </Label>

    {f.key === "state" ? (
      <select
        value={newAddr.state}
        onChange={(e) => {
          const selected = states.find(
            (s) => s.Name === e.target.value
          );

          setNewAddr((p) => ({
            ...p,
            state: selected?.Name || "",
            stateId: Number(selected?.ID || 0),
          }));
        }}
        className="mt-1 w-full border rounded px-2 py-2 text-sm"
      >
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s.ID} value={s.Name}>
            {s.Name}
          </option>
        ))}
      </select>
    ) : (
      <Input
        value={(newAddr as any)[f.key]}
        onChange={(e) => update(f.key, e.target.value)}
        className="mt-1"
      />
    )}
  </div>
))}
              </div>

              {newAddr.verified && (
                <p className="text-xs text-primary flex items-center gap-1">✓ Address verified via location search</p>
              )}

              <Button type="button" size="sm" onClick={handleSaveAddress} disabled={!newAddr.address1 || !newAddr.city || !newAddr.pincode}>
                Save Address
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {enquiries.length > 0 && (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Previous Enquiries</CardTitle>
        </CardHeader>
        <CardContent>
         
            <div className="space-y-3">
              {enquiries.map((enq) => {
                return(
               <div key={enq.id} className="p-3 rounded-lg bg-muted/50 border border-border"  >
  
  <div className="flex justify-between items-start mb-1">
   <span className="font-medium text-sm">{enq.EnquiryNumber || `ENQ-${enq.id}`}</span>
    <Badge className={statusColor[enq.status]}>{enq.status}</Badge>
  </div>

 <p className="text-xs text-muted-foreground mb-1">
  {enq.siteVisit?.scheduledDate?.split("T")[0]
  .split("-")
  .reverse()
  .join("-") || "Not scheduled"}, {enq.siteVisit?.scheduledTime || ""}
</p>
  {/* <p className="text-sm">
  {enq.workTypes?.map((w) =>
    `${w.name}${w.selectedSubOption ? ` (${w.selectedSubOption})` : ""}`
  ).join(", ")}
</p> */}
<p className="text-sm">
  {enq.workItems
    ?.map((w) => {
      const subCat = w.subCategoryName
        ? ` - ${w.subCategoryName}`
        : "";

      const product = w.productName
        ? ` (${w.productName})`
        : "";

      return `${w.name}${subCat}`;
    })
    .join(", ")}
</p>
<p className="text-xs text-primary"> {getStatusNote(enq.status)}</p>
  {/* Remarks */}
  {enq.remarks && (
    <p className="text-xs text-muted-foreground mt-1">
      {enq.remarks.map((r) => r.text).join(", ")}
    </p>
  )}
</div>
)})}
            </div>
         
        </CardContent>
      </Card>
     )}

    </div>
  );
}; 

export default CustomerDetails;
