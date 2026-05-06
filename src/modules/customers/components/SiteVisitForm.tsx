import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Address} from "@/types/common";
import { Customer } from "@/types/customer";
import { Enquiry } from "@/types/enquiry";
import { WorkType } from "@/types/common";
import { Calendar, Clock, MapPin,Upload ,X} from "lucide-react";
import LocationSearch, { LocationResult } from "@/modules/customers/components/LocationSearch";
import { mapLocationToAddress } from "@/services/AddressPayloadMapper";
import { useEffect } from "react";

import { TimeSlotService } from "@/services/timeslot.service";
import { TimeSlot } from "@/types/timeslot";
import { EnquiryService } from "@/services/enquiry.service";
import { CustomerService } from "@/services/customer.service";
import { OperatorService } from "@/services/operator.service";
import { LocationService } from "@/services/location.service";


interface SiteVisitFormProps {
  addresses: Address[];
  contactNumber: string;
  customer: Customer;
  customerId: number;
  workTypes: WorkType[];
  // subOptions:Record<string, string>;
  onSubmit: (id: string) => void;
}

const SiteVisitForm = ({ addresses, contactNumber,customer,workTypes,customerId, onSubmit }: SiteVisitFormProps) => {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [contact, setContact] = useState(contactNumber);
 const [savedNewAddress, setSavedNewAddress] = useState<Address | null>(null);
  const [addressChoice, setAddressChoice] = useState<string>("existing");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [newAddr, setNewAddr] = useState({
    address1: "", address2: "", city: "", state: "", stateId: 0, pincode: "", landmark: "",
    lat: 0, lng: 0, verified: false,
  });
  const [remarks, setRemarks] = useState("");
  const [photos, setPhotos] = useState<{ id: string;url: string }[]>([]);

  const [locations, setLocations] = useState<Address[]>([]);
  useEffect(() => {
  const loadLocations = async () => {
    const data = await LocationService.getAllLocationsForCustomer();

    const mapped = data.map(mapLocationToAddress);
    setLocations(mapped);
    console.log("Loaded locations for customer:", mapped);
  };

  loadLocations();
  
}, []);



const allAddresses = [
  ...(addresses || []),
  ...(locations || []),
];

console.log("customer from site visit form", customer);

const uniqueAddresses = allAddresses.filter(
  (addr, index, self) =>
    index === self.findIndex((a) => a.id === addr.id)
);
  const [slots, setSlots] = useState<
  (TimeSlot & { isPast: boolean })[]
>([]);

const [states, setStates] = useState<any[]>([]);


useEffect(() => {
  LocationService.getStates().then((data) => {
    setStates(data);
  });
}, []);

useEffect(() => {
  if (uniqueAddresses.length > 0 && !selectedAddressId) {
    setSelectedAddressId(String(uniqueAddresses[0].id));
  }
}, [uniqueAddresses]);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  const newImages = Array.from(files).map((file) => ({
    id: crypto.randomUUID(),
    url: URL.createObjectURL(file), // preview 
  }));

  setPhotos((prev) => [...prev, ...newImages]);
};

const handleRemoveImage = (id: string) => {
  setPhotos((prev) => prev.filter((img) => img.id !== id));
};
  useEffect(() => {
  const loadSlots = async () => {
    const data = await TimeSlotService.getSlots(date);
    setSlots(data);
  };

  loadSlots();
}, [date]);

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
    });
  };

  const updateAddr = (key: string, value: string) =>
    setNewAddr((p) => ({ ...p, [key]: value, verified: false }));

//   const saveAddress = async (): Promise<Address | null> => {
//   if (!newAddr.address1 || !newAddr.city || !newAddr.pincode) {
//     alert("Please fill required address fields");
//     return null;
//   }
//   try {
//     const updatedCustomer = await CustomerService.addAddress(
//       customer.id,
//       newAddr as Address
//     );

//     if (!updatedCustomer) return null;

//     // ✅ return last saved address
//     return updatedCustomer.addresses[updatedCustomer.addresses.length - 1];
//   } catch (error) {
//     console.error("Error saving address:", error);
//     return null;
//   }
// };
const saveAddress = async (): Promise<Address | null> => {
  if (!newAddr.address1 || !newAddr.city || !newAddr.pincode) {
    alert("Please fill required address fields");
    return null;
  }

  try {
    const res = await CustomerService.addAddress(
      customer.id,
      newAddr as Address
    );

    if (res?.Status === "Success") {
      const savedAddress: Address = {
        id: res.Data, // ✅ backend ID
        ...newAddr,
      };

      return savedAddress;
    }

    return null;
  } catch (error) {
    console.error("Error saving address:", error);
    return null;
  }
};

const handleSaveNewAddress = async () => {
  const saved = await saveAddress();

  if (saved) {
    setSavedNewAddress(saved);

    // add to dropdown immediately
    setLocations((prev) => [...prev, saved]);

    // switch to existing mode
    setAddressChoice("existing");
    setSelectedAddressId(String(saved.id));
  }
};

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
  alert("Customer not loaded");
  return;
}
let finalAddress: Address;

// if (addressChoice === "new") {
//   const savedAddress = await saveAddress();

//   if (!savedAddress) return;

//   finalAddress = savedAddress;
// } else {
//   finalAddress = uniqueAddresses.find(
//     (a) => String(a.id) === selectedAddressId
//   )!;
// }
if (addressChoice === "new") {
  if (!savedNewAddress) {
    alert("Please save address first");
    return;
  }

  finalAddress = savedNewAddress;
} else {
  finalAddress = uniqueAddresses.find(
    (a) => String(a.id) === selectedAddressId
  )!;
}
const imageStrings = photos.map((img) => img.url);

    const newEnquiry: Enquiry = {
  // id: `E${Date.now()}`,
 customer:customer,
 images:imageStrings,
//  customerId:customer.id,
//  customerName:customer.name,
//  customerEmail:customer.email,
//  customerMobile:customer.mobile,

   // ✅ Correct structure
 workTypes: workTypes,
       // you can fill later
  workItems: workTypes.map((w) => ({
    id: w.id,
    name: w.name,
    productsId: w.selectedSubOption|| "",
  // default to first subOption if exists
  })),        // REQUIRED
 
 
  // address:
  //   addressChoice === "new"
  //     ? { ...newAddr, id: crypto.randomUUID() }
  //     : addresses.find((a) => String(a.id) === selectedAddressId)!,
  address: finalAddress,
  addressId: finalAddress.id, 
  description:remarks,
  // remarks: remarks ? [{ id: `R${Date.now()}`, text: remarks, timestamp: new Date().toISOString(), author: "User" }] : [],
  status: "Pending", // REQUIRED
  siteVisit: {
   scheduledDate: date,
  scheduledTime: timeSlot,
  contactNumber,
  // address: addressChoice === "new"
  //     ? { ...newAddr, id: crypto.randomUUID() }
  //     : addresses.find((a) => String(a.id) === selectedAddressId)!,
  address: finalAddress,
  }, // REQUIRED (basic structure)
  statusHistory: [
    {
      status: "Pending",
      timestamp: new Date().toISOString(),
      updatedBy: "System",
    },
  ], // REQUIRED
};
   
  const response = await CustomerService.createEnquiry(newEnquiry);

console.log("API Response:", response);

const enquiryId = response;

if (!enquiryId) {
  alert("Failed to create enquiry");
  return;
}
// use backend ID
onSubmit(enquiryId);
    setDate("");
    setTimeSlot("");
    setRemarks("");
  };

  const addressFields = [
    { key: "address1", label: "Address Line 1", wide: true },
    { key: "address2", label: "Address Line 2" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "pincode", label: "Pincode" },
    { key: "landmark", label: "Landmark" },
  ];

  useEffect(() => {
  if (uniqueAddresses.length > 0 && !selectedAddressId) {
    setSelectedAddressId(String(uniqueAddresses[0].id));
  }
}, [uniqueAddresses]);



  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar size={20} className="text-primary" />
          Schedule Site Visit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-1.5">
                <Calendar size={14} /> Date <span className="text-destructive">*</span>
              </Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label className="flex items-center gap-1.5 mb-2">
                <Clock size={14} /> Time Slot <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
               {slots.map((slot) => {
  const selected = timeSlot === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={slot.isPast}
                      onClick={() => setTimeSlot(slot.label)}
                      className={`px-2 py-2 text-xs rounded-md border transition-colors ${
                        selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : slot.isPast
                          ? "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50"
                          : "bg-background text-foreground border-border hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
              <input type="hidden" value={timeSlot} required />
              {!timeSlot && <p className="text-xs text-muted-foreground mt-1">Please select a time slot</p>}
            </div>
          </div>

          <div>
            <Label>Contact Number</Label>
            <Input value={contact} onChange={(e) => setContact(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label className="flex items-center gap-1.5 mb-2">
              <MapPin size={14} /> Site Address
            </Label>
            {uniqueAddresses.length > 0 && (
              <div className="flex gap-3 mb-3">
                <Button type="button" variant={addressChoice === "existing" ? "default" : "outline"} size="sm" onClick={() => setAddressChoice("existing")}>
                  Use Existing
                </Button>
                <Button type="button" variant={addressChoice === "new" ? "default" : "outline"} size="sm" onClick={() => setAddressChoice("new")}>
                  New Address
                </Button>
              </div>
            )}

{addressChoice === "existing" && uniqueAddresses.length > 0 ? (
  <Select value={selectedAddressId || ""} onValueChange={setSelectedAddressId}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {uniqueAddresses.map((a, index) => (
        <SelectItem key={a.id || index} value={String(a.id)}>
          {[a.address1, a.city, a.pincode].filter(Boolean).join(", ")}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
) : (
  <div className="space-y-4">
    <LocationSearch onSelect={handleLocationSelect} />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {addressFields.map((f) => (
        <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
          <Label className="text-xs">
            {f.label}
            {(f.key === "address1" || f.key === "city" || f.key === "pincode") && (
              <span className="text-destructive">*</span>
            )}
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
              onChange={(e) => updateAddr(f.key, e.target.value)}
              className="mt-1"
            />
          )}
        </div>
      ))}
    </div>

    {newAddr.verified && (
      <p className="text-xs text-primary">
        ✓ Address verified via location search
      </p>
    )}

    {/* ✅ NEW SAVE BUTTON */}
    <Button
      type="button"
      size="sm"
      onClick={handleSaveNewAddress}
      disabled={!newAddr.address1 || !newAddr.city || !newAddr.pincode}
    >
      Save Address
    </Button>
  </div>
)}
          </div>

          <div>
            <Label>Remarks</Label>
            <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="mt-1" rows={3} placeholder="Additional notes..." />
          </div>

                  {/* <div className="md:col-span-2">
          <Label className="text-sm font-medium mb-1.5 block">Photo Upload</Label>
          <label className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 py-6 cursor-pointer hover:border-primary/40 transition-colors">
            {photos.length>0 ? (
              <span className="text-sm text-foreground font-medium">{photos.length} image(s) selected</span>
            ) : (
              <>
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload photo</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const files = Array.from(e.target.files || []);
             setPhotos((prev) => [...prev, ...files]);}}
            />
          </label>
        </div> */}
  <div className="md:col-span-2 hidden">
  <Label className="text-sm font-medium mb-1.5 block">
    Photos
  </Label>

  {/* Upload Button */}
  <label className=" flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 py-4 cursor-pointer hover:border-primary/40 transition-colors">
    <Upload className="h-5 w-5 text-muted-foreground" />
    <span className="text-sm text-muted-foreground">
      Upload Images
    </span>
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleImageUpload}
      className="hidden"
    />
  </label>

  {/* Preview Grid */}
  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
    {photos.map((img) => (
      <div key={img.id} className="relative">
        <img
          src={img.url}
          className="w-full h-20 object-cover rounded-md border"
        />

        {/* Remove */}
        <button
          onClick={() => handleRemoveImage(img.id)}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    ))}
  </div>
</div>
          <Button type="submit" className="w-full sm:w-auto" size="lg" disabled={!date || !timeSlot}>
            Submit Enquiry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SiteVisitForm;
