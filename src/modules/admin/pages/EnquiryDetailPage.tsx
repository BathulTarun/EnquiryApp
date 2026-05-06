import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, CheckCircle2, Circle, Send, User, Phone, Mail, MapPin, Wrench } from "lucide-react";
import { format } from "date-fns"; 
import type { EnquiryStatus } from "@/types/enquiry";
import { Engineer } from "@/types/engineer";
import {  Enquiry } from "@/types/enquiry";
import { Customer } from "@/types/customer";
import { CustomerService } from "@/services/customer.service";
import { EnquiryService } from "@/services/enquiry.service";
import { OperatorService } from "@/services/operator.service";
import { b } from "vitest/dist/chunks/suite.d.FvehnV49.js";

const allStatuses: EnquiryStatus[] = ["Pending", "SiteVisitScheduled", "SiteVisitRescheduled", "SiteVisitCompleted", "ReadyForQuotation", "Completed"];

const EnquiryDetailPage = () => {
    const { id } = useParams<{ id: string }>();

   const[customer, setCustomer] = useState<Customer | null>(null);
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [engineer, setEngineer] = useState<Engineer | null>(null);
  const[enquiriesList, setEnquiriesList] = useState<Enquiry[]>([]);
  const[engineersList, setEngineersList] = useState<Engineer[]>([]);
  const [taskCustomers, setTaskCustomers] = useState<Customer | null>(null);


 useEffect(()=>{
    const fetchData = async () => {
      const enqs2 = await EnquiryService.getById(id!);
      setEnquiry(enqs2);

       const custs = await CustomerService.getById(enqs2.customer.id!);
       setCustomer(custs);

       const engs2 = await OperatorService.getEngineerById(enqs2.assignedEngineerId!);
        setEngineer(engs2);
       
      const engs = await OperatorService.getAllOperators(); 
       setEngineersList(engs);
      
      const enqs = await EnquiryService.getAllEnquiries();
      setEnquiriesList(enqs);
      
    }; fetchData();
    },[id])



  


  const navigate = useNavigate();
  
 
  // const enquiry = getEnquiry(id || "");
  // const customer = enquiry ? getCustomer(enquiry.customer.id) : undefined;
  // const engineer = enquiry?.assignedEngineerId ? getEngineer(enquiry.assignedEngineerId) : undefined;

  const [newRemark, setNewRemark] = useState("");
  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  if (!enquiry || !customer) {
    return <div className="text-center py-12 text-muted-foreground">Enquiry not found. <Button variant="link" onClick={() => navigate("/admin/enquiries")}>Go back</Button></div>;
  }

  const handleAddRemark = () => {
    if (newRemark.trim()) {
      // addRemark(enquiry.id, newRemark.trim());
      EnquiryService.addRemark(enquiry.id, newRemark.trim())
      setNewRemark("");
    }
  };

 const handleAssign = async () => {
  if (isTimeConflict) {
    alert("Engineer is already busy at this time!");
    return;
  }

  if (selectedEngineer && enquiry) {
    await EnquiryService.assignEngineer(enquiry.id, selectedEngineer);
    await EnquiryService.updateStatus(enquiry.id, "SiteVisitScheduled");

    // ✅ UPDATE UI STATE
    setEnquiry({
      ...enquiry,
      assignedEngineerId: selectedEngineer,
      status: "SiteVisitScheduled",
    });

    // also update engineer object
    const eng = await OperatorService.getEngineerById(selectedEngineer);
    setEngineer(eng);

    setAssignDialogOpen(false);
  }
};

  const statusIndex = allStatuses.indexOf(enquiry.status);

  const enquiryDate = enquiry.siteVisit.scheduledDate;

 const engineerTasks = selectedEngineer
  ? enquiriesList.filter((e) => {
      return (
        e.assignedEngineerId === selectedEngineer &&
        e.id !== enquiry.id &&
        e.siteVisit.scheduledDate === enquiryDate //  same day filter
      );
    })
  : [];
const isTimeConflict = engineerTasks.some(
  (t) => t.siteVisit.scheduledTime === enquiry.siteVisit.scheduledTime
);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/enquiries")}><ArrowLeft className="h-5 w-5" /></Button>
        <h2 className="text-2xl font-medium">Enquiry Details</h2>
      </div>

      {/* Status Timeline */}
      <Card className="material-shadow hidden">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-sm font-medium   text-muted-foreground mb-4">STATUS TIMELINE</h3>
          {/* Desktop horizontal */}
          <div className="hidden md:flex items-center justify-between">
            {allStatuses.map((s, i) => {
              const reached = i <= statusIndex;
              const historyEntry = enquiry.statusHistory.find((h) => h.status === s);
              return (
                <div key={s} className="flex flex-col items-center flex-1 relative">
                  {i > 0 && <div className={`absolute top-3 right-1/2 w-full h-0.5 -translate-x-0 ${i <= statusIndex ? "bg-primary" : "bg-border"}`} />}
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${reached ? "bg-primary" : "bg-border"}`}>
                    {reached ? <CheckCircle2 className="h-4 w-4 text-primary-foreground" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <span className={`text-xs mt-2 text-center ${reached ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
                  {historyEntry && <span className="text-[10px] text-muted-foreground">{format(new Date(historyEntry.timestamp), "dd MMM")}</span>}
                </div>
              );
            })}
          </div>
          {/* Mobile vertical */}
          <div className="md:hidden space-y-3">
            {allStatuses.map((s, i) => {
              const reached = i <= statusIndex;
              const historyEntry = enquiry.statusHistory.find((h) => h.status === s);
              return (
                <div key={s} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${reached ? "bg-primary" : "bg-border"}`}>
                      {reached ? <CheckCircle2 className="h-3 w-3 text-primary-foreground" /> : <Circle className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    {i < allStatuses.length - 1 && <div className={`w-0.5 h-6 ${reached ? "bg-primary" : "bg-border"}`} />}
                  </div>
                  <div className="-mt-0.5">
                    <span className={`text-sm ${reached ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
                    {historyEntry && <p className="text-xs text-muted-foreground">{format(new Date(historyEntry.timestamp), "dd MMM yyyy, HH:mm")}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details */}
          <Card className="material-shadow">
            <CardHeader className="pb-3"><CardTitle className="text-base">Customer Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" />{customer.name}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{customer.mobile}</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{customer.email}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{customer.addresses.map((addr) =>`${addr.address1}, ${addr.city}, ${addr.state}`).join(" ,")}</div>
            </CardContent>
          </Card>

          {/* Work Details */}
          <Card className="material-shadow">
            <CardHeader className="pb-3"><CardTitle className="text-base">Work Details</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex gap-2"><Wrench className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" /><div><span className="font-medium">{enquiry.workTypes.map((wt) => wt.name).join(", ")}</span> – {enquiry.workTypes.map((wt) => wt.selectedSubOption).join(", ")}<p className="text-muted-foreground mt-1">{enquiry.description}</p></div></div>
              {engineer && <div className="flex gap-2 pt-2 border-t"><User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" /><div><p className="text-muted-foreground text-xs">Assigned Engineer</p><span className="font-medium">{engineer.name}</span> – {engineer.phone}</div></div>}
            </CardContent>
          </Card>

          {/* Remarks */}
          <Card className="material-shadow">
            <CardHeader className="pb-3"><CardTitle className="text-base">Remarks</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {enquiry.remarks.length === 0 && <p className="text-sm text-muted-foreground">No remarks yet.</p>}
              {enquiry.remarks.map((r) => (
                <div key={r.id} className="text-sm border-l-2 border-primary/30 pl-3">
                  <p>{r.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{r.author} · {format(new Date(r.timestamp), "dd MMM yyyy, HH:mm")}</p>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Input placeholder="Add a remark..." value={newRemark} onChange={(e) => setNewRemark(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddRemark()} />
                <Button size="icon" onClick={handleAddRemark}><Send className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <Card className="material-shadow">
            <CardHeader className="pb-3"><CardTitle className="text-base">Assign Engineer</CardTitle></CardHeader>
            <CardContent>
              <Select value=""
                  onValueChange={(v) => {
                    setSelectedEngineer(v);
                     setAssignDialogOpen(true);
                    }}>
               <SelectTrigger>
                 <SelectValue placeholder="Select engineer" />
               </SelectTrigger>
               <SelectContent>
                {engineersList.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                {e.name} ({e.status})
                  </SelectItem>
                ))}
               </SelectContent>
             </Select>
              <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent>
                  <DialogHeader><DialogTitle>Assign Engineer</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <p className="text-sm">Assigning: <strong>{engineersList.find((e) => e.id === selectedEngineer)?.name}</strong></p>
                   {engineerTasks.length > 0 ? (
  <div>
    <p className="text-sm text-muted-foreground mb-2">
      Tasks on same day ({engineerTasks.length}):
    </p>

    {engineerTasks.map((t)=> {
      // const c = getCustomer(t.customer.id);
      const b= async()=>{
     const a= await CustomerService.getById(t.customer.id);
     setTaskCustomers(a);
     }; b()
   
   
      return (
        <div key={t.id} className="text-sm border rounded p-2 mb-1">
          <p className="font-medium">{taskCustomers?.name}</p>
          <p className="text-xs text-muted-foreground">
            {t.status}
          </p>

          {/* Show date & time */}
          <p className="text-xs">
            {format(new Date(t.siteVisit.scheduledDate), "dd MMM yyyy")} • {t.siteVisit.scheduledTime}
          </p>
        </div>
      );
    })}
  </div>
) : (
  <p className="text-sm text-success">
    No tasks on this day. Engineer is free.
  </p>
)}
{isTimeConflict && (
  <p className="text-sm text-red-500">
    ⚠ Engineer already has a task at this time!
  </p>
)}
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAssign}>Confirm</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

            {/* update status */}
          {/* <Card className="material-shadow">
            <CardHeader className="pb-3"><CardTitle className="text-base">Update Status</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {allStatuses.filter((s) => s !== "Pending").map((s) => (
                <Button
                  key={s}
                   variant={enquiry.status === s ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => updateEnquiryStatus(enquiry.id, s)}
                  disabled={enquiry.status === s}
                >
                  {s}
                </Button>
              ))}
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default EnquiryDetailPage;
