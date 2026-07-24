import React, {useEffect, useState} from "react";
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
import {Input} from "@/components/ui/input";
import {Card, CardContent} from "@/components/ui/card";
import {ArrowLeftRight} from "lucide-react";
const TaskList: React.FC = () => {
  const {productNames, loadProducts} = useProductStore();

  const {enquiries, fetchEnquiries} = useOperatorStore();

  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchEnquiries(engineerId);
  }, []);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "My Tasks";
  const engineerId = searchParams.get("engineerId");
  const fn = filterMap[filter] || filterMap["My Tasks"];
  // const filtered = enquiries.filter((t) => fn(t.status, t));
  const hasTasks = enquiries.some((t) => fn(t.status, t));

  const filtered = enquiries.filter((task) => {
    if (!fn(task.status, task)) return false;

    const searchText = search.toLowerCase();

    const matchesSearch =
      task.customer?.name?.toLowerCase().includes(searchText) ||
      task.customer?.mobile?.toLowerCase().includes(searchText) ||
      task.EnquiryNumber?.toLowerCase().includes(searchText);

    if (!matchesSearch) return false;

    const taskDate = task.siteVisit?.scheduledDate?.split("T")[0];

    if (fromDate && taskDate < fromDate) return false;

    if (toDate && taskDate > toDate) return false;

    return true;
  });
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
          {/* <span className="ml-auto text-sm text-muted-foreground">
            {filtered.length} tasks
          </span> */}
          <Badge variant="secondary" className="ml-auto font-medium">
            {filtered.length} Tasks
          </Badge>
        </div>
      </header>
      <main className="container py-4">
        {hasTasks && (
          <Card className="mb-4 shadow-sm">
            <CardContent className="p-4 space-y-3">
              <Input
                placeholder="Search Enquiry, Customer or Mobile"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="flex-1"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-3" />

            <h3 className="font-semibold text-lg">No Tasks Found</h3>

            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              There are no tasks available for this category at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
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
                <p className="font-medium text-card-foreground">
                  {task.EnquiryNumber || `ENQ-${task.id}`}
                </p>

                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-medium text-card-foreground">
                    {task.customer.name}
                  </p>

                  <Badge
                    variant="outline"
                    className={statusColors[task.status]}
                  >
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

                      <p className={`pl-2 ${getVisitDateStatus(task).color}`}>
                        {getVisitDateStatus(task).text}
                      </p>
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-card-foreground">
                    <Clock className="w-3 h-3 text-muted-foreground" />

                    <span className="text-xs">
                      {task.siteVisit.scheduledTime}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskList;
