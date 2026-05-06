import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Search, CalendarIcon, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnquiryStatus } from "@/types/enquiry";
import type { DateRange } from "react-day-picker";
import { CustomerService } from "@/services/customer.service";
import { EnquiryService } from "@/services/enquiry.service";
import { OperatorService } from "@/services/operator.service";
import { Enquiry } from "@/types/enquiry";
import { Customer } from "@/types/customer";
import { Engineer } from "@/types/engineer";

const allStatuses: EnquiryStatus[] = ["Pending", "SiteVisitScheduled", "SiteVisitRescheduled", "SiteVisitCompleted", "ReadyForQuotation", "Completed"];
const workTypes = ["Electrical", "Plumbing", "HVAC", "Civil"];

const statusColors: Record<string, string> = {
 "Pending": "bg-amber-50 text-amber-600 border-amber-200",
  "SiteVisitScheduled": "bg-primary/10 text-primary border-primary/20",
  "SiteVisitRescheduled": "bg-orange-50 text-orange-600 border-orange-200",
  "SiteVisitCompleted": "bg-violet-50 text-violet-600 border-violet-200",
  "ReadyForQuotation": "bg-accent/10 text-accent border-accent/20",
  "Completed": "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const EnquiriesPage = () => {


  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);

  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [workTypeFilter, setWorkTypeFilter] = useState("all");
  const [engineerFilter, setEngineerFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
   const[customersList, setCustomersList] = useState<Customer[]>([]);;
    const [enquiriesList, setEnquiriesList] = useState<Enquiry[]>([]);
    const[engineersList, setEngineersList] = useState<Engineer[]>([]);
  
    useEffect(() => {
      const fetchData = async () => {
        const engs = await OperatorService.getAllOperators(); 
        setEngineersList(engs);
  
        const enqs = await EnquiryService.getAllEnquiries();
        setEnquiriesList(enqs);
        const custs = await CustomerService.getAllCustomers();
        setCustomersList(custs);
      };
      fetchData();
    }, []);


  const filtered = useMemo(() => {
    return enquiriesList.filter((enq) => {
      const cust = customersList.find((c) => c.id === enq.customer.id);
      if (statusFilter !== "all" && enq.status !== statusFilter) return false;
      if (workTypeFilter !== "all" && !enq.workTypes?.some((wt) => wt.name === workTypeFilter)) return false;
      if (engineerFilter !== "all" && enq.assignedEngineerId !== engineerFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = cust?.name.toLowerCase().includes(q);
        const matchesMobile = cust?.mobile.includes(q);
        if (!matchesName && !matchesMobile) return false;
      }
      if (dateRange?.from) {
        const created = new Date(enq.createdAt);
        const from = startOfDay(dateRange.from);
        const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
        if (!isWithinInterval(created, { start: from, end: to })) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [enquiriesList, customersList, statusFilter, workTypeFilter, engineerFilter, searchQuery, dateRange]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
      <h2 className="text-2xl font-medium">Enquiries</h2>
       <Button
        variant={showFilters ? "default" : "outline"}
        size="icon"
         onClick={() => setShowFilters((prev) => !prev)}
         >
          <Filter className="h-4 w-4" />
        </Button>
        </div>
        <div className={cn(
  "transition-all duration-300 overflow-hidden",
  showFilters ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
)}>
      <Card className="material-shadow ">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search name or mobile..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("justify-start text-left font-normal", !dateRange?.from && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? `${format(dateRange.from, "dd MMM")} – ${format(dateRange.to, "dd MMM")}` : format(dateRange.from, "dd MMM yyyy")
                  ) : "Date range"}
                  {dateRange?.from && (
                    <X className="ml-auto h-3 w-3 shrink-0 opacity-50 hover:opacity-100" onClick={(e) => { e.stopPropagation(); setDateRange(undefined); }} />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={1} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {allStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
              <SelectTrigger><SelectValue placeholder="Work Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Work Types</SelectItem>
                {workTypes.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={engineerFilter} onValueChange={setEngineerFilter}>
              <SelectTrigger><SelectValue placeholder="Engineer" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Engineers</SelectItem>
                {engineersList.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((enq) => {
          const cust = customersList.find((c) => c.id === enq.customer.id);
          return (
            <Card key={enq.id} className="material-shadow cursor-pointer hover:material-shadow-lg transition-shadow" onClick={() => navigate(`/admin/enquiries/${enq.id}`)}>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{cust?.name}</span>
                  <Badge variant="outline" className={statusColors[enq.status]}>{enq.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{cust?.mobile}</p>
                  <p>{enq.workTypes.map((wt) => wt.name).join(", ")} – {enq.workTypes.map((wt)=>wt.selectedSubOption).join(",")}</p>
                  <p>{format(new Date(enq.createdAt), "dd MMM yyyy")}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Desktop table */}
      <Card className="material-shadow hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground bg-muted/30">
                  <th className="p-3">Customer</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Work Type</th>
                  <th className="p-3">Engineer</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((enq) => {
                  const cust =  customersList.find((c) => c.id === enq.customer.id);
                  const eng = engineersList.find((e) => e.id === enq.assignedEngineerId);
                  return (
                    <tr key={enq.id} className="border-b last:border-0 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => navigate(`/admin/enquiries/${enq.id}`)}>
                      <td className="p-3 font-medium">{cust?.name}</td>
                      <td className="p-3">{cust?.mobile}</td>
                      <td className="p-3">{enq.workTypes.map((wt) => wt.name).join(", ")}</td>
                      <td className="p-3">{eng?.name || "—"}</td>
                      <td className="p-3"><Badge variant="outline" className={statusColors[enq.status]}>{enq.status}</Badge></td>
                      <td className="p-3 text-muted-foreground">{format(new Date(enq.createdAt), "dd MMM yyyy")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No enquiries found matching your filters.</div>
      )}
    </div>
  );
};

export default EnquiriesPage;
