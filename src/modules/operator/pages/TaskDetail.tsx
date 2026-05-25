import React, {useState, useMemo, useEffect} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import {ALL_STATUSES, WorkItem, Enquiry} from "@/types/enquiry";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "sonner";
import {Badge} from "@/components/ui/badge";
import {OperatorService} from "@/services/operator.service";
import {mapUpdatedEnquiryToApi} from "@/services/EnquiryPayloadMapper";
import {fileToBase64} from "@/components/ImageConvertor";
import WorkTypeSelector from "@/modules/customers/components/WorkTypeSelector";
import {WorkType, SelectedProduct} from "@/types/common";
import {useProductStore} from "@/stores/productStore";
import {useOperatorStore} from "@/stores/OperatorStore/operatorStore";
import StatusConvertor from "@/components/StatusConvertor";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Wrench,
  Calendar,
  Clock,
  Camera,
  Plus,
  X,
  Check,
  RotateCcw,
  Play,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TaskDetail: React.FC = () => {
  const statusColors: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-600 border-amber-200",
    SiteVisitScheduled: "bg-primary/10 text-primary border-primary/20",
    SiteVisitRescheduled: "bg-orange-50 text-orange-600 border-orange-200",
    SiteVisitCompleted: "bg-violet-50 text-violet-600 border-violet-200",
    ReadyForQuotation: "bg-accent/10 text-accent border-accent/20",
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  const {enquiries} = useOperatorStore();

  const [selectorOpen, setSelectorOpen] = useState(false);

  const [selectedWork, setSelectedWork] = useState<WorkType[]>([]);
  const {productNames, loadProducts} = useProductStore();

  const {updateLocalEnquiry} = useOperatorStore();

  const {taskId} = useParams<{taskId: string}>();

  const task = useMemo(() => {
    return enquiries.find((e) => e.id === taskId) || null;
  }, [enquiries, taskId]);

  useEffect(() => {
    if (task && workItems.length === 0) {
      setWorkItems(task.workItems || []);
    }
  }, [task]);

  const navigate = useNavigate();
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [newItem, setNewItem] = useState<WorkItem>({
    id: "",
    name: "",
    quantity: "",
    unitPrice: 0,
    measurement: "",
    notes: "",
    isCustom: true,
  });
  const [workItems, setWorkItems] = useState<WorkItem[]>(task?.workItems || []);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState<string>("");
  const [rescheduleNote, setRescheduleNote] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [images, setImages] = useState<
    {id: string; url: string; workItemId: string}[]
  >([]);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    workItemId: string;
  } | null>(null);

  const isReadOnly =
    task.status === "ReadyForQuotation" || task.status === "Completed";

  const currentStepIndex = useMemo(
    () => (task ? ALL_STATUSES.indexOf(task.status) : 0),
    [task],
  );

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Task not found.</p>
      </div>
    );
  }

  const productIds = useMemo(() => {
    return workItems.map((w) => w.productsId).filter(Boolean);
  }, [workItems]);

  // useEffect(() => {
  //   loadProducts(productIds);
  // }, [productIds]);

  const handleRemoveItem = (id: string) => {
    setWorkItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleWork = (type: WorkType) => {
    setSelectedWork((prev) => {
      const exists = prev.find((t) => t.id === type.id);

      if (exists) {
        return prev.filter((t) => t.id !== type.id);
      }

      return [...prev, type];
    });
  };

  const updateWorkType = (updated: WorkType) => {
    setSelectedWork((prev) =>
      prev.map((w) => (w.id === updated.id ? updated : w)),
    );
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
              selectedProduct: {
                id: product.id,
                name: product.name,
                price: product.price,
              },
            }
          : w,
      ),
    );
  };

  const addSelectedProductsToWorkItems = () => {
    const newItems: WorkItem[] = [];

    selectedWork.forEach((work) => {
      if (!work.selectedProduct) return;

      newItems.push({
        id: crypto.randomUUID(),

        // IMPORTANT
        CategoryID: Number(work.id),

        subCategoryID: Number(work.selectedSubCategory?.id),

        productsId: work.selectedProduct.id,

        productName: work.selectedProduct.name,

        name: "Operator",

        quantity: "1",

        measurement: "",

        unitPrice: work.selectedProduct.price || 0,

        notes: "",

        isCustom: false,

        images: [],
      });
    });

    setWorkItems((prev) => {
      // prevent duplicates
      const existingIds = prev.map((i) => i.productsId);

      const filtered = newItems.filter(
        (i) => !existingIds.includes(i.productsId),
      );

      return [...prev, ...filtered];
    });

    // reset selector state
    setSelectedWork([]);

    setSelectorOpen(false);

    toast.success("Products added");
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    if (!selectedItemId) {
      toast.error("Please select a work item first");
      return;
    }
    const previewImages = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      workItemId: selectedItemId,
    }));

    setImages((prev) => [...prev, ...previewImages]);
    const base64Images = await Promise.all(
      Array.from(files).map((file) => fileToBase64(file)),
    );

    setWorkItems((prev) =>
      prev.map((item) => {
        if (item.id !== selectedItemId) return item;

        return {
          ...item,
          images: [...(item.images || []), ...base64Images],
        };
      }),
    );
  };
  // handler to remove image from state (and ideally from server in a real app)
  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };
  // helper to get item name by id (for display purposes)
  const getItemName = (id: string) => {
    return workItems.find((item) => item.id === id)?.name || "Item";
  };

  const handleStartWork = () => {
    // updateEnquiryStatus(task.id, "Site Visit Scheduled");
    toast.success("Work started");
  };

  const handleReschedule = async () => {
    const newStatus = "SiteVisitRescheduled";
    setShowReschedule(!showReschedule);
    const updatedTask = {
      ...task,

      siteVisit: {
        ...task.siteVisit,

        remarks:
          rescheduleReason + (rescheduleNote ? ` - ${rescheduleNote}` : ""),
      },
    };

    const payload = mapUpdatedEnquiryToApi(updatedTask, workItems, newStatus);

    const data = await OperatorService.updateEnquiry(payload);
    if (data) {
      toast.success("Task Rescheduled");

      updateLocalEnquiry({
        ...task,
        workItems,
        status: newStatus,
      });
    } else {
      toast.error("Try again");
    }
  };
  const openNavigation = (lat: number, lng: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
    );
  };

  const handleSave = async () => {
    const payload = mapUpdatedEnquiryToApi(task, workItems, task.status);

    const result = await OperatorService.updateEnquiry(payload);
    if (result) {
      updateLocalEnquiry({
        ...task,
        workItems,
      });
      toast.success("Draft saved");
    } else {
      toast.error("Failed to save");
    }
  };
  const handleSubmit = async () => {
    const newStatus = "ReadyForQuotation";

    const payload = mapUpdatedEnquiryToApi(task, workItems, newStatus);

    const result = await OperatorService.updateEnquiry(payload);

    if (result) {
      updateLocalEnquiry({
        ...task,
        workItems,
        status: newStatus,
      });
      toast.success("Submitted successfully");
    } else {
      toast.error("Failed to submit");
    }
  };

  const saveItem = () => {
    if (!newItem.name.trim()) return;

    if (editingItemId) {
      // UPDATE
      setWorkItems((prev) =>
        prev.map((item) =>
          item.id === editingItemId ? {...item, ...newItem} : item,
        ),
      );
    } else {
      // ADD
      setWorkItems((prev) => [
        ...prev,
        {
          ...newItem,
          id: `custom-${Date.now()}`,
        },
      ]);
    }

    setItemDialogOpen(false);
    setEditingItemId(null);
  };

  const handleEditItem = (item: WorkItem) => {
    setEditingItemId(item.id);
    setNewItem(item);
    setItemDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-material sticky top-0 z-10">
        <div className="container flex items-center gap-3 h-14">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-card-foreground truncate">
              {task.customer.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {task.EnquiryNumber}
            </p>
          </div>
          <Badge variant="outline" className={statusColors[task.status]}>
            {StatusConvertor(task.status)}
          </Badge>
        </div>
      </header>

      <main className="container py-4 lg:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-4">
            {/* Status Timeline is hidden */}
            <section className="bg-card rounded-lg shadow-material-sm p-4 overflow-x-auto hidden">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Status Timeline
              </h3>
              {/* Desktop horizontal */}
              <div className="hidden md:flex items-center gap-1">
                {ALL_STATUSES.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center min-w-[80px]">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          i <= currentStepIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i < currentStepIndex ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <p
                        className={`text-[10px] text-center mt-1 leading-tight ${i <= currentStepIndex ? "text-primary font-medium" : "text-muted-foreground"}`}
                      >
                        {s}
                      </p>
                    </div>
                    {i < ALL_STATUSES.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 ${i < currentStepIndex ? "bg-primary" : "bg-muted"}`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
              {/* Mobile vertical */}
              <div className="md:hidden space-y-0">
                {ALL_STATUSES.map((s, i) => (
                  <div key={s} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          i <= currentStepIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i < currentStepIndex ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      {i < ALL_STATUSES.length - 1 && (
                        <div
                          className={`w-0.5 h-6 ${i < currentStepIndex ? "bg-primary" : "bg-muted"}`}
                        />
                      )}
                    </div>
                    <p
                      className={`text-sm pt-0.5 ${i <= currentStepIndex ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      {s}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Customer Details */}
            <section className="bg-card rounded-lg shadow-material-sm p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Customer Details
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {task.customer.name}
                </div>
                <div>
                  <p className="font-medium text-card-foreground">
                    {task.customer.name}
                  </p>
                  <a
                    href={`tel:${task.customer.mobile}`}
                    className="text-sm text-primary flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> {task.customer.mobile}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Button
                  variant="outline"
                  onClick={() =>
                    openNavigation(task.address.lat, task.address.lng)
                  }
                >
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {task.address.landmark + ", " + task.address.city}
                  </span>
                </Button>
              </div>
            </section>

            {/* Work & Schedule */}
            <section className="bg-card rounded-lg shadow-material-sm p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Work & Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-card-foreground">
                  <Wrench className="w-4 h-4 text-muted-foreground" />
                  <span>{task.description}</span>
                </div>
                <div className="flex items-center gap-2 text-card-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {task.siteVisit?.scheduledDate
                      ?.split("T")[0]
                      .split("-")
                      .reverse()
                      .join("-")}
                    , {task.siteVisit?.scheduledTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-card-foreground">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{task.siteVisit.scheduledTime}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-4 mt-4 lg:mt-0">
            {/* Actions */}
            <section className="bg-card rounded-lg shadow-material-sm p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </h3>
              <div className="flex flex-wrap gap-2 ">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isReadOnly}
                  onClick={() => setShowReschedule(!showReschedule)}
                >
                  <RotateCcw className="w-4 h-4 mr-1" /> Reschedule
                </Button>
              </div>
              {showReschedule && (
                <div className="border rounded-md p-3 space-y-2 bg-muted/50">
                  <p className="text-sm font-medium text-card-foreground">
                    Reschedule Reason
                  </p>
                  {["Wrong Address", "Customer Not Available", "Other"].map(
                    (r) => (
                      <label
                        key={r}
                        className="flex items-center gap-2 text-sm text-card-foreground cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={r}
                          checked={rescheduleReason === r}
                          onChange={() => setRescheduleReason(r)}
                          className="accent-primary"
                        />
                        {r}
                      </label>
                    ),
                  )}
                  {rescheduleReason === "Other" && (
                    <Textarea
                      placeholder="Provide details..."
                      value={rescheduleNote}
                      onChange={(e) => setRescheduleNote(e.target.value)}
                      className="mt-1"
                    />
                  )}
                  <Button size="sm" onClick={handleReschedule}>
                    Confirm Reschedule
                  </Button>
                </div>
              )}
            </section>

            {/* Work Items */}
            <section className="bg-card rounded-lg shadow-material-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Work Items
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isReadOnly}
                  onClick={() => setSelectorOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Products
                </Button>
              </div>
              <div className="space-y-2">
                {workItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border rounded-lg p-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{item.productName}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Scale:</span>
                        <span className="font-medium">
                          {item.measurement || "No measurement"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Qty:</span>
                        <span className="font-medium">
                          {item.quantity || "No quantity"}
                        </span>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-muted-foreground">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* EDIT */}
                      <button
                        disabled={isReadOnly}
                        onClick={() => handleEditItem(item)}
                      >
                        <Pencil
                          className={`w-4 h-4 ${isReadOnly ? "text-gray-400" : "text-blue-500"}`}
                        />
                      </button>

                      {/* DELETE */}
                      {item.name == "Operator" && (
                        <button
                          disabled={isReadOnly}
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <X
                            className={`w-4 h-4 ${isReadOnly ? "text-gray-400" : "text-red-500"}`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* New Image Upload */}
            <section className="bg-card rounded-lg shadow-material-sm p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Images
              </h3>

              {/* SELECT + UPLOAD */}
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Work Item Select */}
                <select
                  disabled={isReadOnly}
                  className="border rounded-md px-2 py-1 text-sm w-full sm:w-48"
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                >
                  <option value="">Select Work Item</option>
                  {workItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {productNames[item.productsId]}
                    </option>
                  ))}
                </select>

                {/* Upload */}
                <label
                  className={`flex items-center justify-center gap-2 px-3 py-1 border rounded-md text-sm ${isReadOnly ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-muted/50"}`}
                >
                  <Camera className="w-4 h-4" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isReadOnly}
                    multiple
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* IMAGE GRID */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((img) => (
                  <div key={img.id} className="relative">
                    {/* IMAGE */}
                    <img
                      src={img.url}
                      className="w-full h-20 object-cover rounded-md border"
                      onClick={() =>
                        setPreviewImage({
                          url: img.url,
                          workItemId: img.workItemId,
                        })
                      }
                    />

                    {/* ❌ REMOVE BUTTON */}
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {/* ITEM BADGE */}
                    <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {getItemName(img.workItemId)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Submit */}
            <section className="bg-card rounded-lg shadow-material-sm p-4 flex gap-3">
              <Button
                disabled={isReadOnly}
                variant="outline"
                className="flex-1"
                onClick={handleSave}
              >
                Save Draft
              </Button>
              <Button
                disabled={isReadOnly}
                className="flex-1"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </section>

            {/* IMAGE PREVIEW */}

            {previewImage && (
              <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
                {/* CLOSE BUTTON */}
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* IMAGE */}
                <img
                  src={previewImage.url}
                  className="max-w-full max-h-full object-contain px-4"
                />

                {/* WORK ITEM LABEL */}
                <div className="absolute bottom-6 bg-black/70 text-white text-sm px-4 py-2 rounded">
                  {getItemName(previewImage.workItemId)}
                </div>
              </div>
            )}
            <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItemId ? "Edit Work Item" : "Add Work Item"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Name */}
                  <Input
                    placeholder="Item Name"
                    value={newItem.productName}
                    disabled={!!editingItemId && !newItem.isCustom}
                    onChange={(e) =>
                      setNewItem({...newItem, name: e.target.value})
                    }
                  />

                  {/* Measurement */}
                  <Input
                    placeholder="Measurement"
                    value={newItem.measurement}
                    onChange={(e) =>
                      setNewItem({...newItem, measurement: e.target.value})
                    }
                  />

                  <Input
                    placeholder="Quantity"
                    value={newItem.quantity ?? ""}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        quantity:
                          e.target.value === "" ? undefined : e.target.value,
                      })
                    }
                  />

                  {/* Notes */}
                  <Textarea
                    placeholder="Notes"
                    value={newItem.notes}
                    onChange={(e) =>
                      setNewItem({...newItem, notes: e.target.value})
                    }
                  />

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
        </div>
        <Dialog open={selectorOpen} onOpenChange={setSelectorOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Products</DialogTitle>
            </DialogHeader>

            <WorkTypeSelector
              selected={selectedWork}
              onToggle={toggleWork}
              onUpdate={updateWorkType}
              onSubCategoryChange={handleSubCategoryChange}
              onProductChange={handleProductChange}
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelectorOpen(false)}>
                Cancel
              </Button>

              <Button onClick={addSelectedProductsToWorkItems}>
                Add Selected
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default TaskDetail;
