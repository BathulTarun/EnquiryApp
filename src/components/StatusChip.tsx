import { EnquiryStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<EnquiryStatus, string> = {
  "Pending": "bg-status-pending/15 text-status-pending",
  "Site Visit Scheduled": "bg-status-scheduled/15 text-status-scheduled",
  "Site Visit Rescheduled": "bg-status-rescheduled/15 text-status-rescheduled",
  "Site Visit Completed": "bg-status-completed/15 text-status-completed",
  "Ready For Quotation": "bg-status-quotation/15 text-status-quotation",
  "Completed": "bg-status-done/15 text-status-done",
};

export function StatusChip({ status, className }: { status: EnquiryStatus; className?: string }) {
  return (
    <span className={cn("status-chip", statusStyles[status], className)}>
      {status}
    </span>
  );
}
