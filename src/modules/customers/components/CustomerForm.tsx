import { useState,useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Address } from "@/types/common";
import { Customer } from "@/types/customer";
import { UserPlus } from "lucide-react";
import LocationSearch, { LocationResult } from "@/modules/customers/components/LocationSearch";
import { CustomerService } from "@/services/customer.service";
import { stat } from "fs";
import { LocationService } from "@/services/location.service";
import { AuthService } from "@/services/authService.service";
import { TokenManager } from "@/services/tokenManager.service";
// import { toast } from "@/hooks/use-toast";
import { toast } from "sonner";
interface CustomerFormProps {
  mobile: string;
  onSave: (customer: Customer) => void;
}

const CustomerForm = ({ mobile, onSave }: CustomerFormProps) => {


const [error,setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
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
  });

  const [states, setStates] = useState<any[]>([]);
  
  
  useEffect(() => {
    LocationService.getStates().then((data) => {
      setStates(data);
    });
  }, []);

  const update = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: value, ...(key !== "landmark" ? { verified: false } : {}) }));

  const handleLocationSelect = (loc: LocationResult) => {

     if (!states.length) {
    console.warn("States not loaded yet");
    return;
  }

  const matchedState = states.find(
    (s) => s.Name.toLowerCase() === loc.state.toLowerCase()
  );
    setForm((p) => ({
      ...p,
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
    }));
     if (!matchedState) {
    console.warn("State not matched:", loc.state);
  }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const address: Address = {
    address1: form.address1,
    address2: form.address2,
    city: form.city,
    state: form.state,
    stateId: form.stateId,
    pincode: form.pincode,
    landmark: form.landmark,
    lat: form.lat,
    lng: form.lng,
    verified: form.verified,
  };

  const newCustomer: Customer = {
    name: form.name,
    mobile,
    email: form.email,
    addresses: [address],
  };

  try {
    const res = await CustomerService.createCustomer(newCustomer);

    // console.log("Customer saved:", res);

    if (res.Status === "Success") {
      toast.success("Customer saved successfully.",{
        duration: 5000,
      });
      newCustomer.id = res.Data;

      const token = await AuthService.getToken({
        username: newCustomer.mobile,
        password: newCustomer.mobile,
      });

      TokenManager.setToken(token);

      onSave(newCustomer);
    } else {
      setError(res.ErrorMessage);
           toast.error(res.ErrorMessage + " Failed to save customer. Please try again.",{
              duration: 5000,
           });
      // toast({
      //   title: "Failed to save customer.",
      //   description: res.ErrorMessage || "Please try again.",
      // });
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong. Please try again.",{
      duration: 5000,
    });
    // toast({
    //   title: "Error",
    //   description: "Something went wrong.",
    // });
  }
};

  const personalFields = [
    { key: "name", label: "Full Name", required: true },
    { key: "email", label: "Email", type: "email" },
  ];

  const addressFields = [
    { key: "address1", label: "Address Line 1", required: true, wide: true },
    { key: "address2", label: "Address Line 2" },
    { key: "city", label: "City", required: true },
    { key: "state", label: "State" },
    { key: "pincode", label: "Pincode", required: true },
    { key: "landmark", label: "Landmark" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <UserPlus size={20} className="text-primary" />
          New Customer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mobile & Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Mobile Number</Label>
              <Input value={mobile} disabled className="mt-1" />
            </div>
            {personalFields.map((f) => (
              <div key={f.key}>
                <Label>
                  {f.label} {f.required && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  type={f.type || "text"}
                  value={(form as any)[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  required={f.required}
                  className="mt-1"
                />
              </div>
            ))}
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Address Details
            </h3>

            <LocationSearch onSelect={handleLocationSelect} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addressFields.map((f) => (
                <div key={f.key} className={f.wide ? "md:col-span-2" : ""}>
                  <Label>
                    {f.label} {f.required && <span className="text-destructive">*</span>}
                  </Label>
                  {/* <Input
                    value={(form as any)[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    required={f.required}
                    className="mt-1"
                  /> */}
                  {f.key === "state" ? (
  <select
    value={form.state}
    onChange={(e) => {
      const selected = states.find(
        (s) => s.Name === e.target.value
      );

      setForm((p) => ({
        ...p,
        state: selected?.Name || "",
        stateId: Number(selected?.ID || 0),
        verified: false,
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
    value={(form as any)[f.key]}
    onChange={(e) => update(f.key, e.target.value)}
    required={f.required}
    className="mt-1"
  />
)}
                </div>
              ))}
            </div>

            {form.verified && (
              <p className="text-xs text-primary flex items-center gap-1">
                ✓ Address verified via location search
              </p>
            )}
          </div>

          <Button type="submit" className="w-full md:w-auto"
           disabled={!form.name || !form.address1 || !form.city || !form.pincode}>
            Save Customer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;
