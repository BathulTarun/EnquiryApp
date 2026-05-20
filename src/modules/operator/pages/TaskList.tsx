import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EnquiryStatus } from "@/types/enquiry";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OperatorService } from "@/services/operator.service";
import { Enquiry } from "@/types/enquiry";
import WorkTypeService from "@/services/worktype.service";
import { Product } from "@/types/common";
import Dashboard from "./Dashboard";


const filterMap: Record<string, (s: EnquiryStatus) => boolean> = {
  "My Tasks": () => true,
  Upcoming: (s) => s === "SiteVisitScheduled",
  Completed: (s) => s === "SiteVisitCompleted" || s === "Completed",
  Pending: (s) => s === "Pending",
  Rescheduled: (s) => s === "SiteVisitRescheduled",
};

const TaskList: React.FC = () => {

 const [productNames, setProductNames] = React.useState<Record<string, string>>({});

  const statusColors: Record<string, string> = {  
  "Pending": "bg-amber-50 text-amber-600 border-amber-200",
  "SiteVisitScheduled": "bg-primary/10 text-primary border-primary/20",
  "SiteVisitRescheduled": "bg-orange-50 text-orange-600 border-orange-200",
  "SiteVisitCompleted": "bg-violet-50 text-violet-600 border-violet-200",
  "ReadyForQuotation": "bg-accent/10 text-accent border-accent/20",
  "Completed": "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const[tasks,setTasks] =  React.useState<Enquiry[]>([]);

 useEffect(() => {
  const enquiries = async()=>{
    // const res=await OperatorService.getTasksByEngineer(engineerId!);
    const res=await OperatorService.getEnquriesByOperatorId(Number(engineerId!));
    setTasks(res);
    console.log("Enquiries for engineer:", res);
  };
  enquiries();
  }, []);
  
  useEffect(() => {
  const loadProducts = async () => {
    const ids = tasks.flatMap(task =>
      task.workItems?.map(w => w.productsId) || []
    );

    const uniqueIds = [...new Set(ids)];

    const productMap: Record<string, string> = {};

    for (const id of uniqueIds) {
      try {
        const product = await WorkTypeService.getProductsByID(id);
        productMap[id] = product?.Name || "";
      } catch (error) {
        console.error("Failed to fetch product:", id);
      }
    }

    setProductNames(productMap);
  };

  if (tasks.length > 0) {
    loadProducts();
  }
}, [tasks]);


  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "My Tasks";
  const engineerId = searchParams.get("engineerId");
  const fn = filterMap[filter] || filterMap["My Tasks"];
  const filtered = tasks.filter((t) => fn(t.status));
 


  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-material sticky top-0 z-10">
        <div className="container flex items-center gap-3 h-14">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/operator/dashboard/${engineerId}`)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-card-foreground">{filter}</h1>
          <span className="ml-auto text-sm text-muted-foreground">{filtered.length} tasks</span>
        </div>
      </header>

      <main className="container py-4 space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No tasks found.</p>
        )}
        {filtered.map((task) => (
          <button
            key={task.id}
            onClick={() => navigate(`/operator/tasks/${task.id}`,{
                  state: { enquiry: task }
                })}
            className="w-full bg-card rounded-lg shadow-material-sm p-4 text-left hover:shadow-material transition-shadow"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="font-medium text-card-foreground">{task.customer.name}</p>
              <Badge variant="outline" className={statusColors[task.status]}>{task.status}</Badge>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>{task.customer.mobile}</span>
                <span className="ml-auto"> {task.workItems
    ?.map((w) => {
      const subCat = w.subCategoryName
        ? ` - ${w.subCategoryName}`
        : "";
      
      const product = productNames[w.productsId]
  ? ` (${productNames[w.productsId]})`
  : "";
      

      return `${product}`;
    })
    .join(", ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {/* <span className="truncate">{task.customer.addresses.map((addr) =>`${addr.address1}, ${addr.city}, ${addr.state}`).join(" ,")}</span> */}
                <span className="truncate">{task.address.address1},{task.address.city},{task.address.state}</span>
              </div>
              <p className="text-xs">{task.siteVisit?.scheduledDate?.split("T")[0]
  .split("-")
  .reverse()
  .join("-") || "Not scheduled"}, {task.siteVisit?.scheduledTime || ""}</p>
            </div>
          </button>
        ))}
      </main>
    </div>
  );
};

export default TaskList;
