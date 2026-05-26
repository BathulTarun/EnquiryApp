import {Enquiry} from "@/types/enquiry";
const getVisitDateStatus = (task: Enquiry) => {
  if (!task.siteVisit?.scheduledDate) {
    return {
      text: "",
      color: "text-gray-500",
      badge: "",
      dot: "bg-gray-500",
    };
  }

  const visitDate = new Date(task.siteVisit.scheduledDate);
  const today = new Date();

  // remove time difference issues
  visitDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = Math.ceil(
    (visitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff === 0) {
    return {
      text: "Visit scheduled today",
      color: "text-green-600",
      badge: "",
      dot: "bg-green-500",
    };
  }

  if (diff === 1) {
    return {
      text: "Visit scheduled tomorrow",
      color: "text-blue-600",
      badge: "",
      dot: "bg-blue-500",
    };
  }

  if (
    diff < 0 &&
    task.status !== "Completed" &&
    task.status !== "ReadyForQuotation"
  ) {
    return {
      text: "Visit overdue",
      color: "text-red-600",
      badge: "",
      dot: "bg-red-500",
    };
  }

  if (
    diff < 0 &&
    (task.status === "Completed" || task.status === "ReadyForQuotation")
  ) {
    return {
      text: "Visit Done",
      color: "text-emerald-600",
      badge: "",
      dot: "bg-emerald-500",
    };
  }

  return {
    text: `Visit in ${diff} days`,
    color: "text-orange-600",
    badge: "",
    dot: "bg-orange-500",
  };
};

export default getVisitDateStatus;
