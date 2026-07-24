import React from "react";
import {Button} from "@/components/ui/button";
import OperatorLayout from "../components/OperatorLayout";
import {useOperatorStore} from "@/stores/OperatorStore/operatorStore";
import {Card, CardContent} from "@/components/ui/card";
import {toast} from "sonner";
import {Activity, CheckCircle2, BriefcaseBusiness} from "lucide-react";

const Availability = () => {
  const {enquiries} = useOperatorStore();

  const activeTasks = enquiries.filter(
    (e) => e.status !== "Completed" && e.status !== "Ready For Quotation",
  );

  const isAvailable = activeTasks.length === 0;

  const completedTasks = enquiries
    .filter(
      (e) => e.status === "Completed" || e.status === "Ready For Quotation",
    )
    .sort((a, b) => {
      const dateA = new Date(
        b.statusHistory?.[b.statusHistory.length - 1]?.timestamp || 0,
      ).getTime();

      const dateB = new Date(
        a.statusHistory?.[a.statusHistory.length - 1]?.timestamp || 0,
      ).getTime();

      return dateA - dateB;
    });

  const lastCompletedTask = completedTasks[0];

  return (
    <OperatorLayout title="Availability">
      <div className="space-y-4">
        {/* Availability Status */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center
        ${isAvailable ? "bg-green-100" : "bg-orange-100"}`}
            >
              <Activity className="h-10 w-10" />
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              {isAvailable ? "Available" : "Busy"}
            </h2>

            <p className="text-muted-foreground">
              Active Tasks:
              {activeTasks.length}
            </p>
          </CardContent>
        </Card>

        {/* Last Completed Task */}

        <Card className="border-0 shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />

              <div>
                <p className="font-medium">Last Completed Task</p>

                {lastCompletedTask ? (
                  <>
                    <p className="font-medium">
                      {lastCompletedTask.EnquiryNumber}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {lastCompletedTask.customer?.name || "Customer"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {lastCompletedTask.siteVisit?.scheduledDate
                        ?.split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No completed tasks yet
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Task */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness />

              <div>
                <p className="font-medium">Need More Work?</p>

                <p className="text-sm text-muted-foreground">
                  Notify admin that you are available.
                </p>
              </div>
            </div>

            <Button
              className="w-full mt-4"
              onClick={() => toast.success("Task requested")}
            >
              Request Task
            </Button>
          </CardContent>
        </Card>
      </div>
    </OperatorLayout>
  );
};

export default Availability;
