
import { Enquiry } from "@/types/enquiry";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";



interface EnquiryDialogProps {
  open: boolean;
 
  onClose: () => void;
  enquiry?: Enquiry;
  engineers: { id: string; name: string }[];
}


const statusColor: Record<string, string> = {
 "Pending": "bg-amber-50 text-amber-600 border-amber-200",
  "SiteVisitScheduled": "bg-primary/10 text-primary border-primary/20",
  "SiteVisitRescheduled": "bg-orange-50 text-orange-600 border-orange-200",
  "SiteVisitCompleted": "bg-violet-50 text-violet-600 border-violet-200",
  "ReadyForQuotation": "bg-accent/10 text-accent border-accent/20",
  "Completed": "bg-emerald-50 text-emerald-600 border-emerald-200",
  
};

const EnquiryDetailsDialog = ({ open, onClose, enquiry, engineers }:EnquiryDialogProps) => (

 
 
    <Drawer  open={open} onOpenChange={onClose}>
      <DrawerContent >
        <DrawerHeader>
          <DrawerTitle>Enquiry Details</DrawerTitle>
        </DrawerHeader>
        
        <div className="space-y-2 text-sm p-2">
            
          <p><strong>ID:</strong> {enquiry.id}</p>
           <Badge className={statusColor[enquiry.status]}>{enquiry.status}</Badge>

          {/* Scheduled */}
          {enquiry.status === "SiteVisitScheduled" && (
            <>
              <p><strong>Engineer:</strong> {engineers.find(e => e.id === enquiry.assignedEngineerId)?.name}</p>
              <p><strong>Date:</strong> {enquiry.siteVisit?.scheduledDate}</p>
              <p><strong>Time:</strong> {enquiry.siteVisit?.scheduledTime}</p>
            </>
          )}

          {/* Rescheduled */}
          {enquiry.status === "SiteVisitRescheduled" && (
            <>
              <p><strong>New Date:</strong> {enquiry.siteVisit?.rescheduledDate}</p>
              <p><strong>New Time:</strong> {enquiry.siteVisit?.rescheduledTime}</p>
              <p><strong>Reason:</strong> {enquiry.siteVisit?.rescheduleReason}</p>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer >
  );


export default EnquiryDetailsDialog;