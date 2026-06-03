import {Enquiry, EnquiryStatus} from "@/types/enquiry";
import getVisitDateStatus from "@/components/VisitDateConvertor";

const today = new Date().toISOString().split("T")[0];

const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);

const tomorrow = tomorrowDate.toISOString().split("T")[0];

export const statusColors: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-600 border-amber-200",
  "Site Visit Scheduled": "bg-primary/10 text-primary border-primary/20",
  "Site Visit Rescheduled": "bg-orange-50 text-orange-600 border-orange-200",
  "Site Visit Completed": "bg-violet-50 text-violet-600 border-violet-200",
  "Ready For Quotation": "bg-accent/10 text-accent border-accent/20",
  Completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

export const cardColors: Record<string, string> = {
  Today: "bg-blue-100 text-blue-600",
  Tomorrow: "bg-violet-100 text-violet-600",
  Overdue: "bg-red-100 text-red-600",
  "My Tasks": "bg-primary/10 text-primary",
  Upcoming: "bg-info/10 text-info",
  Completed: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Rescheduled: "bg-destructive/10 text-destructive",
};

export const trafficColors = {
  Normal: "bg-green-50 text-green-600 border-green-200",

  Moderate: "bg-orange-50 text-orange-600 border-orange-200",

  Heavy: "bg-red-50 text-red-600 border-red-200",
};

export const filterMap: Record<
  string,
  (status: string, task?: Enquiry) => boolean
> = {
  Today: (_, task) => task?.siteVisit?.scheduledDate?.split("T")[0] === today,

  Tomorrow: (_, task) =>
    task?.siteVisit?.scheduledDate?.split("T")[0] === tomorrow,

  Overdue: (_, task) => getVisitDateStatus(task).text === "Visit overdue",

  "My Tasks": () => true,
  Upcoming: (s) => s === "Site Visit Scheduled",
  Completed: (s) => s === "Site Visit Completed" || s === "Completed",
  Pending: (s) => s === "Pending" || s === "Ready For Quotation",
  // Rescheduled: (_, task) =>
  //   task?.statusHistory?.some((h) => h.status === "Site Visit Rescheduled"),
  Rescheduled: (s) => s === "Site Visit Rescheduled",
};

export const badgeColors = {
  Today: "bg-blue-500",
  Tomorrow: "bg-violet-500",
  Upcoming: "bg-black",
  Pending: "bg-yellow-500",
  Completed: "bg-success",
  Rescheduled: "bg-red-500",
};
