import {EnquiryStatus} from "@/types/enquiry";
import {cn} from "@/lib/utils";

const statusStyles: Record<EnquiryStatus, string> = {
  Pending: "bg-status-pending/15 text-status-pending",
  SiteVisitScheduled: "bg-status-scheduled/15 text-status-scheduled",
  SiteVisitRescheduled: "bg-status-rescheduled/15 text-status-rescheduled",
  SiteVisitCompleted: "bg-status-completed/15 text-status-completed",
  ReadyForQuotation: "bg-status-quotation/15 text-status-quotation",
  Completed: "bg-status-done/15 text-status-done",
};

export function StatusChip({
  status,
  className,
}: {
  status: EnquiryStatus;
  className?: string;
}) {
  return (
    <span className={cn("status-chip", statusStyles[status], className)}>
      {status}
    </span>
  );
}
