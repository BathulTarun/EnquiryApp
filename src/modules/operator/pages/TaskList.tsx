import React, {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {EnquiryStatus} from "@/types/enquiry";
import {Badge} from "@/components/ui/badge";
import {ArrowLeft, Phone, MapPin, Clock, Calendar} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useProductStore} from "@/stores/productStore";
import {useOperatorStore} from "@/stores/OperatorStore/operatorStore";
import getVisitDateStatus from "@/components/VisitDateConvertor";
import {filterMap} from "../utils/task.constants";
import {statusColors} from "../utils/task.constants";
const TaskList: React.FC = () => {
  const {productNames, loadProducts} = useProductStore();

  const {enquiries, fetchEnquiries} = useOperatorStore();

  useEffect(() => {
    fetchEnquiries(engineerId);
  }, []);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "My Tasks";
  const engineerId = searchParams.get("engineerId");
  const fn = filterMap[filter] || filterMap["My Tasks"];
  const filtered = enquiries.filter((t) => fn(t.status, t));

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-material sticky top-0 z-10">
        <div className="container flex items-center gap-3 h-14">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/operator/dashboard`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-card-foreground">
            {filter}
          </h1>
          <span className="ml-auto text-sm text-muted-foreground">
            {filtered.length} tasks
          </span>
        </div>
      </header>

      <main className="container py-4 space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No tasks found.
          </p>
        )}
        {filtered.map((task) => (
          <button
            key={task.id}
            onClick={() =>
              navigate(`/operator/tasks/${task.id}`, {
                state: {enquiry: task},
              })
            }
            className="w-full bg-card rounded-lg shadow-material-sm p-4 text-left hover:shadow-material transition-shadow"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="font-medium text-card-foreground">
                {task.customer.name}
              </p>
              <Badge variant="outline" className={statusColors[task.status]}>
                {task.status}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>{task.customer.mobile}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {task.address.address1},{task.address.city},
                  {task.address.state}
                </span>
              </div>
              <div className="flex items-center gap-2 text-card-foreground">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs">
                  {task.siteVisit?.scheduledDate
                    ?.split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-")}
                </span>
                <Badge
                  variant="outline"
                  className={`border-0 h-4 ${getVisitDateStatus(task).badge}`}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${getVisitDateStatus(task).dot}`}
                  />

                  <p className={` pl-2  ${getVisitDateStatus(task).color}`}>
                    {getVisitDateStatus(task).text}
                  </p>
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-card-foreground">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs">{task.siteVisit.scheduledTime}</span>
              </div>
            </div>
          </button>
        ))}
      </main>
    </div>
  );
};

export default TaskList;
