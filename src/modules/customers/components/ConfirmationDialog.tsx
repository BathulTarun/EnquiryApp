import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ConfirmationDialogProps {
  open: boolean;
  enquiryId: string;
  onClose: () => void;
}

const ConfirmationDialog = ({ open, enquiryId, onClose }: ConfirmationDialogProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="text-center max-w-sm">
      <DialogHeader className="items-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-2">
          <CheckCircle size={36} className="text-success" />
        </div>
        <DialogTitle className="text-xl">Enquiry Submitted!</DialogTitle>
        <DialogDescription>
          Your enquiry has been successfully registered.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <p className="text-sm text-muted-foreground">Enquiry ID</p>
        <p className="text-2xl font-bold text-primary">{enquiryId}</p>
      </div>
      <Button onClick={onClose} className="w-full">
        Done
      </Button>
    </DialogContent>
  </Dialog>
);

export default ConfirmationDialog;
