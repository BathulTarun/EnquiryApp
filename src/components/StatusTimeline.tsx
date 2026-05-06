import { EnquiryStatus } from "@/lib/types";
import { CheckCircle2, Circle } from "lucide-react";

interface TimelineItem {
  status: EnquiryStatus;
  date: string;
  note?: string;
}

export function StatusTimeline({ history }: { history: TimelineItem[] }) {
  return (
    <div className="relative pl-6 space-y-4">
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
      {history.map((item, i) => (
        <div key={i} className="relative flex items-start gap-3">
          <div className="absolute -left-6 mt-0.5">
            {i === history.length - 1 ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{item.status}</p>
            <p className="text-xs text-muted-foreground">{item.date}</p>
            {item.note && <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
