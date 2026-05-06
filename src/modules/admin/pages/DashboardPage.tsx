import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {  Clock, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import React,{ useEffect, useState} from "react";
import { EnquiryService } from "@/services/enquiry.service";
import { CustomerService } from "@/services/customer.service";
import {  Enquiry } from "@/types/enquiry";
import { Customer } from "@/types/customer";

const statusColors: Record<string, string> = {  
 "Pending": "bg-amber-50 text-amber-600 border-amber-200",
  "SiteVisitScheduled": "bg-primary/10 text-primary border-primary/20",
  "SiteVisitRescheduled": "bg-orange-50 text-orange-600 border-orange-200",
  "SiteVisitCompleted": "bg-violet-50 text-violet-600 border-violet-200",
  "ReadyForQuotation": "bg-accent/10 text-accent border-accent/20",
  "Completed": "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [enquiriesList, setEnquiriesList] = React.useState<Enquiry[]>([]);
  const[customersList, setCustomersList] = React.useState<Customer[]>([]);
  

useEffect(() => {
  const enquiries=async()=>{
    const res= await EnquiryService.getAllEnquiries();
    setEnquiriesList(res);

  }; enquiries();
}, []);  
useEffect(() => {
  const customers=async()=>{
    const res= await CustomerService.getAllCustomers();
    setCustomersList(res);
  }; customers();
}, []);



  const stats = [ 
    // { label: "Total Enquiries", value: enquiries.length, icon: ClipboardList, filter: "", color: "bg-primary" },
    { label: "Pending", value: enquiriesList.filter((e) => e.status === "Pending").length, icon: Clock, filter: "Pending", color: "bg-warning" },
    // { label: "Completed", value: enquiries.filter((e) => e.status === "Completed").length, icon: CheckCircle2, filter: "Completed", color: "bg-success" },
    { label: "Rescheduled", value: enquiriesList.filter((e) => e.status === "SiteVisitRescheduled").length, icon: RotateCcw, filter: "Site Visit Rescheduled", color: "bg-destructive" },
    // { label: "Engineers", value: engineers.length, icon: Users, filter: "", color: "bg-accent" },
  ];

  

  const recent = [...enquiriesList].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-medium">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="cursor-pointer hover:material-shadow-lg transition-shadow material-shadow"
            onClick={() => {
              if (s.label === "Engineers") navigate("/admin/engineers");
              else navigate(s.filter ? `/admin/enquiries?status=${encodeURIComponent(s.filter)}` : "/admin/enquiries");
            }}
          >
            <CardContent className="p-2 flex flex-row  items-center text-center gap-2">
              <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center`}>
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="material-shadow">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-lg font-medium mb-4">Recent Enquiries</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4">Customer</th>
                  <th className="pb-2 pr-4 hidden sm:table-cell">Mobile</th>
                  <th className="pb-2 pr-4">Work Type</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((enq) => {
                  const cust = customersList.find((c) => c.id === enq.customer.id);
                 
                  return (
                    <tr
                      key={enq.id}
                      className="border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate(`/admin/enquiries/${enq.id}`)}
                    >
                      <td className="py-3 pr-4 font-medium">{cust?.name}</td>
                      <td className="py-3 pr-4 hidden sm:table-cell">{cust?.mobile}</td>
                      <td className="py-3 pr-4">{enq.workTypes.map((wt) => wt.name).join(", ")}</td>
                      <td className="py-3 pr-4">
                        <Badge variant="outline" className={statusColors[enq.status]}>{enq.status}</Badge>
                      </td>
                      <td className="py-3 hidden md:table-cell text-muted-foreground">{format(new Date(enq.createdAt), "dd MMM yyyy")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
