import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import MobileInput from "@/modules/customers/components/MobileInput";
import OTPVerification from "@/modules/customers/components/OTPVerification";
import CustomerDetails from "@/modules/customers/components/CustomerDetails";
import CustomerForm from "@/modules/customers/components/CustomerForm";
import WorkTypeSelector from "@/modules/customers/components/WorkTypeSelector";
import SiteVisitForm from "@/modules/customers/components/SiteVisitForm";
import EnquirySummary from "@/modules/customers/components/EnquirySummary";
import ConfirmationDialog from "@/modules/customers/components/ConfirmationDialog";
import {Address, SelectedProduct} from "@/types/common";
import {WorkType} from "@/types/common";
import {Customer} from "@/types/customer";

import {Plus, ArrowLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";

import {CustomerService} from "@/services/customer.service";

import {OperatorService} from "@/services/operator.service";

import {useWorkTypeStore} from "@/stores/ProductDetailsStore";
import {Enquiry} from "@/types/enquiry";
import {Engineer} from "@/types/engineer";
import {LocationService} from "@/services/location.service";
import {toast} from "sonner";
import {preloadWorkTypeData} from "@/stores/ProductPreload";

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
  const [token, setToken] = useState("");
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [isLoadingWorkTypes, setIsLoadingWorkTypes] = useState(false);
  const {
    categories,
    subcategories,
    products,
    loadCategories,
    loadSubcategories,
    loadProducts,
  } = useWorkTypeStore();
  const loadLocations = async (customerId: number) => {
    const data = await LocationService.getAllLocationsForCustomer(customerId);

    const mapped = data.map((loc: any) => ({
      id: loc.LocationID,
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
      addressType: loc.Name,
    }));
    setLocations(mapped);
  };

  // const preloadWorkTypeData = async () => {
  //   // categories
  //   await loadCategories();

  //   // get categories from store
  //   const cats = useWorkTypeStore.getState().categories;

  //   // load all subcategories
  //   await Promise.all(
  //     cats.map((cat) => loadSubcategories(Number(cat.CategoryID))),
  //   );

  //   // get updated subcategories
  //   const allSubcategories = useWorkTypeStore.getState().subcategories;

  //   // flatten subcategories
  //   const subList = Object.values(allSubcategories).flat();

  //   // load all products
  //   await Promise.all(
  //     subList.map((sub) => loadProducts(Number(sub.SubCategoryID))),
  //   );
  // };

  const handleMobileSearch = async (num: string) => {
    setMobile(num);
    setStep("otp");
  };

  const handleOtpVerified = async () => {
    setIsLoadingCustomer(true);

    try {
      const found = await CustomerService.getByMobile(mobile);

      if (found) {
        await loadLocations(found.id);

        setCustomer(found);
        setIsNew(false);

        await getEnqueriesByCustomerId(found.id);
      } else {
        toast.error(
          "No customer found. Please create a new customer profile.",
          {
            duration: 5000,
          },
        );

        setIsNew(true);
        setCustomer(null);
        setLocations([]); // CLEAR OLD LOCATIONS
        setCustomerEnquiries([]); // optional
      }

      setStep("form");
    } catch (error) {
      toast.error("Failed to load customer details");
    } finally {
      setIsLoadingCustomer(false);
    }
  };

  const getEnqueriesByCustomerId = async (customerId: number) => {
    const data = await CustomerService.getEnquriesByCustomerId(customerId);
    setCustomerEnquiries(data);
  };

  const handleSubCategoryChange = (
    workTypeId: string,
    subCategory: {id: string; name: string},
  ) => {
    setSelectedWork((prev) =>
      prev.map((w) =>
        w.id === workTypeId
          ? {
              ...w,
              selectedSubCategory: subCategory,
            }
          : w,
      ),
    );
  };

  const handleProductChange = (
    workTypeId: string,
    product: SelectedProduct,
  ) => {
    setSelectedWork((prev) =>
      prev.map((w) =>
        w.id === workTypeId
          ? {
              ...w,
              selectedProduct: product,
            }
          : w,
      ),
    );
  };
  const updateWorkType = (updated: WorkType) => {
    setSelectedWork((prev) =>
      prev.map((w) => (w.id === updated.id ? updated : w)),
    );
  };

  const handleCustomerSave = async (c: Customer) => {
    setCustomer(c);
    if (!c.id) {
      setIsNew(true);
    }
    setIsNew(false);
  };

  const toggleWork = (type: WorkType) => {
    setSelectedWork((prev) => {
      const exists = prev.find((t) => t.id === type.id);

      if (exists) {
        return prev.filter((t) => t.id !== type.id); // remove
      }

      return [...prev, {...type, selectedSubOption: undefined}];
    });
  };

  const reset = () => {
    setStep("home");

    setCustomer(null);
    setIsNew(false);

    setMobile("");

    setSelectedWork([]);

    setVisitDate("");
    setVisitTime("");
    setVisitAddress(null);

    setRemarks("");

    setLocations([]); // IMPORTANT
    setCustomerEnquiries([]); // IMPORTANT

    setSelectedEnquiry(null); // optional
  };

  const canGoNext = () => {
    if (step === "form") return !!customer;
    if (step === "worktype")
      return (
        selectedWork.length > 0 &&
        selectedWork.every(
          (item) => item.selectedSubCategory && item.selectedProduct,
        )
      );
    return true;
  };

  const nextStep = () => {
    if (step === "form") {
      setStep("worktype");
    } else if (step === "worktype") setStep("visit");
  };

  const prevStep = () => {
    if (step === "otp") {
      setStep("mobile");
    } else if (step === "form") {
      setStep("otp");
    } else if (step === "worktype") setStep("form");
    else if (step === "visit") setStep("worktype");
    else if (step === "mobile") setStep("home");
  };

  // Step indicators
  const steps = [
    {key: "mobile", label: "Mobile"},
    {key: "otp", label: "Verify"},
    {key: "form", label: "Customer"},
    {key: "worktype", label: "Work Type"},
    {key: "visit", label: "Site Visit"},
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
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
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
                <div
                  className={`flex items-center gap-2 ${i <= currentStepIdx ? "text-primary" : "text-muted-foreground"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                      i < currentStepIdx
                        ? "bg-primary text-primary-foreground"
                        : i === currentStepIdx
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${i < currentStepIdx ? "bg-primary" : "bg-border"}`}
                  />
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Welcome
              </h2>
              <p className="text-muted-foreground max-w-md">
                Manage customer enquiries, schedule site visits, and track work
                requests efficiently.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setStep("mobile")}
              className="gap-2 text-base px-8 py-6"
            >
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
              <p className="text-sm text-muted-foreground">
                Enter customer mobile number to search or create new
              </p>
            </div>
            <MobileInput onSearch={handleMobileSearch} />
          </div>
        )}

        {/* OTP Verification */}
        {step === "otp" && (
          <div className="max-w-md mx-auto">
            <OTPVerification
              mobile={mobile}
              onVerified={handleOtpVerified}
              isLoading={isLoadingCustomer}
            />
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
                <CustomerDetails
                  customer={customer}
                  enquiries={customerEnquiries}
                  addresses={locations}
                  onUpdateCustomer={setCustomer}
                  onSelectEnquiry={(enq) => {
                    setSelectedEnquiry(enq);
                    setDetailsOpen(false);
                  }}
                /> //make this setDetailsOpen(false); to true to check the status detils in customer details tab
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
              <EnquirySummary customer={customer} workTypes={selectedWork} />
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
                onUpdate={updateWorkType}
                //  onSubChange={handleSubChange}
                onSubCategoryChange={handleSubCategoryChange}
                onProductChange={handleProductChange}
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
              <EnquirySummary customer={customer} workTypes={selectedWork} />
            </div>
          </div>
        )}

        {/* Site Visit */}
        {step === "visit" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <SiteVisitForm
                workTypes={selectedWork}
                customerId={customer?.id}
                addresses={locations}
                contactNumber={customer?.mobile || mobile}
                onSubmit={(id) => {
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
        onClose={() => {
          setConfirmOpen(false);
          reset();
        }}
      />
    </div>
  );
};

export default Index;
