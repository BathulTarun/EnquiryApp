import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MobileInput from "@/modules/customers/components/MobileInput";
import OTPVerification from "@/modules/customers/components/OTPVerification";
import CustomerDetails from "@/modules/customers/components/CustomerDetails";
import CustomerForm from "@/modules/customers/components/CustomerForm";
import WorkTypeSelector from "@/modules/customers/components/WorkTypeSelector";
import SiteVisitForm from "@/modules/customers/components/SiteVisitForm";
import EnquirySummary from "@/modules/customers/components/EnquirySummary";
import ConfirmationDialog from "@/modules/customers/components/ConfirmationDialog";
import {  Address ,SelectedSubOption} from "@/types/common";
import { WorkType } from "@/types/common";
import { Customer } from "@/types/customer";
import EnquiryDetailsDialog from "@/modules/customers/components/EnquiryDetailsDialog";
import { Plus, ArrowLeft } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import WorkTypeService from "@/services/worktype.service";

import { CustomerService } from "@/services/customer.service";

import { OperatorService } from "@/services/operator.service";


import { Enquiry } from "@/types/enquiry";
import { Engineer } from "@/types/engineer";
import { LocationService } from "@/services/location.service";
import { TokenManager } from "@/services/tokenManager.service";
import { AuthService } from "@/services/authService.service";
// import { toast } from "@/hooks/use-toast";
import { toast } from "sonner";

import { title } from "process";

type Step = "home" | "mobile" | "otp" | "form" | "worktype" | "visit";

const Index = () => {

  const [step, setStep] = useState<Step>("home");
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [mobile, setMobile] = useState("");
  const [selectedWork, setSelectedWork] = useState<WorkType[]>([]);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [visitAddress, setVisitAddress] = useState<Address | null>(null);
  const [remarks, setRemarks] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [enquiryId, setEnquiryId] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
const [detailsOpen, setDetailsOpen] = useState(false);
const [customerEnquiries, setCustomerEnquiries] = useState<Enquiry[]>([]);
const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [locations, setLocations] = useState<Address[]>([]);
 const[token,setToken]=useState("");
  const loadLocations = async () => {
    const data = await LocationService.getAllLocationsForCustomer();

    const mapped = data.map((loc: any) => ({
      id:loc.LocationID,
      address1: loc.AddressLine1,
      address2: loc.AddressLine2 || "",
      city: loc.City,
      state: loc.StateName,
      stateId: loc.StateID,
      pincode: loc.PostalCode,
      landmark: loc.LandMark || "",
      lat: 0,
      lng: 0,
      verified: true,
    }));

    setLocations(mapped);
  };
  

  

// const [workTypes, setWorkTypes] = useState<WorkType[]>([]);

// useEffect(() => {
//   const fetchWorkTypes = async () => {
//     const data = await WorkTypeService.getAll();
//     setWorkTypes(data);
//   };
//   fetchWorkTypes();
// }, []);

useEffect(() => {
  const fetchEngineers = async () => {
    const data = await OperatorService.getAllOperators();
    setEngineers(data);
    // console.log("Engineers"+engineers);
  };
  fetchEngineers();
}, []);

// useEffect(() => {
// const getEnqueriesByCustomerMobile = async ()=> {
//     const data= await CustomerService.getEnquriesByCustomerId(customer.id);
//     console.log("Enquiries for mobile", mobile, data);
//      setCustomerEnquiries(data);
//   };
//    getEnqueriesByCustomerMobile();
// }, []);

  const handleMobileSearch = async (num: string) => {

    // TokenManager.clearToken();
  // const token=   await AuthService.getToken({ username: num, password: num });
  // TokenManager.setToken(token);    //added in otpverfication.ts 45 line
    setMobile(num);
    setStep("otp"); 
  };

  const handleOtpVerified =async  () => {
 
      // If token is NOT present → customer does not exist
  if (TokenManager.getToken()==="null" || !TokenManager.getToken()) {
    toast.error("No customer found. Please create a new customer profile.",{
      duration: 5000,
    });
    // toast({
    //     title: "No customer found.",
    //     description: "Please create a new customer profile.",
    //   });
    setIsNew(true);
    setCustomer(null);
    setStep("form");
    return;
  }
  // console.log("OTP verified, token set:", TokenManager.getToken());
  // getEnqueriesByCustomerMobile();

    const found = await CustomerService.getByMobile(mobile);
    if (found) {
      loadLocations();
      setCustomer(found);
      setIsNew(false);
     await getEnqueriesByCustomerId(found.id);
    } else {
      TokenManager.clearToken();
      toast.error("No customer found. Please create a new customer profile.",{
        duration: 5000,
      });
      // toast({
      //   title: "No customer found.",
      //   description: "Please create a new customer profile.",
      // });
     
      setIsNew(true);
      setCustomer(null);
    }
    setStep("form");
     
  };
 
// console.log(customer);
  const getEnqueriesByCustomerId = async (customerId: number)=> {
    const data= await CustomerService.getEnquriesByCustomerId(customerId);
    // console.log("Enquiries", data);
     setCustomerEnquiries(data);
  }

  const getEngineerById=async (id:string)=>{
    const data= await OperatorService.getEngineerById(id);
    return data;
  }

const handleSubChange = (id: string, value: string) => {
  // console.log("SubOption changed for WorkType ID:", id, "New Value:", value);
  setSelectedWork((prev) =>
    prev.map((w) =>
      w.id === id ? { ...w, selectedSubOption: value } : w
    )
  );
};



 
  const handleCustomerSave = async (c: Customer) => {
   
    setCustomer(c);
    if(!c.id){
      setIsNew(true);
     }

   
  //   if(c.id){
  //  const token=   await AuthService.getToken({ username: c.mobile, password: c.mobile });
  //  TokenManager.setToken(token);
  //   }
    setIsNew(false);
  };

  const toggleWork = (type: WorkType) => {
    // setSelectedWork((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);
  setSelectedWork((prev) => {
    const exists = prev.find((t) => t.id === type.id);

    if (exists) {
      return prev.filter((t) => t.id !== type.id); // remove
    }

    return [...prev, { ...type, selectedSubOption: undefined}];
  });
  };

 

  const reset = () => {
    TokenManager.clearToken();
    setStep("home");
    setCustomer(null);
    setIsNew(false);
    setMobile("");
    setSelectedWork([]);
    // setSelectedSubs({});
    setVisitDate("");
    setVisitTime("");
    setVisitAddress(null);
    setRemarks("");
  };




  const canGoNext = () => {
    if (step === "form") return !!customer;
    if (step === "worktype") return selectedWork.length > 0;
    return true;
  };

  const nextStep = () => {
    if (step === "form") setStep("worktype");
    else if (step === "worktype") setStep("visit");
  };

  const prevStep = () => {
    if (step === "otp"){
       TokenManager.clearToken();
       setStep("mobile");
      
      }
    else if (step === "form"){
    TokenManager.clearToken();
     setStep("otp");
    }
    else if (step === "worktype") setStep("form");
    else if (step === "visit") setStep("worktype");
    else if (step === "mobile") setStep("home");
  };

  // Step indicators
  const steps = [
    { key: "mobile", label: "Mobile" },
    { key: "otp", label: "Verify" },
    { key: "form", label: "Customer" },
    { key: "worktype", label: "Work Type" },
    { key: "visit", label: "Site Visit" },
  ];
  const currentStepIdx = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold text-foreground">
            Customer Enquiry & Site Visit
          </h1>
          {step !== "home" && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <ArrowLeft size={16} />
              Home
            </Button>
          )}
          {step === "home" && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} >
            <ArrowLeft size={16} />
            </Button>
          )}
        </div>
      </header>

      {/* Step indicator */}
      {step !== "home" && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="flex items-center gap-1 mb-6">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${i <= currentStepIdx ? "text-primary" : "text-muted-foreground"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                    i < currentStepIdx ? "bg-primary text-primary-foreground" :
                    i === currentStepIdx ? "bg-primary text-primary-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < currentStepIdx ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 pb-8">
        {/* Home */}
        {step === "home" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Welcome</h2>
              <p className="text-muted-foreground max-w-md">
                Manage customer enquiries, schedule site visits, and track work requests efficiently.
              </p>
            </div>
            <Button size="lg" onClick={() => setStep("mobile")} className="gap-2 text-base px-8 py-6">
              <Plus size={20} />
              New Enquiry
            </Button>
          </div>
        )}

        {/* Mobile Search */}
        {step === "mobile" && (
          <div className="max-w-lg mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Search Customer</h2>
              <p className="text-sm text-muted-foreground">Enter customer mobile number to search or create new</p>
            </div>
            <MobileInput onSearch={handleMobileSearch} />
          </div>
        )}

        {/* OTP Verification */}
        {step === "otp" && (
          <div className="max-w-md mx-auto">
            <OTPVerification mobile={mobile} onVerified={handleOtpVerified} />
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft size={16} /> Change Number
              </Button>
            </div>
          </div>
        )}

        {/* Customer Form / Details + Summary */}
        {step === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {step === "form" && !isNew && customer && (
                <CustomerDetails customer={customer} enquiries={customerEnquiries} addresses={locations} onUpdateCustomer={setCustomer}  onSelectEnquiry={(enq) => {setSelectedEnquiry(enq);setDetailsOpen(false);}}  /> //make this setDetailsOpen(false); to true to check the status detils in customer details tab
              )}
              {step === "form" && isNew && (
                <CustomerForm mobile={mobile} onSave={handleCustomerSave} />
              )}
              {customer && (
                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft size={16} /> Back
                  </Button>
                  <Button onClick={nextStep} disabled={!canGoNext()}>
                    Next: Work Type
                  </Button>
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <EnquirySummary customer={customer} workTypes={selectedWork} 
               />
            </div>
          </div>
        )}

        {/* Work Type Selection */}
        {step === "worktype" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <WorkTypeSelector
              // workTypes={workTypes}
                selected={selectedWork}
                onToggle={toggleWork}
                 onSubChange={handleSubChange}
              />
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button onClick={nextStep} disabled={!canGoNext()}>
                  Next: Site Visit
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <EnquirySummary customer={customer} workTypes={selectedWork} 
              />
            </div>
          </div>
        )}

        {/* Site Visit */}
        {step === "visit" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <SiteVisitForm
                workTypes={selectedWork}
                customerId={customer?.id }
                // addresses={customer?.addresses || []}
                addresses={locations}
                contactNumber={customer?.mobile || mobile}
                onSubmit={(id)=>{
                  setEnquiryId(id);
                  setConfirmOpen(true);
                }}
                customer={customer}
              />
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft size={16} /> Back
              </Button>
            </div>
            <div className="hidden lg:block">
              <EnquirySummary
                customer={customer}
                workTypes={selectedWork}
                visitDate={visitDate}
                visitTime={visitTime}
                address={visitAddress}
                remarks={remarks}
              />
            </div>
          </div>
        )}
      </main>

      <ConfirmationDialog
        open={confirmOpen}
        enquiryId={enquiryId}
        onClose={() => { setConfirmOpen(false); reset();TokenManager.clearToken(); }}
      />

{selectedEnquiry && (
      <EnquiryDetailsDialog
  open={detailsOpen}
  enquiry={selectedEnquiry}
  engineers={engineers}
  onClose={() => setDetailsOpen(false)}
/>
)}

    </div>
  );
};

export default Index;
